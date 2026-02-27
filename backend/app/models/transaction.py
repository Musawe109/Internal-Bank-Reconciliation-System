"""Transaction models."""

from datetime import date as dt_date
from decimal import Decimal
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.reconciliation import ReconciliationSession


class BankTransaction(SQLModel, table=True):
    """A transaction from the uploaded bank CSV file."""

    __tablename__ = "bank_transactions"

    # Identity
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Foreign key
    reconciliation_session_id: UUID = Field(
        foreign_key="reconciliation_sessions.id",
        index=True,
        nullable=False,
    )

    # Core data
    amount: Decimal = Field(
        max_digits=15,
        decimal_places=2,
        nullable=False,
        index=True,
    )

    reference: str = Field(
        max_length=100,
        nullable=False,
        index=True,
    )

    # FIXED: renamed field + aliased type
    transaction_date: dt_date = Field(
        nullable=False,
        index=True,
    )

    description: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    transaction_type: Optional[str] = Field(
        default=None,
        max_length=50,
    )

    # Relationships
    reconciliation_session: Optional["ReconciliationSession"] = Relationship(
        back_populates="bank_transactions",
    )


class InternalTransaction(SQLModel, table=True):
    """A transaction from the Oracle financial system (read-only mirror)."""

    __tablename__ = "internal_transactions"

    # Identity
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Core data
    amount: Decimal = Field(
        max_digits=15,
        decimal_places=2,
        nullable=False,
        index=True,
    )

    reference: str = Field(
        max_length=100,
        nullable=False,
        index=True,
    )

    # FIXED here as well
    transaction_date: dt_date = Field(
        nullable=False,
        index=True,
    )

    description: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    account_code: Optional[str] = Field(
        default=None,
        max_length=50,
    )

    cost_center: Optional[str] = Field(
        default=None,
        max_length=50,
    )

    # Oracle metadata
    oracle_id: str = Field(
        max_length=100,
        unique=True,
        index=True,
    )

    fetched_at: dt_date = Field(
        default_factory=dt_date.today,
    )