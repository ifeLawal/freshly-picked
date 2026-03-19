from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, DateTime
from sqlmodel import Field, Relationship, SQLModel

# Avoid circular imports at runtime — only used for type hints
if TYPE_CHECKING:
    from app.models.recommendation import Recommendation


class Host(SQLModel, table=True):
    """A podcast host who makes recommendations on the show."""

    __tablename__ = "hosts"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    slug: str = Field(unique=True, index=True)

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, default=datetime.utcnow, nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False),
    )

    # One host → many recommendations
    recommendations: List["Recommendation"] = Relationship(back_populates="host")
