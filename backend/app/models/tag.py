from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, DateTime
from sqlmodel import Field, Relationship, SQLModel

from app.models.recommendation_tag import RecommendationTag

# Avoid circular imports at runtime — only used for type hints
if TYPE_CHECKING:
    from app.models.recommendation import Recommendation


class Tag(SQLModel, table=True):
    """A freeform label that can be applied to many recommendations."""

    __tablename__ = "tags"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    slug: str = Field(unique=True, index=True)

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, default=datetime.utcnow, nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False),
    )

    # Many tags ↔ many recommendations via RecommendationTag
    recommendations: List["Recommendation"] = Relationship(
        back_populates="tags", link_model=RecommendationTag
    )
