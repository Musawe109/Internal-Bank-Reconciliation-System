"""Transaction endpoints."""

import logging
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select

from app.core.exceptions import InvalidTransitionError, NotFoundError, ValidationError
from app.core.responses import APIResponse
from app.db.postgres import get_session
from app.models.audit import AuditLogEntry, ManualOverride
from app.models.enums import AuditActionType, AuditEntityType, Classification
from app.models.reconciliation import ReconciliationResult, ReconciliationSession
from app.models.transaction import BankTransaction, InternalTransaction
from app.schemas.reconciliation import ManualOverrideRequest, PaginationInfo
from app.schemas.transaction import (
    BankTransactionDetails,
    GetTransactionsResponse,
    InternalRecordDetails,
    TransactionRecord,
    UpdateClassificationResponse,
)
from app.services.audit import log_action
from app.services.workflow import enforce_lock

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["transactions"])


@router.get("/reconciliation/{session_id}/transactions", response_model=APIResponse)
def get_transactions(
    session_id: UUID,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=250),
    classification: Optional[Classification] = Query(None),
    sort_by: str = Query("date"),
    sort_order: str = Query("DESC"),
    search_reference: Optional[str] = Query(None),
    db: Session = Depends(get_session),
):
    """Get transactions for a reconciliation with pagination and filters.

    Args:
        session_id: Reconciliation session ID
        page: Page number
        page_size: Items per page
        classification: Filter by classification
        sort_by: Sort field
        sort_order: Sort order
        search_reference: Search by reference (partial match)
        db: Database session

    Returns:
        GetTransactionsResponse
    """
    # Verify session exists
    session = db.get(ReconciliationSession, session_id)
    if not session:
        raise NotFoundError(f"Reconciliation session {session_id} not found")

    # Build query
    statement = select(ReconciliationResult).where(
        ReconciliationResult.reconciliation_session_id == session_id
    )

    # Filter by classification
    if classification:
        statement = statement.where(ReconciliationResult.classification == classification)

    # Search by reference (join with bank transactions)
    if search_reference:
        statement = statement.join(
            BankTransaction,
            ReconciliationResult.bank_transaction_id == BankTransaction.id,
        ).where(
            BankTransaction.reference.ilike(f"%{search_reference}%")
        )

    # Get total count
    count_statement = select(ReconciliationResult.id).where(
        ReconciliationResult.reconciliation_session_id == session_id
    )
    if classification:
        count_statement = count_statement.where(ReconciliationResult.classification == classification)
    total = len(db.exec(count_statement).all())

    # Sort
    if sort_by == "amount":
        if sort_order.upper() == "DESC":
            statement = statement.order_by(ReconciliationResult.variance_amount.desc())
        else:
            statement = statement.order_by(ReconciliationResult.variance_amount.asc())
    elif sort_by == "date":
        # Join with bank transaction for date
        statement = statement.join(
            BankTransaction,
            ReconciliationResult.bank_transaction_id == BankTransaction.id,
        )
        if sort_order.upper() == "DESC":
            statement = statement.order_by(BankTransaction.date.desc())
        else:
            statement = statement.order_by(BankTransaction.date.asc())
    elif sort_by == "reference":
        statement = statement.join(
            BankTransaction,
            ReconciliationResult.bank_transaction_id == BankTransaction.id,
        )
        if sort_order.upper() == "DESC":
            statement = statement.order_by(BankTransaction.reference.desc())
        else:
            statement = statement.order_by(BankTransaction.reference.asc())

    # Paginate
    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)

    results = db.exec(statement).all()

    # Map to transaction records
    transactions = []
    for result in results:
        bank_tx = db.get(BankTransaction, result.bank_transaction_id) if result.bank_transaction_id else None
        internal_tx = db.get(InternalTransaction, result.internal_transaction_id) if result.internal_transaction_id else None

        # Get overrides for this result
        overrides_stmt = select(ManualOverride).where(
            ManualOverride.reconciliation_result_id == result.id
        )
        overrides = db.exec(overrides_stmt).all()

        transactions.append(
            TransactionRecord(
                id=result.id,
                amount=float(bank_tx.amount) if bank_tx else (float(internal_tx.amount) if internal_tx else 0),
                reference=bank_tx.reference if bank_tx else (internal_tx.reference if internal_tx else ""),
                date=bank_tx.date.isoformat() if bank_tx else (internal_tx.date.isoformat() if internal_tx else ""),
                classification=result.classification,
                varianceAmount=float(result.variance_amount) if result.variance_amount else None,
                bankTransaction=BankTransactionDetails(
                    id=bank_tx.id,
                    amount=float(bank_tx.amount),
                    reference=bank_tx.reference,
                    date=bank_tx.date.isoformat(),
                    description=bank_tx.description,
                    transactionType=bank_tx.transaction_type,
                ) if bank_tx else None,
                internalRecord=InternalRecordDetails(
                    id=internal_tx.id,
                    amount=float(internal_tx.amount),
                    reference=internal_tx.reference,
                    date=internal_tx.date.isoformat(),
                    description=internal_tx.description,
                    accountCode=internal_tx.account_code,
                    costCenter=internal_tx.cost_center,
                ) if internal_tx else None,
                matchedPairId=result.matched_pair_id,
                overrides=[
                    {
                        "id": o.id,
                        "previousClassification": o.previous_classification,
                        "newClassification": o.new_classification,
                        "reason": o.reason,
                        "overriddenBy": o.overridden_by,
                        "overriddenAt": o.overridden_at,
                    }
                    for o in overrides
                ] if overrides else None,
            )
        )

    total_pages = (total + page_size - 1) // page_size

    return APIResponse(
        success=True,
        data=GetTransactionsResponse(
            transactions=transactions,
            pagination=PaginationInfo(
                currentPage=page,
                pageSize=page_size,
                totalItems=total,
                totalPages=total_pages,
                hasNextPage=page < total_pages,
                hasPreviousPage=page > 1,
            ),
        ).model_dump(),
    ).model_dump()


@router.put("/transactions/{transaction_id}/classification", response_model=APIResponse)
def update_classification(
    transaction_id: UUID,
    request: ManualOverrideRequest,
    db: Session = Depends(get_session),
):
    """Update transaction classification (manual override).

    Args:
        transaction_id: Reconciliation result ID
        request: Manual override request
        db: Database session

    Returns:
        UpdateClassificationResponse
    """
    # Get result
    result = db.get(ReconciliationResult, transaction_id)
    if not result:
        raise NotFoundError(f"Transaction {transaction_id} not found")

    # Check workflow lock
    session = db.get(ReconciliationSession, result.reconciliation_session_id)
    if not session:
        raise NotFoundError(f"Session not found")
    enforce_lock(session)

    # Validate classification change
    if request.newClassification == result.classification:
        raise ValidationError("New classification must be different from current")

    # Create manual override
    override = ManualOverride(
        reconciliation_result_id=transaction_id,
        previous_classification=result.classification,
        new_classification=request.newClassification,
        reason=request.reason,
        overridden_by=UUID(int=0),  # TODO: Get from auth context
    )
    db.add(override)

    # Update result classification
    previous_classification = result.classification
    result.classification = request.newClassification

    # Update session counts
    if previous_classification == Classification.MATCHED:
        session.matched_count -= 1
    elif previous_classification == Classification.UNMATCHED_BANK_ONLY:
        session.unmatched_bank_count -= 1
    elif previous_classification == Classification.UNMATCHED_INTERNAL_ONLY:
        session.unmatched_internal_count -= 1
    elif previous_classification == Classification.VARIANCE_DETECTED:
        session.variance_count -= 1

    if request.newClassification == Classification.MATCHED:
        session.matched_count += 1
    elif request.newClassification == Classification.UNMATCHED_BANK_ONLY:
        session.unmatched_bank_count += 1
    elif request.newClassification == Classification.UNMATCHED_INTERNAL_ONLY:
        session.unmatched_internal_count += 1
    elif request.newClassification == Classification.VARIANCE_DETECTED:
        session.variance_count += 1

    # Log to audit
    audit_entry = log_action(
        db=db,
        action_type=AuditActionType.CLASSIFICATION_OVERRIDDEN,
        entity_type=AuditEntityType.TRANSACTION,
        entity_id=transaction_id,
        user_id=override.overridden_by,
        user_name="System User",  # TODO: Get from auth context
        previous_state={"classification": previous_classification.value},
        new_state={"classification": request.newClassification.value},
        details={"reason": request.reason, "overrideId": str(override.id)},
    )

    db.commit()

    return APIResponse(
        success=True,
        data=UpdateClassificationResponse(
            transaction=TransactionRecord(
                id=result.id,
                amount=0,  # Would need to refetch
                reference="",
                date="",
                classification=result.classification,
            ),
            auditLogId=audit_entry.id,
        ).model_dump(),
    ).model_dump()
