"""Pydantic schemas for audit log endpoints."""

from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import AuditActionType, AuditEntityType


# Audit Log Entry
class AuditLogEntry(BaseModel):
    """Audit log entry response."""

    id: UUID
    timestamp: datetime
    actionType: AuditActionType
    entityType: AuditEntityType
    entityId: UUID
    userId: UUID
    userName: str
    details: Optional[Dict] = None
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
        use_enum_values=True,
    )


# Get Audit Log Response
class GetAuditLogResponse(BaseModel):
    """Response from get audit log endpoint."""

    entries: List[AuditLogEntry]
    pagination: "PaginationInfo"


# Import to avoid circular dependency
from app.schemas.reconciliation import PaginationInfo  # noqa: F401, E402
