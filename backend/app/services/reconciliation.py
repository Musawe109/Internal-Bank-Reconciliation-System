"""Reconciliation engine service with O(n log n) matching algorithm."""

import logging
from collections import defaultdict
from decimal import Decimal
from typing import Dict, List, Optional, Tuple

from sqlmodel import Session

from app.models.enums import Classification
from app.models.reconciliation import ReconciliationResult, ReconciliationSession
from app.models.transaction import BankTransaction, InternalTransaction

logger = logging.getLogger(__name__)

# Default date tolerance in days
DEFAULT_DATE_TOLERANCE = 2


def match_transactions(
    bank_transactions: List[BankTransaction],
    internal_transactions: List[InternalTransaction],
    date_tolerance: int = DEFAULT_DATE_TOLERANCE,
) -> List[Tuple[BankTransaction, Optional[InternalTransaction], Classification, Optional[Decimal]]]:
    """Match bank transactions with internal transactions using O(n log n) algorithm.

    Uses hash-based grouping by amount for efficient lookup, then matches
    by reference and date tolerance.

    Args:
        bank_transactions: List of bank transactions
        internal_transactions: List of internal transactions
        date_tolerance: Number of days tolerance for date matching

    Returns:
        List of tuples: (bank_tx, internal_tx, classification, variance_amount)
    """
    results = []

    # Group internal transactions by amount for O(1) lookup
    by_amount: Dict[Decimal, List[InternalTransaction]] = defaultdict(list)
    for internal in internal_transactions:
        by_amount[internal.amount].append(internal)

    # Track matched internal transactions
    matched_internal_ids = set()

    # Process each bank transaction
    for bank in bank_transactions:
        # Find candidates with same amount
        candidates = by_amount.get(bank.amount, [])

        if not candidates:
            # No match by amount - unmatched bank transaction
            results.append((bank, None, Classification.UNMATCHED_BANK_ONLY, None))
            continue

        # Filter by reference (exact match)
        ref_matches = [
            internal for internal in candidates
            if internal.reference == bank.reference
        ]

        if not ref_matches:
            # No match by reference - unmatched bank transaction
            results.append((bank, None, Classification.UNMATCHED_BANK_ONLY, None))
            continue

        # Check date tolerance
        matched = False
        for internal in ref_matches:
            if internal.id in matched_internal_ids:
                continue  # Already matched

            date_diff = abs((bank.date - internal.date).days)
            if date_diff <= date_tolerance:
                # Perfect match
                results.append((bank, internal, Classification.MATCHED, None))
                matched_internal_ids.add(internal.id)
                matched = True
                break

        if not matched:
            # Reference matches but dates don't align - variance
            # Find first unmatched candidate for variance calculation
            for internal in ref_matches:
                if internal.id not in matched_internal_ids:
                    variance = abs(bank.amount - internal.amount)
                    results.append((bank, internal, Classification.VARIANCE_DETECTED, variance))
                    matched_internal_ids.add(internal.id)
                    break
            else:
                # All candidates already matched
                results.append((bank, None, Classification.UNMATCHED_BANK_ONLY, None))

    # Find unmatched internal transactions
    for internal in internal_transactions:
        if internal.id not in matched_internal_ids:
            results.append((None, internal, Classification.UNMATCHED_INTERNAL_ONLY, None))

    return results


def persist_results(
    db: Session,
    session: ReconciliationSession,
    matches: List[Tuple[BankTransaction, Optional[InternalTransaction], Classification, Optional[Decimal]]],
) -> None:
    """Persist reconciliation results to database.

    Args:
        db: Database session
        session: Reconciliation session
        matches: List of match results from match_transactions
    """
    # Count classifications
    counts = {
        Classification.MATCHED: 0,
        Classification.UNMATCHED_BANK_ONLY: 0,
        Classification.UNMATCHED_INTERNAL_ONLY: 0,
        Classification.VARIANCE_DETECTED: 0,
    }

    for bank, internal, classification, variance in matches:
        counts[classification] += 1

        # Create reconciliation result
        result = ReconciliationResult(
            reconciliation_session_id=session.id,
            bank_transaction_id=bank.id if bank else None,
            internal_transaction_id=internal.id if internal else None,
            classification=classification,
            variance_amount=variance,
        )
        db.add(result)

    # Update session counts
    session.matched_count = counts[Classification.MATCHED]
    session.unmatched_bank_count = counts[Classification.UNMATCHED_BANK_ONLY]
    session.unmatched_internal_count = counts[Classification.UNMATCHED_INTERNAL_ONLY]
    session.variance_count = counts[Classification.VARIANCE_DETECTED]
    session.total_bank_transactions = sum(
        1 for bank, _, _, _ in matches if bank is not None
    )
    session.total_internal_records = sum(
        1 for _, internal, _, _ in matches if internal is not None
    )

    # Flush to get IDs
    db.flush()


def compute_summary(session: ReconciliationSession) -> dict:
    """Compute summary statistics for a reconciliation session.

    Args:
        session: Reconciliation session

    Returns:
        Summary dictionary
    """
    return {
        "total_transactions": session.total_bank_transactions,
        "matched": session.matched_count,
        "unmatched_bank": session.unmatched_bank_count,
        "unmatched_internal": session.unmatched_internal_count,
        "variance": session.variance_count,
        "match_rate": (
            session.matched_count / session.total_bank_transactions
            if session.total_bank_transactions > 0
            else 0
        ),
    }
