from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from app.agents.registry import AgentRegistry, agent_registry
from app.core.config import Settings, settings
from app.services.orchestrator import AegisOrchestrator


def get_settings() -> Settings:
    """FastAPI dependency: return the global settings instance."""
    return settings


def get_agent_registry() -> AgentRegistry:
    """FastAPI dependency: return the shared agent registry singleton."""
    return agent_registry


@lru_cache(maxsize=1)
def _orchestrator_singleton() -> AegisOrchestrator:
    return AegisOrchestrator(agent_registry=agent_registry)


def get_orchestrator() -> AegisOrchestrator:
    """FastAPI dependency: return the shared orchestrator instance."""
    return _orchestrator_singleton()


def upload_dir_for(agent_name: str, settings_: Settings) -> Path:
    """Return (and ensure) the upload directory for a given agent."""
    path = settings_.upload_path / agent_name
    path.mkdir(parents=True, exist_ok=True)
    return path
