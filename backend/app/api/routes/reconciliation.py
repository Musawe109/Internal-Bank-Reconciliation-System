"""Reconciliation endpoints."""

import logging
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, File, Query, UploadFile
from sqlmodel import Session, select

from app.core.exceptions import NotFoundError, ValidationError
from app.core.responses import APIResponse
from app.db.postgres import get_session
from app.models.reconciliation import ReconciliationSession
from app.schemas.reconciliation import (
    GetReconciliationListResponse,
    GetReconciliationResponse,
    PaginationInfo,
    ReconciliationSummary,
    UploadCsvResponse,
)
from app.services.ingestion import compute_file_hash, parse_csv
from app.services.reconciliation import match_transactions, persist_results

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["reconciliation"])


@router.post("/reconciliation", response_model=APIResponse)
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_session),
):
    """Upload a bank CSV file for reconciliation.

    Args:
        file: CSV file upload
        db: Database session

    Returns:
        UploadCsvResponse with reconciliation ID and status
    """
    # Validate file type
    if not file.filename.endswith(".csv"):
        raise ValidationError(
            "File must be a CSV",
            details={"errorCode": "INVALID_FILE_FORMAT"},
        )

    # Read file content
    content = await file.read()

    # Parse CSV
    records, errors = parse_csv(content)

    if not records:
        raise ValidationError(
            "No valid records in CSV file",
            details={"errorCode": "MISSING_COLUMNS"},
        )

    # Create reconciliation session
    session = ReconciliationSession(
        bank_file_name=file.filename,
        file_hash=compute_file_hash(content),
        workflow_state="DRAFT",
    )
    db.add(session)
    db.flush()  # Get session ID

    # Create bank transactions
    for record in records:
        bank_tx = BankTransaction(
            reconciliation_session_id=session.id,
            amount=record["amount"],
            reference=record["reference"],
            date=record["date"],
            description=record.get("description"),
            transaction_type=record.get("transaction_type"),
        )
        db.add(bank_tx)

    db.flush()

    # Fetch internal transactions from Oracle
    from app.services.ingestion import fetch_internal_records

    internal_txs = fetch_internal_records(session, db)
    for tx in internal_txs:
        db.add(tx)

    db.flush()

    # Run reconciliation
    bank_txs = [
        tx for tx in db.exec(
            select(BankTransaction).where(BankTransaction.reconciliation_session_id == session.id)
        ).all()
    ]

    matches = match_transactions(bank_txs, internal_txs)
    persist_results(db, session, matches)

    db.commit()
    db.refresh(session)

    return APIResponse(
        success=True,
        data=UploadCsvResponse(
            reconciliationId=session.id,
            fileName=session.bank_file_name,
            uploadedAt=session.created_at,
            transactionCount=session.total_bank_transactions,
            status="SUCCESS" if not errors else "PARTIAL_SUCCESS",
            errors=errors if errors else None,
        ).model_dump(),
    ).model_dump()


@router.get("/reconciliation", response_model=APIResponse)
def list_reconciliations(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=250),
    sort_by: str = Query("createdAt"),
    sort_order: str = Query("DESC"),
    db: Session = Depends(get_session),
):
    """List reconciliation sessions with pagination.

    Args:
        page: Page number
        page_size: Items per page
        sort_by: Sort field
        sort_order: Sort order
        db: Database session

    Returns:
        GetReconciliationListResponse
    """
    # Build query
    statement = select(ReconciliationSession)

    # Sort
    if sort_by == "createdAt":
        if sort_order.upper() == "DESC":
            statement = statement.order_by(ReconciliationSession.created_at.desc())
        else:
            statement = statement.order_by(ReconciliationSession.created_at.asc())
    elif sort_by == "bankFileName":
        if sort_order.upper() == "DESC":
            statement = statement.order_by(ReconciliationSession.bank_file_name.desc())
        else:
            statement = statement.order_by(ReconciliationSession.bank_file_name.asc())

    # Get total count
    count_statement = select(ReconciliationSession.id)
    total = len(db.exec(count_statement).all())

    # Paginate
    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)

    sessions = db.exec(statement).all()

    # Map to summaries
    from app.schemas.reconciliation import ClassificationCounts

    reconciliations = []
    for s in sessions:
        reconciliations.append(
            ReconciliationSummary(
                id=s.id,
                createdAt=s.created_at,
                updatedAt=s.updated_at,
                bankFileName=s.bank_file_name,
                totalBankTransactions=s.total_bank_transactions,
                totalInternalRecords=s.total_internal_records,
                workflowState=s.workflow_state,
                classificationCounts=ClassificationCounts(
                    matched=s.matched_count,
                    unmatchedBankOnly=s.unmatched_bank_count,
                    unmatchedInternalOnly=s.unmatched_internal_count,
                    varianceDetected=s.variance_count,
                ),
                createdBy=s.created_by,
                updatedBy=s.updated_by,
            )
        )

    total_pages = (total + page_size - 1) // page_size

    return APIResponse(
        success=True,
        data=GetReconciliationListResponse(
            reconciliations=reconciliations,
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


@router.get("/reconciliation/{session_id}", response_model=APIResponse)
def get_reconciliation(
    session_id: UUID,
    db: Session = Depends(get_session),
):
    """Get reconciliation details by ID.

    Args:
        session_id: Reconciliation session ID
        db: Database session

    Returns:
        GetReconciliationResponse
    """
    session = db.get(ReconciliationSession, session_id)
    if not session:
        raise NotFoundError(f"Reconciliation session {session_id} not found")

    from app.schemas.reconciliation import ClassificationCounts

    summary = ReconciliationSummary(
        id=session.id,
        createdAt=session.created_at,
        updatedAt=session.updated_at,
        bankFileName=session.bank_file_name,
        totalBankTransactions=session.total_bank_transactions,
        totalInternalRecords=session.total_internal_records,
        workflowState=session.workflow_state,
        classificationCounts=ClassificationCounts(
            matched=session.matched_count,
            unmatchedBankOnly=session.unmatched_bank_count,
            unmatchedInternalOnly=session.unmatched_internal_count,
            varianceDetected=session.variance_count,
        ),
        createdBy=session.created_by,
        updatedBy=session.updated_by,
    )

    # For now, return empty transactions (separate endpoint for transactions)
    return APIResponse(
        success=True,
        data=GetReconciliationResponse(
            summary=summary,
            transactions=[],
            pagination=PaginationInfo(
                currentPage=1,
                pageSize=25,
                totalItems=0,
                totalPages=0,
                hasNextPage=False,
                hasPreviousPage=False,
            ),
        ).model_dump(),
    ).model_dump()
