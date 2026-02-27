"""Reconciliation session and result models."""

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

from app.models.enums import Classification, WorkflowState

if TYPE_CHECKING:
    from app.models.transaction import BankTransaction
    from app.models.workflow import WorkflowStateEntry
    from app.models.user import User


class ReconciliationSession(SQLModel, table=True):
    """Represents a bank CSV upload and its reconciliation results."""

    __tablename__ = "reconciliation_sessions"

    # Identity
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # File info
    bank_file_name: str = Field(max_length=255, nullable=False)
    file_hash: Optional[str] = Field(max_length=64, nullable=True)

    # Counts
    total_bank_transactions: int = Field(default=0)
    total_internal_records: int = Field(default=0)

    # Workflow
    workflow_state: WorkflowState = Field(
        default=WorkflowState.DRAFT,
        index=True,
    )

    # Classification breakdown
    matched_count: int = Field(default=0)
    unmatched_bank_count: int = Field(default=0)
    unmatched_internal_count: int = Field(default=0)
    variance_count: int = Field(default=0)

    # Audit
    created_by: Optional[UUID] = Field(foreign_key="users.id", nullable=True)

    # Relationships
    bank_transactions: List["BankTransaction"] = Relationship(
        back_populates="reconciliation_session",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    workflow_states: List["WorkflowStateEntry"] = Relationship(
        back_populates="reconciliation_session",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    created_by_user: Optional["User"] = Relationship(back_populates="reconciliation_sessions")


class ReconciliationResult(SQLModel, table=True):
    """The outcome of matching a bank transaction with internal transactions."""

    __tablename__ = "reconciliation_results"

    # Identity
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Foreign keys
    reconciliation_session_id: UUID = Field(
        foreign_key="reconciliation_sessions.id",
        index=True,
        nullable=False,
    )
    bank_transaction_id: UUID = Field(
        foreign_key="bank_transactions.id",
        unique=True,
        nullable=False,
    )
    internal_transaction_id: Optional[UUID] = Field(
        foreign_key="internal_transactions.id",
        unique=True,
        nullable=True,
    )

    # Classification
    classification: Classification = Field(nullable=False, index=True)

    # Variance (only when classification is VarianceDetected)
    variance_amount: Optional[Decimal] = Field(
        max_digits=15,
        decimal_places=2,
        nullable=True,
    )

    # Matched pair ID (for tracking)
    matched_pair_id: Optional[str] = Field(max_length=100, nullable=True)
