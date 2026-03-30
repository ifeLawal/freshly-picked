# Swagger / OpenAPI Docs (Dev Only)

## Overview
This step adds Swagger UI and OpenAPI documentation to the FastAPI backend, available in the local development environment only. It gives you a live, interactive view of every endpoint — what it accepts, what it returns, and a way to test it directly in the browser without needing an external tool like Postman.

FastAPI generates OpenAPI docs automatically, but this step ensures they are explicitly disabled in production and properly configured with tags, descriptions, and response schemas so the docs are actually useful.

## Requirements
- Swagger UI enabled only when `ENVIRONMENT=local` (or `DEBUG=true`) via the `.env` file
- OpenAPI docs disabled in production by setting `docs_url=None` and `redoc_url=None` on the FastAPI app when not in local env
- All routers tagged so endpoints are grouped logically in the Swagger UI (e.g. `recommendations`, `episodes`, `hosts`, `categories`, `tags`)
- Each endpoint decorated with `summary` and `description` via FastAPI route params
- Request query params and path params documented via `Query()` and `Path()` with descriptions
- Response schemas defined using existing SQLModel/Pydantic response models so Swagger reflects accurate shapes
- Swagger UI accessible at `http://localhost:8000/docs` in local dev
- ReDoc accessible at `http://localhost:8000/redoc` in local dev (optional but included)

## Checklist
- [ ] Add `ENVIRONMENT` variable to `.env` and `.env.example`
- [ ] Update FastAPI app initialization to conditionally set `docs_url` and `redoc_url` based on `ENVIRONMENT`
- [ ] Add `tags` param to each `APIRouter` instance
- [ ] Add `summary` and `description` to each route decorator
- [ ] Wrap query params with `Query(description="...")` across all endpoints
- [ ] Confirm response models are set on each route via `response_model=`
- [ ] Verify Swagger UI loads at `/docs` locally
- [ ] Verify `/docs` returns 404 (or is unreachable) in production config

## Implementation Notes

### Conditional Swagger setup in `main.py`
```python
import os

ENV = os.getenv("ENVIRONMENT", "local")

app = FastAPI(
    title="Freshly Picked API",
    description="Backend API for the Freshly Picked recommendation catalog.",
    version="1.0.0",
    docs_url="/docs" if ENV == "local" else None,
    redoc_url="/redoc" if ENV == "local" else None,
    openapi_url="/openapi.json" if ENV == "local" else None,
)
```

### Tagging routers
```python
router = APIRouter(prefix="/api/v1/recommendations", tags=["recommendations"])
```

### Documenting a route
```python
@router.get(
    "/",
    summary="List recommendations",
    description="Returns a paginated list of recommendations. Supports filtering by host, category, tag, and episode, and keyword search.",
    response_model=list[RecommendationSummarySchema],
)
def get_recommendations(
    search: str | None = Query(None, description="Keyword search across title and description"),
    host: int | None = Query(None, description="Filter by host ID"),
    category: int | None = Query(None, description="Filter by category ID"),
    tag: str | None = Query(None, description="Filter by tag slug"),
    episode: int | None = Query(None, description="Filter by episode ID"),
    ids: str | None = Query(None, description="Comma-separated list of recommendation IDs for batch fetch"),
):
```

### `.env` change
```
ENVIRONMENT=local
```

### `.env.example` change
```
ENVIRONMENT=local  # Set to "production" in deployed environments
```

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §9 API Design, §11 Backend Architecture, §13 Deployment / Infrastructure
- FastAPI docs: https://fastapi.tiangolo.com/tutorial/metadata/
- FastAPI OpenAPI config: https://fastapi.tiangolo.com/advanced/extending-openapi/

---

## Purpose
Add interactive OpenAPI/Swagger documentation to the local development environment so all endpoints are visible, described, and testable without external tooling.

## Scope
- Conditional Swagger UI (local only)
- Router tagging
- Route-level summaries and descriptions
- Query param documentation
- Response model linkage

## Notes
This requires no new dependencies — FastAPI ships with Swagger UI and ReDoc built in. The only work is configuration and annotation. Keep this step separate from any deployment checklist; the production environment should never expose these endpoints.