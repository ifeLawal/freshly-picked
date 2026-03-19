from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, DateTime
from sqlmodel import Field, Relationship, SQLModel

from app.models.category import Category
from app.models.episode import Episode
from app.models.host import Host
from app.models.recommendation_tag import RecommendationTag
from app.models.tag import Tag


class Recommendation(SQLModel, table=True):
    """
    A single recommendation made by a host during an episode.
    external_source_id is used during ingestion to identify and upsert records
    sourced from the scraped picks data.
    """

    __tablename__ = "recommendations"

    id: Optional[int] = Field(default=None, primary_key=True)

    # Human-readable URL-safe identifier, generated at ingestion time
    slug: str = Field(unique=True, index=True)

    # Stable ID from the source data used to detect and upsert existing records
    external_source_id: Optional[str] = Field(default=None, unique=True, index=True)

    title: str = Field(index=True)

    # The host's explanation of why they recommended this (raw_pick_content in source)
    why_recommended: Optional[str] = Field(default=None)

    # Link to the external resource (book, article, restaurant, etc.)
    external_url: Optional[str] = Field(default=None)

    # Optional media — populated after S3 upload during ingestion
    image_url: Optional[str] = Field(default=None)
    audio_clip_url: Optional[str] = Field(default=None)
    audio_start_seconds: Optional[int] = Field(default=None)
    audio_end_seconds: Optional[int] = Field(default=None)

    # Foreign keys
    host_id: Optional[int] = Field(default=None, foreign_key="hosts.id", index=True)
    episode_id: Optional[int] = Field(default=None, foreign_key="episodes.id", index=True)
    category_id: Optional[int] = Field(default=None, foreign_key="categories.id", index=True)

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, default=datetime.utcnow, nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False),
    )

    # Relationships
    host: Optional[Host] = Relationship(back_populates="recommendations")
    episode: Optional[Episode] = Relationship(back_populates="recommendations")
    category: Optional[Category] = Relationship(back_populates="recommendations")

    # Many recommendations ↔ many tags via RecommendationTag
    tags: List[Tag] = Relationship(
        back_populates="recommendations", link_model=RecommendationTag
    )
