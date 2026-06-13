from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_orchestrator, get_settings, upload_dir_for
from app.core.config import Settings
from app.core.exceptions import MissingPayloadError
from app.core.logging import logger
from app.schemas.analysis import AnalysisResponse
from app.services.orchestrator import AegisOrchestrator
from app.utils.file_storage import latest_payload

router = APIRouter(tags=["analysis"])

REQUIRED_AGENTS = ("velc", "swis", "mag")


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    summary="Run the full AEGIS orchestrator across all uploaded payloads.",
)
async def analyze(
    settings: Settings = Depends(get_settings),
    orchestrator: AegisOrchestrator = Depends(get_orchestrator),
) -> AnalysisResponse:
    """
    Verifies that VELC, SWIS, and MAG payloads have all been uploaded,
    then runs the `AegisOrchestrator` to produce the combined CME
    probability, reasoning payload, and per-agent results.

    Raises:
        MissingPayloadError (409): if one or more required payloads
            have not yet been uploaded.
    """
    payload_paths: dict[str, str] = {}
    missing: list[str] = []

    for agent_name in REQUIRED_AGENTS:
        directory = upload_dir_for(agent_name, settings)
        payload = latest_payload(directory)
        if payload is None:
            missing.append(agent_name)
        else:
            payload_paths[agent_name] = payload

    if missing:
        logger.warning(f"Analysis blocked - missing payloads: {missing}")
        raise MissingPayloadError(missing)

    result = orchestrator.run(
        velc_path=payload_paths["velc"],
        swis_path=payload_paths["swis"],
        mag_path=payload_paths["mag"],
    )

    return result
