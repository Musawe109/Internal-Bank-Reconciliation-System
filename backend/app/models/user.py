"""User model for authentication and authorization."""

from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.reconciliation import ReconciliationSession


class User(SQLModel, table=True):
    """User account model."""

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True, nullable=False)
    password_hash: str = Field(max_length=255, nullable=False)
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    full_name: Optional[str] = Field(max_length=255, nullable=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    reconciliation_sessions: List["ReconciliationSession"] = Relationship(
        back_populates="created_by_user",
        sa_relationship_kwargs={"foreign_keys": "ReconciliationSession.created_by"},
    )
