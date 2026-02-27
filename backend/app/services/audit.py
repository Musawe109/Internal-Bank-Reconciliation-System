"""Audit logging service (append-only)."""

import logging
from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from sqlmodel import Session, select

from app.models.audit import AuditLogEntry
from app.models.enums import AuditActionType, AuditEntityType

logger = logging.getLogger(__name__)


def log_action(
    db: Session,
    action_type: AuditActionType,
    entity_type: AuditEntityType,
    entity_id: UUID,
    user_id: UUID,
    user_name: str,
    previous_state: Optional[Dict[str, Any]] = None,
    new_state: Optional[Dict[str, Any]] = None,
    details: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> AuditLogEntry:
    """Log an action to the audit trail (append-only).

    Args:
        db: Database session
        action_type: Type of action
        entity_type: Type of entity affected
        entity_id: ID of affected entity
        user_id: ID of user performing action
        user_name: Name of user
        previous_state: Optional previous state snapshot
        new_state: Optional new state snapshot
        details: Optional additional details
        ip_address: Optional IP address
        user_agent: Optional user agent string

    Returns:
        Created AuditLogEntry
    """
    entry = AuditLogEntry(
        action_type=action_type,
        entity_type=entity_type,
        entity_id=entity_id,
        user_id=user_id,
        user_name=user_name,
        previous_state=previous_state,
        new_state=new_state,
        details=details,
        ip_address=ip_address,
        user_agent=user_agent,
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)

    logger.info(
        f"Audit: {action_type.value} on {entity_type.value} ({entity_id}) by {user_name}"
    )

    return entry


def get_audit_log(
    db: Session,
    entity_id: Optional[UUID] = None,
    entity_type: Optional[AuditEntityType] = None,
    action_type: Optional[AuditActionType] = None,
    user_id: Optional[UUID] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    page: int = 1,
    page_size: int = 25,
    sort_by: str = "timestamp",
    sort_order: str = "DESC",
) -> tuple[List[AuditLogEntry], int]:
    """Retrieve audit log entries with filtering and pagination.

    Args:
        db: Database session
        entity_id: Filter by entity ID
        entity_type: Filter by entity type
        action_type: Filter by action type
        user_id: Filter by user ID
        start_date: Filter by start date
        end_date: Filter by end date
        page: Page number (1-indexed)
        page_size: Items per page
        sort_by: Sort field
        sort_order: Sort order (ASC or DESC)

    Returns:
        Tuple of (entries, total_count)
    """
    statement = select(AuditLogEntry)

    # Apply filters
    if entity_id:
        statement = statement.where(AuditLogEntry.entity_id == entity_id)
    if entity_type:
        statement = statement.where(AuditLogEntry.entity_type == entity_type)
    if action_type:
        statement = statement.where(AuditLogEntry.action_type == action_type)
    if user_id:
        statement = statement.where(AuditLogEntry.user_id == user_id)
    if start_date:
        statement = statement.where(AuditLogEntry.timestamp >= start_date)
    if end_date:
        statement = statement.where(AuditLogEntry.timestamp <= end_date)

    # Get total count
    count_statement = select(AuditLogEntry.id).select_from(AuditLogEntry)
    total = len(db.exec(count_statement).all())

    # Apply sorting
    if sort_by == "timestamp":
        if sort_order.upper() == "DESC":
            statement = statement.order_by(AuditLogEntry.timestamp.desc())
        else:
            statement = statement.order_by(AuditLogEntry.timestamp.asc())
    elif sort_by == "actionType":
        if sort_order.upper() == "DESC":
            statement = statement.order_by(AuditLogEntry.action_type.desc())
        else:
            statement = statement.order_by(AuditLogEntry.action_type.asc())
    elif sort_by == "entityType":
        if sort_order.upper() == "DESC":
            statement = statement.order_by(AuditLogEntry.entity_type.desc())
        else:
            statement = statement.order_by(AuditLogEntry.entity_type.asc())

    # Apply pagination
    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)

    entries = db.exec(statement).all()
    return entries, total
