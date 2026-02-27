"""Audit logging and manual override models."""

from datetime import datetime
from typing import Dict, Optional
from uuid import UUID, uuid4

from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel

from app.models.enums import AuditActionType, AuditEntityType, Classification


class AuditLogEntry(SQLModel, table=True):
    """Immutable record of a user action (append-only)."""

    __tablename__ = "audit_logs"

    # Identity
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Timestamp
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
    )

    # Action
    action_type: AuditActionType = Field(
        nullable=False,
        index=True,
    )

    entity_type: AuditEntityType = Field(
        nullable=False,
        index=True,
    )

    entity_id: UUID = Field(
        nullable=False,
    )

    # User
    user_id: UUID = Field(
        foreign_key="users.id",
        nullable=False,
    )

    user_name: str = Field(
        max_length=255,
        nullable=False,
    )

    # 🔥 FIXED JSON FIELDS (removed nullable from Field)
    previous_state: Optional[Dict] = Field(
        default=None,
        sa_column=Column(JSON),
    )

    new_state: Optional[Dict] = Field(
        default=None,
        sa_column=Column(JSON),
    )

    details: Optional[Dict] = Field(
        default=None,
        sa_column=Column(JSON),
    )

    # Context
    ip_address: Optional[str] = Field(
        default=None,
        max_length=45,
    )

    user_agent: Optional[str] = Field(
        default=None,
        max_length=500,
    )


class ManualOverride(SQLModel, table=True):
    """Records when a user manually changes a transaction classification."""

    __tablename__ = "manual_overrides"

    # Identity
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Foreign key
    reconciliation_result_id: UUID = Field(
        foreign_key="reconciliation_results.id",
        index=True,
        nullable=False,
    )

    # Override data
    previous_classification: Classification = Field(
        nullable=False,
    )

    new_classification: Classification = Field(
        nullable=False,
    )

    reason: str = Field(
        max_length=1000,
        nullable=False,
    )

    overridden_at: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
    )

    overridden_by: UUID = Field(
        foreign_key="users.id",
        nullable=False,
    )