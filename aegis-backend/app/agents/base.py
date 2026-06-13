from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel

from app.core.exceptions import AgentInferenceError, AgentNotLoadedError
from app.core.logging import logger
from app.schemas.common import HealthStatus

OutputT = TypeVar("OutputT", bound=BaseModel)


class BaseAgent(ABC, Generic[OutputT]):
    """
    Abstract base class for all AEGIS inference agents.

    Concrete agents must implement:
      - `load()`:    load model weights / initialize inference backend.
      - `predict()`: run inference on a stored payload and return a
                      validated Pydantic output schema.
      - `health()`:  report current loading/operational status.

    The base class also provides:
      - Consistent error wrapping via `AgentInferenceError`.
      - A `loaded` flag that subclasses must set in `load()`.
      - A `_safe_load_model()` helper for future real model loading,
        which agents can call from `load()` once real weights are wired in.
    """

    #: Human-readable agent name, used in logs, errors, and API responses.
    name: str = "base"

    #: Expected weights filename inside `settings.MODEL_DIR` (for future use).
    model_filename: Optional[str] = None

    def __init__(self, model_dir: Path) -> None:
        self.model_dir = model_dir
        self.loaded: bool = False
        self.model: Any = None

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------
    @abstractmethod
    def load(self) -> None:
        """
        Load the underlying model/weights.

        Implementations should set `self.loaded = True` on success and
        store the loaded model/inference object in `self.model`.

        For now, concrete agents may implement this as a no-op / mock
        loader. The abstraction is in place so real `.pth` / `.pkl`
        weights can be wired in later without changing API routes.
        """
        raise NotImplementedError

    @abstractmethod
    def predict(self, payload_path: Path) -> OutputT:
        """
        Run inference on the given payload (e.g. an extracted ZIP
        directory or file) and return a validated output schema.

        Args:
            payload_path: Path to the stored uploaded archive.

        Returns:
            A populated Pydantic model matching this agent's output schema.

        Raises:
            AgentNotLoadedError: if `load()` has not been called/succeeded.
            AgentInferenceError: if inference fails for any reason.
        """
        raise NotImplementedError

    def health(self) -> HealthStatus:
        """Return the current health/status of this agent."""
        return HealthStatus(
            name=self.name,
            loaded=self.loaded,
            status="ok" if self.loaded else "degraded",
            detail=None if self.loaded else "Model not loaded (mock mode).",
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    def _ensure_loaded(self) -> None:
        """Raise if `predict()` is called before a successful `load()`."""
        if not self.loaded:
            raise AgentNotLoadedError(self.name)

    def _run_safely(self, fn, *args: Any, **kwargs: Any) -> Any:
        """
        Execute `fn` and wrap any unexpected exception in
        `AgentInferenceError`, preserving the original traceback context.
        """
        try:
            return fn(*args, **kwargs)
        except AgentInferenceError:
            raise
        except Exception as exc:  # noqa: BLE001 - intentional broad catch boundary
            logger.exception(f"[{self.name}] inference failed")
            raise AgentInferenceError(self.name, str(exc)) from exc
