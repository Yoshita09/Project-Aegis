from __future__ import annotations

from pathlib import Path

from app.agents.base import BaseAgent
from app.core.logging import logger
from app.schemas.agent_outputs import SwisOutput


class SwisAgent(BaseAgent[SwisOutput]):
    """
    SWIS-ASPEX Agent.

    Analyzes solar wind telemetry (SWIS/ASPEX) to estimate plasma
    instability and wind anomaly scores.

    NOTE: Currently operates in mock mode. The `load()` method is a stub
    that should later load `Agent2_SolarWind.pth` via the inference
    wrapper in `app/services/inference.py`.
    """

    name = "swis"
    model_filename = "Agent2_SolarWind.pth"

    def load(self) -> None:
        """
        Mock loader.

        Future implementation should load `Agent2_SolarWind.pth` and
        assign the resulting model object to `self.model`.
        """
        logger.info(f"[{self.name}] loading model (mock mode)")
        self.model = None
        self.loaded = True

    def predict(self, payload_path: Path) -> SwisOutput:
        """
        Run SWIS-ASPEX inference on the uploaded solar wind archive.

        Args:
            payload_path: Path to the stored SWIS/ASPEX ZIP file.

        Returns:
            SwisOutput with mock metrics. Replace `_infer()` with real
            inference once `Agent2_SolarWind.pth` is wired into `self.model`.
        """
        self._ensure_loaded()
        return self._run_safely(self._infer, payload_path)

    # ------------------------------------------------------------------
    def _infer(self, payload_path: Path) -> SwisOutput:
        logger.info(f"[{self.name}] running inference on {payload_path.name}")

        # --- MOCK INFERENCE -------------------------------------------------
        # TODO: Replace with real inference using `self.model`.
        return SwisOutput(
            plasma_instability=0.81,
            wind_anomaly=0.72,
        )
