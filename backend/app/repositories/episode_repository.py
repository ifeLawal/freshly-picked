from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.episode import Episode
from app.models.recommendation import Recommendation


async def get_episodes(session: AsyncSession) -> list[tuple[Episode, int]]:
    stmt = (
        select(Episode, func.count(Recommendation.id).label("recommendation_count"))
        .outerjoin(Recommendation, Recommendation.episode_id == Episode.id)
        .group_by(Episode.id)
        .order_by(Episode.season, Episode.episode_number)
    )
    result = await session.execute(stmt)
    return [(row.Episode, row.recommendation_count) for row in result.all()]


async def get_episode_by_id(session: AsyncSession, episode_id: int) -> Optional[Episode]:
    stmt = select(Episode).where(Episode.id == episode_id)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()
