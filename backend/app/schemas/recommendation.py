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


class TagSummary(BaseModel):
    id: int
    name: str
    slug: str

    model_config = {"from_attributes": True}


class RecommendationSummary(BaseModel):
    id: int
    slug: str
    title: str
    image_url: Optional[str]
    audio_clip_url: Optional[str]
    has_audio: bool
    host: Optional[HostSummary]
    episode: Optional[EpisodeSummary]
    category: Optional[CategorySummary]

    model_config = {"from_attributes": True}


class RecommendationDetail(BaseModel):
    id: int
    slug: str
    title: str
    why_recommended: Optional[str]
    external_url: Optional[str]
    image_url: Optional[str]
    audio_clip_url: Optional[str]
    audio_start_seconds: Optional[int]
    audio_end_seconds: Optional[int]
    has_audio: bool
    host: Optional[HostSummary]
    episode: Optional[EpisodeSummary]
    category: Optional[CategorySummary]
    tags: list[TagSummary]

    model_config = {"from_attributes": True}
