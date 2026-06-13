from __future__ import annotations

from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Centralized application configuration.

    All values can be overridden via environment variables or a `.env`
    file placed in the backend root directory.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # --- General -----------------------------------------------------
    PROJECT_NAME: str = "AEGIS Backend"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"

    # --- API -----------------------------------------------------------
    API_PREFIX: str = "/api/v1"

    # --- Storage ---------------------------------------------------------
    UPLOAD_DIR: str = "app/uploads"
    MODEL_DIR: str = "app/models"

    # --- CORS -------------------------------------------------------------
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # --- Derived helpers ---------------------------------------------------
    @property
    def upload_path(self) -> Path:
        path = Path(self.UPLOAD_DIR)
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def model_path(self) -> Path:
        path = Path(self.MODEL_DIR)
        path.mkdir(parents=True, exist_ok=True)
        return path


settings = Settings()
