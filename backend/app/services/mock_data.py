"""Mock data service for development and testing.

This module provides mock internal transactions when Oracle is not available.
Replace with actual Oracle integration in production.
"""

import logging
from datetime import date, timedelta
from decimal import Decimal
from typing import List
from uuid import uuid4

from app.models.transaction import InternalTransaction

logger = logging.getLogger(__name__)


def generate_mock_internal_transactions(
    date_range_days: int = 7,
    count: int = 50,
) -> List[InternalTransaction]:
    """Generate mock internal transactions for testing.

    Args:
        date_range_days: Number of days to generate transactions for
        count: Approximate number of transactions to generate

    Returns:
        List of InternalTransaction objects
    """
    logger.info(f"Generating {count} mock internal transactions")

    transactions = []
    base_date = date.today()

    # Sample references that will match bank transactions
    sample_references = [
        "TXN001", "TXN002", "TXN003", "TXN004", "TXN005",
        "TXN006", "TXN007", "TXN008", "TXN009", "TXN010",
        "INV001", "INV002", "INV003", "INV004", "INV005",
        "PAY001", "PAY002", "PAY003", "PAY004", "PAY005",
    ]

    # Sample amounts that will create matches and variances
    sample_amounts = [
        Decimal("100.00"),
        Decimal("250.50"),
        Decimal("500.00"),
        Decimal("750.25"),
        Decimal("1000.00"),
        Decimal("1250.75"),
        Decimal("2000.00"),
        Decimal("2500.00"),
        Decimal("3000.50"),
        Decimal("5000.00"),
    ]

    # Sample descriptions
    sample_descriptions = [
        "Payment received",
        "Invoice payment",
        "Wire transfer",
        "Direct deposit",
        "Check payment",
        "Electronic transfer",
        "Refund processed",
        "Service payment",
        "Vendor payment",
        "Customer payment",
    ]

    # Sample account codes
    sample_account_codes = [
        "1000-001", "1000-002", "2000-001", "2000-002",
        "3000-001", "4000-001", "4000-002", "5000-001",
    ]

    # Sample cost centers
    sample_cost_centers = [
        "CC001", "CC002", "CC003", "CC004",
        "FINANCE", "OPERATIONS", "SALES", "IT",
    ]

    for i in range(count):
        # Random date within range
        days_offset = (date_range_days * i) // count
        tx_date = base_date - timedelta(days=days_offset)

        # Select sample data
        reference = sample_references[i % len(sample_references)]
        amount = sample_amounts[i % len(sample_amounts)]
        
        # Add some variance to amounts for testing variance detection
        if i % 7 == 0:  # Every 7th transaction has slight variance
            amount = amount + Decimal("0.50")
        elif i % 11 == 0:  # Every 11th has larger variance
            amount = amount + Decimal("5.00")

        description = sample_descriptions[i % len(sample_descriptions)]
        account_code = sample_account_codes[i % len(sample_account_codes)]
        cost_center = sample_cost_centers[i % len(sample_cost_centers)]

        # Create transaction
        tx = InternalTransaction(
            id=uuid4(),
            amount=amount,
            reference=reference,
            date=tx_date,
            description=description,
            account_code=account_code,
            cost_center=cost_center,
            oracle_id=f"ORA-{uuid4().hex[:8].upper()}",
            fetched_at=date.today(),
        )
        transactions.append(tx)

    logger.info(f"Generated {len(transactions)} mock transactions")
    return transactions


def fetch_mock_internal_records(
    start_date: str,
    end_date: str,
    limit: int = None,
) -> List[dict]:
    """Mock version of fetch_internal_transactions.

    This function mimics the Oracle fetch function but returns mock data.
    Use this for development when Oracle is not available.

    Args:
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        limit: Optional limit on results

    Returns:
        List of transaction dictionaries (mock data)
    """
    logger.info(f"Fetching mock internal transactions from {start_date} to {end_date}")

    # Generate mock transactions
    from datetime import datetime

    start = datetime.strptime(start_date, "%Y-%m-%d").date()
    end = datetime.strptime(end_date, "%Y-%m-%d").date()
    days_range = (end - start).days + 1

    transactions = generate_mock_internal_transactions(
        date_range_days=max(days_range, 7),
        count=limit or 50,
    )

    # Convert to dictionary format matching Oracle response
    results = []
    for tx in transactions:
        results.append({
            "TRANSACTION_ID": tx.oracle_id,
            "AMOUNT": float(tx.amount),
            "REFERENCE_NUMBER": tx.reference,
            "TRANSACTION_DATE": datetime.combine(tx.date, datetime.min.time()),
            "DESCRIPTION": tx.description,
            "ACCOUNT_CODE": tx.account_code,
            "COST_CENTER": tx.cost_center,
        })

    return results


def get_mock_internal_transaction_by_reference(
    reference: str,
) -> InternalTransaction | None:
    """Get a mock internal transaction by reference.

    Args:
        reference: Transaction reference

    Returns:
        InternalTransaction or None
    """
    transactions = generate_mock_internal_transactions(count=100)
    for tx in transactions:
        if tx.reference == reference:
            return tx
    return None
