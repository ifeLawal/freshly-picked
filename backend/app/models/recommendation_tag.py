from typing import Optional

from sqlmodel import Field, SQLModel


class RecommendationTag(SQLModel, table=True):
    """
    Junction table linking recommendations to tags (many-to-many).
    Both columns form a composite primary key.
    """

    __tablename__ = "recommendation_tags"

    recommendation_id: Optional[int] = Field(
        default=None, foreign_key="recommendations.id", primary_key=True
    )
    tag_id: Optional[int] = Field(
        default=None, foreign_key="tags.id", primary_key=True
    )
