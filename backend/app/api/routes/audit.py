"""Audit log endpoints."""

import logging
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.core.responses import APIResponse
from app.db.postgres import get_session
from app.models.enums import AuditActionType, AuditEntityType
from app.schemas.audit import AuditLogEntry as AuditLogEntrySchema
from app.schemas.audit import GetAuditLogResponse
from app.schemas.reconciliation import PaginationInfo
from app.services.audit import get_audit_log
from sqlmodel import Session

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["audit"])


@router.get("/audit-log", response_model=APIResponse)
def get_audit_log_endpoint(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=250),
    entity_id: Optional[UUID] = Query(None),
    entity_type: Optional[AuditEntityType] = Query(None),
    action_type: Optional[AuditActionType] = Query(None),
    user_id: Optional[UUID] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    sort_by: str = Query("timestamp"),
    sort_order: str = Query("DESC"),
    db: Session = Depends(get_session),
):
    """Get audit log entries with pagination and filters.

    Args:
        page: Page number
        page_size: Items per page
        entity_id: Filter by entity ID
        entity_type: Filter by entity type
        action_type: Filter by action type
        user_id: Filter by user ID
        start_date: Filter by start date
        end_date: Filter by end date
        sort_by: Sort field
        sort_order: Sort order
        db: Database session

    Returns:
        GetAuditLogResponse
    """
    entries, total = get_audit_log(
        db=db,
        entity_id=entity_id,
        entity_type=entity_type,
        action_type=action_type,
        user_id=user_id,
        start_date=start_date,
        end_date=end_date,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    # Map to schema
    entry_schemas = [
        AuditLogEntrySchema(
            id=e.id,
            timestamp=e.timestamp,
            actionType=e.action_type,
            entityType=e.entity_type,
            entityId=e.entity_id,
            userId=e.user_id,
            userName=e.user_name,
            details=e.details,
            ipAddress=e.ip_address,
            userAgent=e.user_agent,
        )
        for e in entries
    ]

    total_pages = (total + page_size - 1) // page_size

    return APIResponse(
        success=True,
        data=GetAuditLogResponse(
            entries=entry_schemas,
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
