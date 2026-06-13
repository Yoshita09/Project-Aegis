from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.agents.registry import agent_registry
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import AegisException
from app.core.logging import configure_logging, logger
from app.schemas.common import ErrorResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.

    On startup:
      - Configure structured logging.
      - Load all active agents (mock mode for now).

    On shutdown:
      - Log a clean shutdown message. Add resource cleanup here if
        agents later hold persistent resources (e.g. GPU contexts).
    """
    configure_logging()
    logger.info(f"Starting {settings.PROJECT_NAME} ({settings.ENVIRONMENT})")
    agent_registry.load_all()
    yield
    logger.info("Shutting down AEGIS backend.")


app = FastAPI(
    title="AEGIS Backend",
    description="AI-powered Space Weather Intelligence Platform - ADITYA-L1 telemetry.",
    version="1.0.0",
    lifespan=lifespan,
)

# ----------------------------------------------------------------------
# CORS
# ----------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------------------------------------
# Exception handlers
# ----------------------------------------------------------------------
@app.exception_handler(AegisException)
async def aegis_exception_handler(request: Request, exc: AegisException) -> JSONResponse:
    """Convert any `AegisException` subclass into a structured JSON error."""
    logger.error(f"{exc.__class__.__name__}: {exc.message}")

    extra = None
    if hasattr(exc, "missing"):
        extra = {"missing": exc.missing}  # type: ignore[attr-defined]
    elif hasattr(exc, "agent_name"):
        extra = {"agent": exc.agent_name}  # type: ignore[attr-defined]

    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            detail=exc.message,
            error_type=exc.__class__.__name__,
            extra=extra,
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler for unexpected exceptions."""
    logger.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            detail="An unexpected error occurred.",
            error_type=exc.__class__.__name__,
        ).model_dump(),
    )


# ----------------------------------------------------------------------
# Routers
# ----------------------------------------------------------------------
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/", tags=["root"])
async def root() -> dict[str, str]:
    """Basic liveness endpoint."""
    return {"status": "ok", "service": settings.PROJECT_NAME}
