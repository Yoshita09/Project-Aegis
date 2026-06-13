from __future__ import annotations

from fastapi import APIRouter, Depends

from app.agents.registry import AgentRegistry
from app.api.deps import get_agent_registry
from app.schemas.common import SystemStatusResponse

router = APIRouter(tags=["system"])


@router.get(
    "/status",
    response_model=SystemStatusResponse,
    summary="Get health status of all active agents.",
)
async def system_status(
    registry: AgentRegistry = Depends(get_agent_registry),
) -> SystemStatusResponse:
    """
    Returns the load/health status of every active agent (VELC, SWIS,
    MAG). Used by the frontend's System Status panel.
    """
    health_checks = [agent.health() for agent in registry.all().values()]
    overall = "ok" if all(h.status == "ok" for h in health_checks) else "degraded"

    return SystemStatusResponse(status=overall, agents=health_checks)
