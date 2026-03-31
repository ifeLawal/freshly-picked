from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.repositories.episode_repository import get_episode_by_id, get_episodes
from app.repositories.recommendation_repository import get_recommendations_by_episode_id
from app.schemas.episode import EpisodeWithCount
from app.schemas.recommendation import RecommendationSummary

router = APIRouter(prefix="/episodes", tags=["episodes"])


def _to_episode_with_count(episode, count: int) -> EpisodeWithCount:
    return EpisodeWithCount(
        id=episode.id,
        slug=episode.slug,
        title=episode.title,
        season=episode.season,
        episode_number=episode.episode_number,
        air_date=episode.air_date,
        description=episode.description,
        thumbnail_url=episode.thumbnail_url,
        recommendation_count=count,
    )


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


@router.get(
    "",
    response_model=list[EpisodeWithCount],
    summary="List episodes",
    description="Returns all episodes ordered by season and episode number, each with a recommendation count.",
)
async def list_episodes(
    session: AsyncSession = Depends(get_session),
) -> list[EpisodeWithCount]:
    rows = await get_episodes(session)
    return [_to_episode_with_count(ep, count) for ep, count in rows]


@router.get(
    "/{episode_id}/recommendations",
    response_model=list[RecommendationSummary],
    summary="Get episode recommendations",
    description="Returns all recommendations linked to the given episode.",
)
async def get_episode_recommendations(
    episode_id: int = Path(..., description="The ID of the episode"),
    session: AsyncSession = Depends(get_session),
) -> list[RecommendationSummary]:
    episode = await get_episode_by_id(session, episode_id)
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    recs = await get_recommendations_by_episode_id(session, episode_id)
    return [_to_summary(r) for r in recs]
