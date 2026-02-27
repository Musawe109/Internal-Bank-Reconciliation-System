"""PostgreSQL database connection."""

from functools import lru_cache
from typing import Generator

from sqlmodel import Session, create_engine

from app.config import get_settings

engine = None


def get_engine():
    """Get or create the database engine."""
    global engine
    if engine is None:
        settings = get_settings()
        engine = create_engine(
            settings.DATABASE_URL,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            echo=settings.DEBUG,
        )
    return engine


def get_session() -> Generator[Session, None, None]:
    """Database session dependency for FastAPI routes.

    Usage:
        @router.get("/endpoint")
        def endpoint(db: Session = Depends(get_session)):
            ...
    """
    session = Session(get_engine())
    try:
        yield session
    finally:
        session.close()


@lru_cache
def get_db_url() -> str:
    """Get cached database URL."""
    return get_settings().DATABASE_URL
