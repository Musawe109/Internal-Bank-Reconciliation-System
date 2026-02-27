"""Health check endpoint."""

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.responses import APIResponse
from app.db.oracle import check_oracle_connection
from app.db.postgres import get_session

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
async def health_check(db: Session = Depends(get_session)):
    """Health check endpoint.

    Returns:
        Health status with database connection states
    """
    postgres_status = "connected"
    oracle_status = "connected"

    # Check PostgreSQL
    try:
        db.exec(select(1))
    except Exception as e:
        postgres_status = f"error: {str(e)}"

    # Check Oracle
    if not check_oracle_connection():
        oracle_status = "not configured or unavailable"

    return APIResponse(
        success=True,
        data={
            "status": "healthy",
            "postgresql": postgres_status,
            "oracle": oracle_status,
        },
    ).model_dump()
