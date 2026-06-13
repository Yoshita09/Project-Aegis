from __future__ import annotations

import sys

from loguru import logger

from app.core.config import settings


def configure_logging() -> None:
    """
    Configure loguru as the application-wide logger.

    Removes the default handler and installs a structured, leveled
    handler whose verbosity is controlled by `settings.LOG_LEVEL`.
    """
    logger.remove()
    logger.add(
        sys.stdout,
        level=settings.LOG_LEVEL.upper(),
        format=(
            "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> "
            "- <level>{message}</level>"
        ),
        colorize=True,
        backtrace=True,
        diagnose=settings.ENVIRONMENT != "production",
    )


__all__ = ["logger", "configure_logging"]
