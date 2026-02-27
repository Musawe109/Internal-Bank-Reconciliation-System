"""Data ingestion service for CSV parsing and Oracle fetch."""

import csv
import hashlib
import io
import logging
from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import List, Optional, Tuple

from sqlmodel import Session

from app.core.exceptions import ValidationError
from app.db.oracle import fetch_internal_transactions
from app.models.reconciliation import ReconciliationSession
from app.models.transaction import BankTransaction, InternalTransaction

logger = logging.getLogger(__name__)

# Required CSV columns
REQUIRED_COLUMNS = {"amount", "reference", "date", "description"}


def parse_csv(file_content: bytes) -> Tuple[List[dict], List[dict]]:
    """Parse uploaded CSV file and validate data.

    Args:
        file_content: Raw bytes from uploaded file

    Returns:
        Tuple of (valid_records, errors)

    Raises:
        ValidationError: If CSV format is invalid
    """
    errors = []
    records = []

    try:
        # Decode and read CSV
        content = file_content.decode("utf-8")
        reader = csv.DictReader(io.StringIO(content))

        # Validate headers
        if reader.fieldnames is None:
            raise ValidationError(
                "CSV file is empty or has no headers",
                details={"errorCode": "INVALID_FILE_FORMAT"},
            )

        # Check required columns
        headers = {col.lower().strip() for col in reader.fieldnames}
        missing = REQUIRED_COLUMNS - headers
        if missing:
            raise ValidationError(
                f"Missing required columns: {', '.join(missing)}",
                details={"errorCode": "MISSING_COLUMNS", "missingColumns": list(missing)},
            )

        # Parse rows
        for row_num, row in enumerate(reader, start=2):  # Start at 2 (1 is header)
            try:
                record = normalize_bank_transaction(row)
                records.append(record)
            except ValueError as e:
                errors.append({
                    "rowNumber": row_num,
                    "errorMessage": str(e),
                    "fieldValue": row.get("amount", ""),
                })

        return records, errors

    except csv.Error as e:
        raise ValidationError(
            f"Invalid CSV format: {str(e)}",
            details={"errorCode": "INVALID_FILE_FORMAT"},
        )


def normalize_bank_transaction(row: dict) -> dict:
    """Normalize a CSV row to bank transaction data.

    Args:
        row: CSV row dictionary

    Returns:
        Normalized transaction dictionary

    Raises:
        ValueError: If data is invalid
    """
    # Normalize column names (lowercase, strip whitespace)
    normalized = {k.lower().strip(): v for k, v in row.items()}

    # Validate and parse amount
    amount_str = normalized.get("amount", "").strip()
    try:
        amount = Decimal(amount_str)
        if amount <= 0:
            raise ValueError("Amount must be positive")
    except Exception:
        raise ValueError(f"Invalid amount: {amount_str}")

    # Validate reference
    reference = normalized.get("reference", "").strip()
    if not reference:
        raise ValueError("Reference is required")

    # Validate and parse date
    date_str = normalized.get("date", "").strip()
    try:
        parsed_date = parse_date(date_str)
    except Exception:
        raise ValueError(f"Invalid date format: {date_str}")

    # Optional fields
    description = normalized.get("description", "").strip() or None
    transaction_type = normalized.get("transaction_type", "").strip() or None
    transaction_type = transaction_type or normalized.get("transactiontype", "").strip() or None

    return {
        "amount": amount,
        "reference": reference,
        "date": parsed_date,
        "description": description,
        "transaction_type": transaction_type,
    }


def parse_date(date_str: str) -> date:
    """Parse date string to date object.

    Supports multiple formats:
    - YYYY-MM-DD
    - DD/MM/YYYY
    - MM/DD/YYYY

    Args:
        date_str: Date string

    Returns:
        date object

    Raises:
        ValueError: If format is unrecognized
    """
    formats = [
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%Y/%m/%d",
        "%d-%m-%Y",
        "%m-%d-%Y",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue

    raise ValueError(f"Unrecognized date format: {date_str}")


def fetch_internal_records(
    session: ReconciliationSession,
    db: Session,
) -> List[InternalTransaction]:
    """Fetch internal transactions from Oracle and store in PostgreSQL.

    Falls back to mock data if Oracle is not available.

    Args:
        session: Reconciliation session
        db: Database session

    Returns:
        List of created InternalTransaction records
    """
    # Calculate date range from bank transactions
    min_date = session.created_at.date()
    max_date = min_date

    # Get date range from bank transactions if available
    if session.bank_transactions:
        dates = [tx.date for tx in session.bank_transactions]
        min_date = min(dates)
        max_date = max(dates)

    # Expand date range by tolerance (±2 days)
    from datetime import timedelta
    min_date -= timedelta(days=2)
    max_date += timedelta(days=2)

    # Try to fetch from Oracle, fall back to mock data
    try:
        oracle_records = fetch_internal_transactions(
            start_date=min_date.isoformat(),
            end_date=max_date.isoformat(),
        )
        logger.info(f"Fetched {len(oracle_records)} records from Oracle")
    except Exception as e:
        logger.warning(f"Oracle not available, using mock data: {e}")
        from app.services.mock_data import fetch_mock_internal_records
        oracle_records = fetch_mock_internal_records(
            start_date=min_date.isoformat(),
            end_date=max_date.isoformat(),
        )

    # Store in PostgreSQL
    internal_transactions = []
    for record in oracle_records:
        internal_tx = InternalTransaction(
            amount=Decimal(str(record["AMOUNT"])),
            reference=record["REFERENCE_NUMBER"],
            date=record["TRANSACTION_DATE"].date() if isinstance(record["TRANSACTION_DATE"], datetime) else record["TRANSACTION_DATE"],
            description=record.get("DESCRIPTION"),
            account_code=record.get("ACCOUNT_CODE"),
            cost_center=record.get("COST_CENTER"),
            oracle_id=record["TRANSACTION_ID"],
        )
        internal_transactions.append(internal_tx)

    return internal_transactions


def compute_file_hash(content: bytes) -> str:
    """Compute SHA-256 hash of file content."""
    return hashlib.sha256(content).hexdigest()
