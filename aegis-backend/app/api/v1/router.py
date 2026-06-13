from __future__ import annotations

from fastapi import APIRouter

from app.api.v1 import analysis, status, uploads

api_router = APIRouter()

api_router.include_router(uploads.router)
api_router.include_router(analysis.router)
api_router.include_router(status.router)
