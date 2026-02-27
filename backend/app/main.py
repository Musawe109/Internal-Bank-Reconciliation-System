"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.core.exceptions import ApiError
from app.core.responses import APIResponse
from app.db.postgres import get_engine
from app.db.oracle import check_oracle_connection

# Import routes
from app.api.routes import health, reconciliation, transactions, workflow, audit  # noqa: F401

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """Application lifespan manager."""
    # Startup
    logger.info("Starting Internal Bank Reconciliation System")
    settings = get_settings()
    logger.info(f"Debug mode: {settings.DEBUG}")

    # Initialize database connections
    try:
        get_engine()
        logger.info("PostgreSQL connection initialized")
    except Exception as e:
        logger.error(f"PostgreSQL connection failed: {e}")

    # Yield control
    yield

    # Shutdown
    logger.info("Shutting down application")


# Create FastAPI application
app = FastAPI(
    title="Internal Bank Reconciliation System",
    version="1.0.0",
    description="Backend API for bank reconciliation with workflow approval and audit logging",
    lifespan=lifespan,
)

# Configure CORS
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(ApiError)
async def api_error_handler(request: Request, exc: ApiError):
    """Handle API errors with standardized response."""
    return JSONResponse(
        status_code=exc.status_code,
        content=APIResponse(
            success=False,
            error=exc.message,
            data={"errorCode": exc.error_code, "details": exc.details},
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    logger.error(f"Unexpected error: {exc}", exc_info=True)

    return JSONResponse(
        status_code=500,
        content=APIResponse(
            success=False,
            error="Internal server error",
            data={"errorCode": "INTERNAL_ERROR"},
        ).model_dump(),
    )


# Include routers
app.include_router(health.router)
app.include_router(reconciliation.router)
app.include_router(transactions.router)
app.include_router(workflow.router)
app.include_router(audit.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Internal Bank Reconciliation System API", "version": "1.0.0"}
