"""Custom exceptions for the API."""

from typing import Any, Dict, Optional


class ApiError(Exception):
    """Base API exception."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(ApiError):
    """Request validation failed."""

    def __init__(
        self,
        message: str = "Validation failed",
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(
            message=message,
            status_code=400,
            error_code="VALIDATION_ERROR",
            details=details,
        )


class NotFoundError(ApiError):
    """Resource not found."""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message,
            status_code=404,
            error_code="NOT_FOUND",
        )


class InvalidTransitionError(ApiError):
    """Invalid workflow state transition."""

    def __init__(self, message: str = "Invalid state transition"):
        super().__init__(
            message=message,
            status_code=400,
            error_code="INVALID_TRANSITION",
        )


class ConflictError(ApiError):
    """Resource conflict (e.g., already approved)."""

    def __init__(self, message: str = "Resource conflict"):
        super().__init__(
            message=message,
            status_code=409,
            error_code="CONFLICT",
        )


class OracleUnavailableError(ApiError):
    """Oracle database unavailable."""

    def __init__(self, message: str = "Oracle database unavailable"):
        super().__init__(
            message=message,
            status_code=503,
            error_code="ORACLE_UNAVAILABLE",
        )


class UnauthorizedError(ApiError):
    """Authentication required."""

    def __init__(self, message: str = "Authentication required"):
        super().__init__(
            message=message,
            status_code=401,
            error_code="UNAUTHORIZED",
        )


class ForbiddenError(ApiError):
    """Insufficient permissions."""

    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(
            message=message,
            status_code=403,
            error_code="FORBIDDEN",
        )
