from __future__ import annotations

from pathlib import Path
from typing import Dict

from app.agents.base import BaseAgent
from app.agents.mag_agent import MagAgent
from app.agents.swis_agent import SwisAgent
from app.agents.velc_agent import VelcAgent
from app.core.config import settings
from app.core.logging import logger


class AgentRegistry:
    """
    Central registry of all ACTIVE agents.

    Provides a single place to instantiate, load, and retrieve agents
    by name. Used via dependency injection (see `app/api/deps.py`) so
    routes and the orchestrator share the same agent instances and
    avoid redundant model loading.

    Future agents (Arrival, Knowledge/RAG) are intentionally NOT
    registered here. To activate them, import from
    `app.agents.future_agents` and add entries to `self._agents`.
    """

    def __init__(self, model_dir: Path) -> None:
        self._agents: Dict[str, BaseAgent] = {
            "velc": VelcAgent(model_dir=model_dir),
            "swis": SwisAgent(model_dir=model_dir),
            "mag": MagAgent(model_dir=model_dir),
        }

    def load_all(self) -> None:
        """Call `load()` on every registered agent (e.g. at startup)."""
        for name, agent in self._agents.items():
            try:
                agent.load()
                logger.info(f"Agent '{name}' loaded successfully.")
            except Exception:
                logger.exception(f"Agent '{name}' failed to load.")

    def get(self, name: str) -> BaseAgent:
        """Retrieve a registered agent by name."""
        try:
            return self._agents[name]
        except KeyError as exc:
            raise KeyError(f"No agent registered under name '{name}'") from exc

    def all(self) -> Dict[str, BaseAgent]:
        """Return all registered agents."""
        return self._agents


# Module-level singleton, shared across the application lifespan.
agent_registry = AgentRegistry(model_dir=settings.model_path)
