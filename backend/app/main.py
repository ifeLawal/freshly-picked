from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.api.v1.router import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="FreshlyPicked API", version="0.1.0", lifespan=lifespan)
app.include_router(router)
