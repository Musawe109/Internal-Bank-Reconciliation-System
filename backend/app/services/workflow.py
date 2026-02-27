"""Workflow state machine service."""

import logging
from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from sqlmodel import Session, select

from app.core.exceptions import InvalidTransitionError
from app.models.enums import WorkflowState
from app.models.reconciliation import ReconciliationSession
from app.models.workflow import WorkflowStateEntry

logger = logging.getLogger(__name__)

# Valid state transitions
VALID_TRANSITIONS: Dict[WorkflowState, List[WorkflowState]] = {
    WorkflowState.DRAFT: [WorkflowState.PROCESSING, WorkflowState.REJECTED],
    WorkflowState.PROCESSING: [WorkflowState.PENDING_APPROVAL, WorkflowState.REJECTED],
    WorkflowState.PENDING_APPROVAL: [
        WorkflowState.APPROVED,
        WorkflowState.REJECTED,
        WorkflowState.DRAFT,
    ],
    WorkflowState.APPROVED: [],  # Terminal state
    WorkflowState.REJECTED: [WorkflowState.DRAFT],
}

# Action to state mapping
ACTION_TO_STATE: Dict[str, Dict[WorkflowState, WorkflowState]] = {
    "submit": {
        WorkflowState.DRAFT: WorkflowState.PROCESSING,
    },
    "complete": {
        WorkflowState.PROCESSING: WorkflowState.PENDING_APPROVAL,
    },
    "approve": {
        WorkflowState.PENDING_APPROVAL: WorkflowState.APPROVED,
    },
    "reject": {
        WorkflowState.DRAFT: WorkflowState.REJECTED,
        WorkflowState.PROCESSING: WorkflowState.REJECTED,
        WorkflowState.PENDING_APPROVAL: WorkflowState.REJECTED,
    },
    "withdraw": {
        WorkflowState.PENDING_APPROVAL: WorkflowState.DRAFT,
    },
    "resubmit": {
        WorkflowState.REJECTED: WorkflowState.DRAFT,
    },
}


def validate_transition(current_state: WorkflowState, new_state: WorkflowState) -> bool:
    """Validate if a state transition is allowed.

    Args:
        current_state: Current workflow state
        new_state: Target workflow state

    Returns:
        True if transition is valid

    Raises:
        InvalidTransitionError: If transition is not allowed
    """
    allowed = VALID_TRANSITIONS.get(current_state, [])
    if new_state not in allowed:
        raise InvalidTransitionError(
            f"Cannot transition from {current_state.value} to {new_state.value}"
        )
    return True


def get_next_state(current_state: WorkflowState, action: str) -> WorkflowState:
    """Get the next state for a given action.

    Args:
        current_state: Current workflow state
        action: Action to perform

    Returns:
        Next workflow state

    Raises:
        InvalidTransitionError: If action is not valid for current state
    """
    action_map = ACTION_TO_STATE.get(action)
    if not action_map:
        raise InvalidTransitionError(f"Unknown action: {action}")

    next_state = action_map.get(current_state)
    if not next_state:
        raise InvalidTransitionError(
            f"Action '{action}' not valid for state {current_state.value}"
        )

    return next_state


def transition_workflow_state(
    db: Session,
    session_id: UUID,
    new_state: WorkflowState,
    user_id: UUID,
    reason: Optional[str] = None,
) -> WorkflowStateEntry:
    """Transition a reconciliation session to a new state.

    Args:
        db: Database session
        session_id: Reconciliation session ID
        new_state: Target state
        user_id: User performing the transition
        reason: Optional reason for the transition

    Returns:
        Created WorkflowStateEntry

    Raises:
        InvalidTransitionError: If transition is not allowed
        NotFoundError: If session not found
    """
    from app.core.exceptions import NotFoundError

    # Get session
    session = db.get(ReconciliationSession, session_id)
    if not session:
        raise NotFoundError(f"Reconciliation session {session_id} not found")

    # Validate transition
    validate_transition(session.workflow_state, new_state)

    # Create state entry
    entry = WorkflowStateEntry(
        reconciliation_session_id=session_id,
        state=new_state,
        previous_state=session.workflow_state,
        transitioned_by=user_id,
        reason=reason,
    )
    db.add(entry)

    # Update session state
    session.workflow_state = new_state
    session.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(entry)

    logger.info(
        f"Workflow transition: {session.workflow_state.value} -> {new_state.value} "
        f"(session: {session_id}, user: {user_id})"
    )

    return entry


def is_locked(session: ReconciliationSession) -> bool:
    """Check if a reconciliation session is locked for edits.

    Sessions are locked in APPROVED and PROCESSING states.

    Args:
        session: Reconciliation session

    Returns:
        True if session is locked
    """
    return session.workflow_state in [
        WorkflowState.APPROVED,
        WorkflowState.PROCESSING,
    ]


def enforce_lock(session: ReconciliationSession) -> None:
    """Enforce locking rules.

    Args:
        session: Reconciliation session

    Raises:
        InvalidTransitionError: If session is locked
    """
    if is_locked(session):
        raise InvalidTransitionError(
            f"Cannot modify reconciliation in {session.workflow_state.value} state"
        )


def get_workflow_history(
    db: Session,
    session_id: UUID,
) -> List[WorkflowStateEntry]:
    """Get workflow history for a reconciliation session.

    Args:
        db: Database session
        session_id: Reconciliation session ID

    Returns:
        List of workflow state entries in chronological order
    """
    statement = (
        select(WorkflowStateEntry)
        .where(WorkflowStateEntry.reconciliation_session_id == session_id)
        .order_by(WorkflowStateEntry.transitioned_at)
    )
    return db.exec(statement).all()
