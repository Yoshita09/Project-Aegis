from __future__ import annotations

from pathlib import Path

from app.agents.registry import AgentRegistry
from app.core.logging import logger
from app.schemas.agent_outputs import MagOutput, SwisOutput, VelcOutput
from app.schemas.analysis import (
    AgentResultsBundle,
    AnalysisResponse,
    DerivedMetrics,
    ReasoningPayload,
)


class AegisOrchestrator:
    """
    Coordinates execution of all active agents and aggregates their
    outputs into a final analysis response.

    Responsibilities:
      - Invoke VELC, SWIS, and MAG agents against their stored payloads.
      - Aggregate raw agent outputs.
      - Derive a CME probability from the combined signals.
      - Generate a reasoning payload explaining the derived metrics.
      - Assemble the final `AnalysisResponse`.

    Future extension points:
      - Once `ArrivalAgent` is activated, this orchestrator should also
        invoke it and fold an arrival forecast into `derived_metrics`.
      - Once `KnowledgeAgent` (RAG) is activated, its retrieved context
        can be injected into `ReasoningPayload.contributing_factors`
        without changing the public `AnalysisResponse` schema.
    """

    def __init__(self, agent_registry: AgentRegistry) -> None:
        self.agent_registry = agent_registry

    def run(self, velc_path: Path, swis_path: Path, mag_path: Path) -> AnalysisResponse:
        """
        Execute the full analysis pipeline.

        Args:
            velc_path: Path to the stored VELC ZIP payload.
            swis_path: Path to the stored SWIS/ASPEX ZIP payload.
            mag_path: Path to the stored MAG ZIP payload.

        Returns:
            A fully populated `AnalysisResponse`.
        """
        logger.info("Orchestrator: starting full analysis run")

        velc_output: VelcOutput = self.agent_registry.get("velc").predict(velc_path)
        swis_output: SwisOutput = self.agent_registry.get("swis").predict(swis_path)
        mag_output: MagOutput = self.agent_registry.get("mag").predict(mag_path)

        agents_bundle = AgentResultsBundle(
            velc=velc_output,
            swis=swis_output,
            mag=mag_output,
        )

        cme_probability = self._compute_cme_probability(velc_output, swis_output, mag_output)
        reasoning = self._build_reasoning(velc_output, swis_output, mag_output, cme_probability)

        derived_metrics = DerivedMetrics(
            cme_probability=cme_probability,
            reasoning=reasoning,
        )

        logger.info(
            f"Orchestrator: analysis complete (cme_probability={cme_probability:.2f})"
        )

        return AnalysisResponse(
            agents=agents_bundle,
            derived_metrics=derived_metrics,
        )

    # ------------------------------------------------------------------
    # Aggregation logic
    # ------------------------------------------------------------------
    def _compute_cme_probability(
        self,
        velc: VelcOutput,
        swis: SwisOutput,
        mag: MagOutput,
    ) -> float:
        """
        Derive an overall CME probability from the three agents' outputs.

        Current implementation is a simple weighted heuristic intended
        as a placeholder until a dedicated fusion model is trained.
        Values are clamped to [0, 1].

        Weighting rationale (placeholder):
          - VELC pre-eruption signal strength is the strongest early
            indicator -> highest weight.
          - MAG reconnection probability and SWIS plasma instability
            contribute supporting evidence.
        """
        # Normalize VELC's larger-scale signal strength into [0, 1]-ish range.
        normalized_signal = min(velc.pre_eruption_signal_strength / 5.0, 1.0)
        normalized_flux_risk = min(velc.flux_rope_deformation_risk / 2.0, 1.0)

        weighted = (
            0.40 * normalized_signal
            + 0.20 * normalized_flux_risk
            + 0.20 * mag.reconnection_probability
            + 0.20 * swis.plasma_instability
        )

        cme_probability = max(0.0, min(weighted, 1.0))
        return round(cme_probability, 2)

    def _build_reasoning(
        self,
        velc: VelcOutput,
        swis: SwisOutput,
        mag: MagOutput,
        cme_probability: float,
    ) -> ReasoningPayload:
        """
        Build a structured reasoning payload summarizing how each
        agent's output contributed to the final CME probability.
        """
        contributing_factors = {
            "velc": {
                "pre_eruption_signal_strength": velc.pre_eruption_signal_strength,
                "flux_rope_deformation_risk": velc.flux_rope_deformation_risk,
                "coronal_loop_expansion": velc.coronal_loop_expansion,
                "weight": 0.60,
            },
            "mag": {
                "reconnection_probability": mag.reconnection_probability,
                "magnetic_stress": mag.magnetic_stress,
                "weight": 0.20,
            },
            "swis": {
                "plasma_instability": swis.plasma_instability,
                "wind_anomaly": swis.wind_anomaly,
                "weight": 0.20,
            },
        }

        if cme_probability >= 0.75:
            risk_level = "high"
        elif cme_probability >= 0.45:
            risk_level = "moderate"
        else:
            risk_level = "low"

        summary = (
            f"Combined telemetry analysis indicates a {risk_level} likelihood "
            f"of a Coronal Mass Ejection (CME = {cme_probability:.2f}). "
            f"VELC coronagraph data shows a pre-eruption signal strength of "
            f"{velc.pre_eruption_signal_strength:.2f} with flux rope deformation "
            f"risk of {velc.flux_rope_deformation_risk:.2f}. Magnetic field "
            f"telemetry indicates a reconnection probability of "
            f"{mag.reconnection_probability:.2f}, while solar wind data shows "
            f"plasma instability of {swis.plasma_instability:.2f}."
        )

        # Confidence is currently a placeholder derived from agreement
        # between independent signals; refine once real models are wired in.
        confidence = round(0.5 + 0.5 * cme_probability, 2)

        return ReasoningPayload(
            summary=summary,
            contributing_factors=contributing_factors,
            confidence=min(confidence, 1.0),
        )
