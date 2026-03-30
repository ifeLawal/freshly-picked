from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get(
    "/health",
    summary="Health check",
    description="Returns `{\"status\": \"ok\"}` when the API is running.",
)
async def health_check() -> dict:
    return {"status": "ok"}
