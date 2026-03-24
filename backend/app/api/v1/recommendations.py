from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.repositories.recommendation_repository import get_recommendations
from app.schemas.recommendation import RecommendationSummary

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


def _to_summary(rec) -> RecommendationSummary:
    return RecommendationSummary(
        id=rec.id,
        slug=rec.slug,
        title=rec.title,
        image_url=rec.image_url,
        audio_clip_url=rec.audio_clip_url,
        has_audio=rec.audio_clip_url is not None,
        host=rec.host,
        episode=rec.episode,
        category=rec.category,
    )


@router.get("", response_model=list[RecommendationSummary])
async def list_recommendations(
    host: Optional[str] = Query(default=None, description="Filter by host slug"),
    category: Optional[str] = Query(default=None, description="Filter by category slug"),
    tag: Optional[str] = Query(default=None, description="Filter by tag slug"),
    episode: Optional[str] = Query(default=None, description="Filter by episode slug"),
    search: Optional[str] = Query(default=None, description="Keyword search across title and why_recommended"),
    ids: Optional[str] = Query(default=None, description="Comma-separated recommendation IDs for batch fetch"),
    limit: int = Query(default=50, ge=1, le=200, description="Number of results per page"),
    offset: int = Query(default=0, ge=0, description="Number of results to skip"),
    session: AsyncSession = Depends(get_session),
) -> list[RecommendationSummary]:
    if ids:
        try:
            parsed_ids = [int(i) for i in ids.split(",") if i.strip()]
        except ValueError:
            raise HTTPException(status_code=422, detail="ids must be comma-separated integers")
    else:
        parsed_ids = None

    recs = await get_recommendations(
        session=session,
        host=host,
        category=category,
        tag=tag,
        episode=episode,
        search=search,
        ids=parsed_ids,
        limit=limit,
        offset=offset,
    )

    return [_to_summary(r) for r in recs]
