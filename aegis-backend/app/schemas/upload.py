from __future__ import annotations

from typing import Literal, Union

from pydantic import BaseModel, Field

from app.schemas.agent_outputs import MagOutput, SwisOutput, VelcOutput

AgentName = Literal["velc", "swis", "mag"]
AnalysisMetrics = Union[VelcOutput, SwisOutput, MagOutput]


class UploadResponse(BaseModel):
    """Response returned immediately after a payload upload + agent run."""

    status: Literal["uploaded"] = "uploaded"
    agent: AgentName = Field(..., description="Name of the agent that processed this file.")
    file: str = Field(..., description="Stored filename of the uploaded archive.")
    analysis_metrics: AnalysisMetrics = Field(
        ..., description="Immediate inference output produced by the corresponding agent."
    )
