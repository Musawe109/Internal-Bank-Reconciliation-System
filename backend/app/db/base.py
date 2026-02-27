"""SQLModel base for database models."""

from sqlmodel import SQLModel

# Import all models here for Alembic discovery
# This ensures all models are registered with the metadata
from app.models import (  # noqa: F401
    User,
    ReconciliationSession,
    ReconciliationResult,
    BankTransaction,
    InternalTransaction,
    WorkflowStateEntry,
    AuditLogEntry,
    ManualOverride,
    WorkflowState,
    Classification,
    AuditActionType,
    AuditEntityType,
)
