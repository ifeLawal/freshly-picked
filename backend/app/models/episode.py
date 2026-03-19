from datetime import date, datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, DateTime
from sqlmodel import Field, Relationship, SQLModel

# Avoid circular imports at runtime — only used for type hints
if TYPE_CHECKING:
    from app.models.recommendation import Recommendation


class Episode(SQLModel, table=True):
    """A single episode of the After Hours Podcast."""

    __tablename__ = "episodes"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    slug: str = Field(unique=True, index=True)
    season: int
    episode_number: int
    air_date: Optional[date] = Field(default=None)
    description: Optional[str] = Field(default=None)
    thumbnail_url: Optional[str] = Field(default=None)

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, default=datetime.utcnow, nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False),
    )

    # One episode → many recommendations
    recommendations: List["Recommendation"] = Relationship(back_populates="episode")
