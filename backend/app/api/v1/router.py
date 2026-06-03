"""API v1 router that aggregates all endpoint routers."""

from fastapi import APIRouter

from app.api.v1.episodes import router as episodes_router
from app.api.v1.health import router as health_router
from app.api.v1.recommendations import router as recommendations_router

router = APIRouter(prefix="/api/v1")

# Include all routers
router.include_router(health_router)
router.include_router(episodes_router)
router.include_router(recommendations_router)