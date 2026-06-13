from __future__ import annotations

from pydantic import BaseModel, Field


class VelcOutput(BaseModel):
    """Output schema for the VELC (Vision Transformer) agent."""

    coronal_loop_expansion: float = Field(
        ..., description="Measured expansion factor of coronal loops."
    )
    flux_rope_deformation_risk: float = Field(
        ..., description="Risk score for flux rope deformation."
    )
    pre_eruption_signal_strength: float = Field(
        ..., description="Strength of pre-eruption signal detected in coronagraph data."
    )


class SwisOutput(BaseModel):
    """Output schema for the SWIS-ASPEX solar wind agent."""

    plasma_instability: float = Field(
        ..., description="Instability score derived from plasma telemetry."
    )
    wind_anomaly: float = Field(
        ..., description="Anomaly score for solar wind behavior."
    )


class MagOutput(BaseModel):
    """Output schema for the MAG magnetic field agent."""

    magnetic_stress: float = Field(
        ..., description="Stress score derived from magnetic field telemetry."
    )
    reconnection_probability: float = Field(
        ..., description="Probability of magnetic reconnection event."
    )
