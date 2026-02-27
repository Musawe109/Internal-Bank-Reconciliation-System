"""Workflow endpoints."""

import logging
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.core.responses import APIResponse
from app.db.postgres import get_session
from app.models.enums import AuditActionType, AuditEntityType, WorkflowState
from app.models.reconciliation import ReconciliationSession
from app.schemas.workflow import (
    ApproveReconciliationRequest,
    ApproveReconciliationResponse,
    RejectReconciliationRequest,
    RejectReconciliationResponse,
    SubmitForApprovalResponse,
)
from app.services.audit import log_action
from app.services.workflow import transition_workflow_state

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["workflow"])


@router.post("/reconciliation/{session_id}/submit", response_model=APIResponse)
def submit_for_approval(
    session_id: UUID,
    db: Session = Depends(get_session),
):
    """Submit reconciliation for approval.

    Transitions: DRAFT → PROCESSING

    Args:
        session_id: Reconciliation session ID
        db: Database session

    Returns:
        SubmitForApprovalResponse
    """
    # Verify session exists
    session = db.get(ReconciliationSession, session_id)
    if not session:
        raise NotFoundError(f"Reconciliation session {session_id} not found")

    # Check if already approved
    if session.workflow_state == WorkflowState.APPROVED:
        raise ConflictError("Reconciliation already approved")

    # Transition
    user_id = UUID(int=0)  # TODO: Get from auth context
    entry = transition_workflow_state(
        db=db,
        session_id=session_id,
        new_state=WorkflowState.PROCESSING,
        user_id=user_id,
        reason="Submitted for approval",
    )

    # Log to audit
    log_action(
        db=db,
        action_type=AuditActionType.WORKFLOW_STATE_CHANGED,
        entity_type=AuditEntityType.WORKFLOW,
        entity_id=session_id,
        user_id=user_id,
        user_name="System User",
        previous_state={"state": session.workflow_state.value},
        new_state={"state": WorkflowState.PROCESSING.value},
        details={"entryId": str(entry.id)},
    )

    return APIResponse(
        success=True,
        data=SubmitForApprovalResponse(
            reconciliationId=session_id,
            previousState=entry.previous_state,
            newState=entry.state,
            submittedAt=entry.transitioned_at,
            submittedBy=user_id,
        ).model_dump(),
    ).model_dump()


@router.post("/reconciliation/{session_id}/approve", response_model=APIResponse)
def approve_reconciliation(
    session_id: UUID,
    request: ApproveReconciliationRequest = None,
    db: Session = Depends(get_session),
):
    """Approve reconciliation.

    Transitions: PENDING_APPROVAL → APPROVED

    Args:
        session_id: Reconciliation session ID
        request: Optional approval comments
        db: Database session

    Returns:
        ApproveReconciliationResponse
    """
    # Verify session exists
    session = db.get(ReconciliationSession, session_id)
    if not session:
        raise NotFoundError(f"Reconciliation session {session_id} not found")

    # Check if already approved
    if session.workflow_state == WorkflowState.APPROVED:
        raise ConflictError("Reconciliation already approved")

    # Transition
    user_id = UUID(int=0)  # TODO: Get from auth context
    entry = transition_workflow_state(
        db=db,
        session_id=session_id,
        new_state=WorkflowState.APPROVED,
        user_id=user_id,
        reason=request.approverComments if request else None,
    )

    # Log to audit
    log_action(
        db=db,
        action_type=AuditActionType.RECORD_APPROVED,
        entity_type=AuditEntityType.WORKFLOW,
        entity_id=session_id,
        user_id=user_id,
        user_name="System User",
        previous_state={"state": session.workflow_state.value},
        new_state={"state": WorkflowState.APPROVED.value},
        details={"comments": request.approverComments if request else None},
    )

    return APIResponse(
        success=True,
        data=ApproveReconciliationResponse(
            reconciliationId=session_id,
            previousState=entry.previous_state,
            newState=entry.state,
            approvedAt=entry.transitioned_at,
            approvedBy=user_id,
        ).model_dump(),
    ).model_dump()


@router.post("/reconciliation/{session_id}/reject", response_model=APIResponse)
def reject_reconciliation(
    session_id: UUID,
    request: RejectReconciliationRequest,
    db: Session = Depends(get_session),
):
    """Reject reconciliation.

    Transitions: DRAFT|PROCESSING|PENDING_APPROVAL → REJECTED

    Args:
        session_id: Reconciliation session ID
        request: Rejection reason (min 10 chars)
        db: Database session

    Returns:
        RejectReconciliationResponse
    """
    # Verify session exists
    session = db.get(ReconciliationSession, session_id)
    if not session:
        raise NotFoundError(f"Reconciliation session {session_id} not found")

    # Transition
    user_id = UUID(int=0)  # TODO: Get from auth context
    entry = transition_workflow_state(
        db=db,
        session_id=session_id,
        new_state=WorkflowState.REJECTED,
        user_id=user_id,
        reason=request.rejectionReason,
    )

    # Log to audit
    log_action(
        db=db,
        action_type=AuditActionType.RECORD_REJECTED,
        entity_type=AuditEntityType.WORKFLOW,
        entity_id=session_id,
        user_id=user_id,
        user_name="System User",
        previous_state={"state": session.workflow_state.value},
        new_state={"state": WorkflowState.REJECTED.value},
        details={"reason": request.rejectionReason},
    )

    return APIResponse(
        success=True,
        data=RejectReconciliationResponse(
            reconciliationId=session_id,
            previousState=entry.previous_state,
            newState=entry.state,
            rejectedAt=entry.transitioned_at,
            rejectedBy=user_id,
        ).model_dump(),
    ).model_dump()
