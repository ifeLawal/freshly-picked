"""Health check endpoint for the Freshly Picked API."""

from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get(
    "",
    summary="Health Check",
    description="Returns the health status of the API service along with the current timestamp.",
    response_description="Service health status",
)
async def health_check():
    """
    Health check endpoint that returns service status and current timestamp.
    
    Returns:
        dict: A dictionary containing:
            - status: "ok" if the service is healthy
            - timestamp: Current UTC timestamp in ISO 8601 format
    """
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }