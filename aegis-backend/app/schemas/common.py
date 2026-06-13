from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """Standard error envelope returned for all handled exceptions."""

    status: Literal["error"] = "error"
    detail: str = Field(..., description="Human-readable error message.")
    error_type: str = Field(..., description="Exception class name for client-side handling.")
    extra: Optional[dict] = Field(
        default=None, description="Optional additional structured error context."
    )


class HealthStatus(BaseModel):
    """Health status for a single agent or component."""

    name: str
    loaded: bool
    status: Literal["ok", "degraded", "unavailable"]
    detail: Optional[str] = None


class SystemStatusResponse(BaseModel):
    """Overall system status, including each agent's health."""

    status: Literal["ok", "degraded"] = "ok"
    agents: list[HealthStatus]
