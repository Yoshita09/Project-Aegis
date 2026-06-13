from __future__ import annotations

from typing import Any, Dict, Literal

from pydantic import BaseModel, Field

from app.schemas.agent_outputs import MagOutput, SwisOutput, VelcOutput


class AgentResultsBundle(BaseModel):
    """Aggregated raw outputs from all active agents."""

    velc: VelcOutput
    swis: SwisOutput
    mag: MagOutput


class ReasoningPayload(BaseModel):
    """
    Human/agent-readable reasoning trail explaining how the derived
    metrics were produced. Kept loosely typed (Dict) so the orchestrator
    can evolve its reasoning structure without breaking the schema.
    """

    summary: str = Field(..., description="High-level natural-language summary.")
    contributing_factors: Dict[str, Any] = Field(
        default_factory=dict,
        description="Per-agent contribution / weighting breakdown.",
    )
    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence score of the overall assessment."
    )


class DerivedMetrics(BaseModel):
    """Final derived metrics produced by the orchestrator."""

    cme_probability: float = Field(
        ..., ge=0.0, le=1.0, description="Probability of a Coronal Mass Ejection event."
    )
    reasoning: ReasoningPayload


class AnalysisResponse(BaseModel):
    """Response returned by POST /analyze."""

    status: Literal["complete"] = "complete"
    agents: AgentResultsBundle
    derived_metrics: DerivedMetrics
