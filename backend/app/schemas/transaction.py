"""Pydantic schemas for transaction endpoints."""

from datetime import date
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import Classification


# Bank Transaction Details
class BankTransactionDetails(BaseModel):
    """Bank transaction details."""

    id: UUID
    amount: float
    reference: str
    date: str  # ISO 8601 format (YYYY-MM-DD)
    description: Optional[str] = None
    transactionType: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
    )


# Internal Record Details
class InternalRecordDetails(BaseModel):
    """Internal transaction record details."""

    id: UUID
    amount: float
    reference: str
    date: str  # ISO 8601 format (YYYY-MM-DD)
    description: Optional[str] = None
    accountCode: Optional[str] = None
    costCenter: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
    )


# Transaction Record
class TransactionRecord(BaseModel):
    """Transaction record with classification."""

    id: UUID
    amount: float
    reference: str
    date: str  # ISO 8601 format (YYYY-MM-DD)
    classification: Classification
    varianceAmount: Optional[float] = None
    bankTransaction: Optional[BankTransactionDetails] = None
    internalRecord: Optional[InternalRecordDetails] = None
    matchedPairId: Optional[UUID] = None
    overrides: Optional[List["ManualOverride"]] = None

    model_config = ConfigDict(
        populate_by_name=True,
        use_enum_values=True,
    )


# Get Transactions Response
class GetTransactionsResponse(BaseModel):
    """Response from get transactions endpoint."""

    transactions: List[TransactionRecord]
    pagination: "PaginationInfo"


# Update Classification Response
class UpdateClassificationResponse(BaseModel):
    """Response from update classification endpoint."""

    transaction: TransactionRecord
    auditLogId: UUID


# Import to avoid circular dependency
from app.schemas.reconciliation import ManualOverride, PaginationInfo  # noqa: F401, E402
