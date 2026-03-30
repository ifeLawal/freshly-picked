from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.api.v1.router import router
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


_is_local = settings.env == "local"

app = FastAPI(
    title="Freshly Picked API",
    description="Backend API for the Freshly Picked recommendation catalog.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if _is_local else None,
    redoc_url="/redoc" if _is_local else None,
    openapi_url="/openapi.json" if _is_local else None,
)
app.include_router(router)
