"""Standardized API response wrapper."""

from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standardized API response wrapper.

    All API responses follow this format to ensure consistency
    with frontend TypeScript types.
    """

    success: bool = Field(..., description="Whether the request was successful")
    data: Optional[T] = Field(None, description="Response data payload")
    error: Optional[str] = Field(None, description="Error message if success is False")


class SuccessResponse(APIResponse[T]):
    """Success response helper."""

    success: bool = True


class ErrorResponse(APIResponse[T]):
    """Error response helper."""

    success: bool = False
    error: str
