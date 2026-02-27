"""Application configuration."""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "Internal Bank Reconciliation System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database - PostgreSQL
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ibrs"

    # Database - Oracle (read-only)
    ORACLE_DSN: str = ""
    ORACLE_USER: str = ""
    ORACLE_PASSWORD: str = ""

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> List[str]:
        """Get list of allowed CORS origins."""
        origins = [self.FRONTEND_URL]
        if self.DEBUG:
            origins.extend([
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:8080",
            ])
        return origins


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
