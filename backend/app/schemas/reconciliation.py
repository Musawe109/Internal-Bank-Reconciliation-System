"""Pydantic schemas for reconciliation endpoints."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import Classification, WorkflowState


# Classification Counts
class ClassificationCounts(BaseModel):
    """Classification breakdown counts."""

    matched: int = 0
    unmatchedBankOnly: int = 0
    unmatchedInternalOnly: int = 0
    varianceDetected: int = 0

    model_config = ConfigDict(
        populate_by_name=True,
        use_enum_values=True,
    )


# Reconciliation Summary
class ReconciliationSummary(BaseModel):
    """Summary of a reconciliation session."""

    id: UUID
    createdAt: datetime
    updatedAt: datetime
    bankFileName: str
    totalBankTransactions: int
    totalInternalRecords: int
    workflowState: WorkflowState
    classificationCounts: ClassificationCounts
    createdBy: Optional[UUID] = None
    updatedBy: Optional[UUID] = None

    model_config = ConfigDict(
        populate_by_name=True,
        use_enum_values=True,
    )


# Upload Response
class UploadCsvResponse(BaseModel):
    """Response from CSV upload endpoint."""

    reconciliationId: UUID
    fileName: str
    uploadedAt: datetime
    transactionCount: int
    status: str = "SUCCESS"
    errors: Optional[List["UploadError"]] = None


class UploadError(BaseModel):
    """Error from CSV upload."""

    rowNumber: int = Field(ge=1)
    errorMessage: str
    fieldValue: Optional[str] = None


# Get Reconciliation List Response
class GetReconciliationListResponse(BaseModel):
    """Response from list reconciliation endpoint."""

    reconciliations: List[ReconciliationSummary]
    pagination: "PaginationInfo"


# Get Reconciliation Response
class GetReconciliationResponse(BaseModel):
    """Response from get reconciliation details endpoint."""

    summary: ReconciliationSummary
    transactions: List["TransactionRecord"]
    pagination: "PaginationInfo"


# Manual Override
class ManualOverride(BaseModel):
    """Manual override record."""

    id: UUID
    previousClassification: Classification
    newClassification: Classification
    reason: str
    overriddenBy: UUID
    overriddenAt: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        use_enum_values=True,
    )


class ManualOverrideRequest(BaseModel):
    """Request to create a manual override."""

    newClassification: Classification
    reason: str = Field(min_length=10)

    model_config = ConfigDict(
        populate_by_name=True,
        use_enum_values=True,
    )


class ManualOverrideResponse(BaseModel):
    """Response from manual override endpoint."""

    manualOverride: ManualOverride


# Pagination
class PaginationInfo(BaseModel):
    """Pagination metadata."""

    currentPage: int = Field(ge=1)
    pageSize: int = Field(ge=1, le=250)
    totalItems: int = Field(ge=0)
    totalPages: int = Field(ge=0)
    hasNextPage: bool
    hasPreviousPage: bool
