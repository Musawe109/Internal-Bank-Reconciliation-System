"""Workflow state tracking model."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

from app.models.enums import WorkflowState

if TYPE_CHECKING:
    from app.models.reconciliation import ReconciliationSession


class WorkflowStateEntry(SQLModel, table=True):
    """Tracks state transitions for a reconciliation session."""

    __tablename__ = "workflow_states"

    # Identity
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Foreign keys
    reconciliation_session_id: UUID = Field(
        foreign_key="reconciliation_sessions.id",
        index=True,
        nullable=False,
    )

    # State data
    state: WorkflowState = Field(nullable=False, index=True)
    previous_state: Optional[WorkflowState] = Field(nullable=True)
    transitioned_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    transitioned_by: Optional[UUID] = Field(foreign_key="users.id", nullable=True)
    reason: Optional[str] = Field(max_length=1000, nullable=True)

    # Relationships
    reconciliation_session: Optional["ReconciliationSession"] = Relationship(
        back_populates="workflow_states",
    )
