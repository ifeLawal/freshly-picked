from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.category import Category
from app.models.episode import Episode
from app.models.host import Host
from app.models.recommendation import Recommendation
from app.models.recommendation_tag import RecommendationTag
from app.models.tag import Tag


async def get_recommendations(
    session: AsyncSession,
    host: Optional[str] = None,
    category: Optional[str] = None,
    tag: Optional[str] = None,
    episode: Optional[str] = None,
    search: Optional[str] = None,
    ids: Optional[list[int]] = None,
    limit: int = 50,
    offset: int = 0,
) -> list[Recommendation]:
    stmt = (
        select(Recommendation)
        .options(
            selectinload(Recommendation.host),
            selectinload(Recommendation.episode),
            selectinload(Recommendation.category),
        )
    )

    if ids:
        # Batch fetch by explicit IDs — other filters are ignored when ids is provided
        stmt = stmt.where(Recommendation.id.in_(ids))
        result = await session.execute(stmt)
        return list(result.scalars().all())

    if host:
        stmt = stmt.join(Recommendation.host).where(Host.slug == host)

    if category:
        stmt = stmt.join(Recommendation.category).where(Category.slug == category)

    if episode:
        stmt = stmt.join(Recommendation.episode).where(Episode.slug == episode)

    if tag:
        # Filter via the join table — a recommendation must have a tag with this slug
        # .distinct() prevents duplicate rows when a recommendation has multiple matching tags
        stmt = (
            stmt
            .join(RecommendationTag, RecommendationTag.recommendation_id == Recommendation.id)
            .join(Tag, Tag.id == RecommendationTag.tag_id)
            .where(Tag.slug == tag)
            .distinct()
        )

    if search:
        # Case-insensitive substring match across title and why_recommended
        pattern = f"%{search}%"
        stmt = stmt.where(
            Recommendation.title.ilike(pattern)
            | Recommendation.why_recommended.ilike(pattern)
        )

    stmt = stmt.limit(limit).offset(offset)
    result = await session.execute(stmt)
    return list(result.scalars().all())
