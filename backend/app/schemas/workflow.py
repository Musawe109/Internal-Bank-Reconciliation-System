"""Pydantic schemas for workflow endpoints."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import WorkflowState


# Submit for Approval
class SubmitForApprovalResponse(BaseModel):
    """Response from submit for approval endpoint."""

    reconciliationId: UUID
    previousState: WorkflowState
    newState: WorkflowState
    submittedAt: datetime
    submittedBy: UUID

    model_config = ConfigDict(
        populate_by_name=True,
        use_enum_values=True,
    )


# Approve Reconciliation
class ApproveReconciliationRequest(BaseModel):
    """Request to approve reconciliation."""

    approverComments: Optional[str] = Field(max_length=1000, default=None)


class ApproveReconciliationResponse(BaseModel):
    """Response from approve reconciliation endpoint."""

    reconciliationId: UUID
    previousState: WorkflowState
    newState: WorkflowState
    approvedAt: datetime
    approvedBy: UUID

    model_config = ConfigDict(
        populate_by_name=True,
        use_enum_values=True,
    )


# Reject Reconciliation
class RejectReconciliationRequest(BaseModel):
    """Request to reject reconciliation."""

    rejectionReason: str = Field(min_length=10)


class RejectReconciliationResponse(BaseModel):
    """Response from reject reconciliation endpoint."""

    reconciliationId: UUID
    previousState: WorkflowState
    newState: WorkflowState
    rejectedAt: datetime
    rejectedBy: UUID

    model_config = ConfigDict(
        populate_by_name=True,
        use_enum_values=True,
    )
