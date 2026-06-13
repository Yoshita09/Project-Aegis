from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile

from app.agents.registry import AgentRegistry
from app.api.deps import get_agent_registry, get_settings, upload_dir_for
from app.core.config import Settings
from app.core.logging import logger
from app.schemas.upload import UploadResponse
from app.utils.file_storage import save_upload

router = APIRouter(tags=["uploads"])


@router.post(
    "/upload/velc",
    response_model=UploadResponse,
    summary="Upload VELC coronagraph payload and run the VELC agent.",
)
async def upload_velc(
    file: UploadFile = File(..., description="VELC FITS file."),
    settings: Settings = Depends(get_settings),
    registry: AgentRegistry = Depends(get_agent_registry),
) -> UploadResponse:
    """
    Accepts a `.zip` VELC payload, stores it, and immediately runs the
    VELC agent (Vision Transformer) to produce coronagraph analysis
    metrics.
    """
    destination_dir = upload_dir_for("velc", settings)
    stored_path = await save_upload(file, destination_dir)

    agent = registry.get("velc")
    metrics = agent.predict(stored_path)

    logger.info(f"VELC upload processed: {stored_path.name}")

    return UploadResponse(
        agent="velc",
        file=stored_path.name,
        analysis_metrics=metrics,
    )


@router.post(
    "/upload/swis",
    response_model=UploadResponse,
    summary="Upload SWIS/ASPEX solar wind payload and run the SWIS agent.",
)
async def upload_swis(
    file: UploadFile = File(..., description="SWIS/ASPEX CDF file."),
    settings: Settings = Depends(get_settings),
    registry: AgentRegistry = Depends(get_agent_registry),
) -> UploadResponse:
    """
    Accepts a `.zip` SWIS/ASPEX payload, stores it, and immediately runs
    the SWIS-ASPEX agent to produce solar wind analysis metrics.
    """
    destination_dir = upload_dir_for("swis", settings)
    stored_path = await save_upload(file, destination_dir)

    agent = registry.get("swis")
    metrics = agent.predict(stored_path)

    logger.info(f"SWIS upload processed: {stored_path.name}")

    return UploadResponse(
        agent="swis",
        file=stored_path.name,
        analysis_metrics=metrics,
    )


@router.post(
    "/upload/mag",
    response_model=UploadResponse,
    summary="Upload magnetic field payload and run the MAG agent.",
)
async def upload_mag(
    file: UploadFile = File(..., description="MAG NetCDF file."),
    settings: Settings = Depends(get_settings),
    registry: AgentRegistry = Depends(get_agent_registry),
) -> UploadResponse:
    """
    Accepts a `.zip` magnetic field payload, stores it, and immediately
    runs the MAG agent to produce magnetic field analysis metrics.
    """
    destination_dir = upload_dir_for("mag", settings)
    stored_path = await save_upload(file, destination_dir)

    agent = registry.get("mag")
    metrics = agent.predict(stored_path)

    logger.info(f"MAG upload processed: {stored_path.name}")

    return UploadResponse(
        agent="mag",
        file=stored_path.name,
        analysis_metrics=metrics,
    )
