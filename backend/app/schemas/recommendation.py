from typing import Optional

from pydantic import BaseModel


class HostSummary(BaseModel):
    id: int
    name: str
    slug: str

    model_config = {"from_attributes": True}


class EpisodeSummary(BaseModel):
    id: int
    slug: str
    title: str
    season: int
    episode_number: int

    model_config = {"from_attributes": True}


class CategorySummary(BaseModel):
    id: int
    name: str
    slug: str

    model_config = {"from_attributes": True}


class RecommendationSummary(BaseModel):
    id: int
    slug: str
    title: str
    image_url: Optional[str]
    has_audio: bool
    host: Optional[HostSummary]
    episode: Optional[EpisodeSummary]
    category: Optional[CategorySummary]

    model_config = {"from_attributes": True}
