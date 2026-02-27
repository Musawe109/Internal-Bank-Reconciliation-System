"""Oracle read-only database connection."""

import logging
from contextlib import contextmanager
from functools import lru_cache
from typing import Generator, List, Optional

try:
    import cx_Oracle
    CX_ORACLE_AVAILABLE = True
except ImportError:
    cx_Oracle = None
    CX_ORACLE_AVAILABLE = False

from app.config import get_settings
from app.core.exceptions import OracleUnavailableError

logger = logging.getLogger(__name__)

# Connection pool (initialized lazily)
_pool: Optional[object] = None


def get_pool():
    """Get or create the Oracle connection pool."""
    global _pool
    if _pool is None:
        settings = get_settings()
        if not CX_ORACLE_AVAILABLE or not settings.ORACLE_DSN or not settings.ORACLE_USER:
            logger.warning("Oracle not configured or cx_Oracle not installed")
            return None

        try:
            _pool = cx_Oracle.SessionPool(
                user=settings.ORACLE_USER,
                password=settings.ORACLE_PASSWORD,
                dsn=settings.ORACLE_DSN,
                min=2,
                max=10,
                increment=1,
                threaded=True,
            )
            # Set session to read-only
            with _pool.acquire() as connection:
                cursor = connection.cursor()
                cursor.execute("ALTER SESSION SET READ ONLY")
                cursor.close()
            logger.info("Oracle connection pool created successfully")
        except Exception as e:
            logger.error(f"Failed to create Oracle pool: {e}")
            raise OracleUnavailableError(f"Cannot connect to Oracle: {str(e)}")

    return _pool


@contextmanager
def get_oracle_connection():
    """Context manager for Oracle connections.

    Usage:
        with get_oracle_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT ...")
    """
    pool = get_pool()
    if pool is None:
        raise OracleUnavailableError("Oracle not configured")

    connection = pool.acquire()
    try:
        yield connection
    finally:
        pool.release(connection)


def fetch_internal_transactions(
    start_date: str,
    end_date: str,
    limit: Optional[int] = None,
) -> List[dict]:
    """Fetch internal transactions from Oracle (read-only).

    Args:
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        limit: Optional limit on results

    Returns:
        List of transaction dictionaries

    Raises:
        OracleUnavailableError: If Oracle is not available
    """
    query = """
        SELECT
            transaction_id,
            amount,
            reference_number,
            transaction_date,
            description,
            account_code,
            cost_center
        FROM internal_transactions
        WHERE transaction_date BETWEEN :start_date AND :end_date
        ORDER BY transaction_date, transaction_id
    """

    if limit:
        query += f" FETCH FIRST {limit} ROWS ONLY"

    try:
        with get_oracle_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                query,
                start_date=start_date,
                end_date=end_date,
            )

            columns = [col[0] for col in cursor.description]
            results = []

            for row in cursor:
                results.append(dict(zip(columns, row)))

            cursor.close()
            return results

    except Exception as e:
        if CX_ORACLE_AVAILABLE:
            logger.error(f"Oracle query failed: {e}")
        raise OracleUnavailableError(f"Failed to fetch transactions: {str(e)}")


def check_oracle_connection() -> bool:
    """Check if Oracle connection is available.

    Returns:
        True if connection successful, False otherwise
    """
    try:
        with get_oracle_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM DUAL")
            cursor.close()
        return True
    except Exception:
        return False
