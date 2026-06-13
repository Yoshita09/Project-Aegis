from __future__ import annotations

"""
Placeholder definitions for future agents.

These agents are NOT registered in the active `AgentRegistry` and are
NOT invoked by the orchestrator. They exist so the eventual
implementation has a clear home, and so other modules (e.g. the
orchestrator's "future agents" hook) can reference them without
import errors once enabled.

To activate an agent:
  1. Implement its `load()` / `predict()` / `health()` methods properly.
  2. Add a corresponding output schema in `app/schemas/agent_outputs.py`.
  3. Register it in `app/agents/registry.py`.
  4. Extend `AegisOrchestrator` to invoke it and fold its output into
     `derived_metrics`.
"""

from pathlib import Path
from typing import Any

from app.agents.base import BaseAgent
from app.core.logging import logger


class ArrivalAgent(BaseAgent[Any]):
    """
    Future agent: estimates CME arrival time at Earth/L1.

    Intended model file: `agent_6(solar_arrival).pth`.
    """

    name = "arrival"
    model_filename = "agent_6(solar_arrival).pth"

    def load(self) -> None:
        logger.info(f"[{self.name}] (inactive) load() called - not implemented")
        self.loaded = False

    def predict(self, payload_path: Path) -> Any:
        raise NotImplementedError("ArrivalAgent is not yet active.")


class KnowledgeAgent(BaseAgent[Any]):
    """
    Future agent: Retrieval-Augmented Generation (RAG) knowledge agent.

    Intended stack: ChromaDB / FAISS + LangChain + OpenAI.
    Intended model file: `agent4_complete.pkl` (or vector store equivalent).
    """

    name = "knowledge"
    model_filename = "agent4_complete.pkl"

    def load(self) -> None:
        logger.info(f"[{self.name}] (inactive) load() called - not implemented")
        self.loaded = False

    def predict(self, payload_path: Path) -> Any:
        raise NotImplementedError("KnowledgeAgent is not yet active.")
