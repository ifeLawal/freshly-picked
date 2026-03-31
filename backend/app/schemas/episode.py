from datetime import date
from typing import Optional

from pydantic import BaseModel


class EpisodeWithCount(BaseModel):
    id: int
    slug: str
    title: str
    season: int
    episode_number: int
    air_date: Optional[date]
    description: Optional[str]
    thumbnail_url: Optional[str]
    recommendation_count: int
