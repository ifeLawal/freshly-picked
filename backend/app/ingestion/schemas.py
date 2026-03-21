from typing import Optional

from pydantic import BaseModel, HttpUrl, field_validator


# All valid recommendation_type values derived from the source JSON data
VALID_RECOMMENDATION_TYPES = {
    "APP",
    "ARTICLE",
    "BOOK",
    "FOOD OR DRINK",
    "MOVIE",
    "MUSIC",
    "ORGANIZATION",
    "OTHER",
    "PODCAST",
    "RESTAURANT",
    "TV",
    "WEBSITE",
}


class PickRecord(BaseModel):
    """Input schema for a single recommendation record from the JSON source data."""

    # Required fields — ingestion will fail without these
    recommendation_type: str
    recommendation_name: str
    recommended_by: str
    episode: str

    # Optional fields — may be absent in older source records
    recommendation_link: Optional[str] = None
    episode_title: Optional[str] = None
    episode_date: Optional[str] = None
    source_page_url: Optional[str] = None
    raw_pick_content: Optional[str] = None  # Host's original wording from the source page

    @field_validator("recommendation_type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        # Normalize casing before checking membership
        normalized = v.upper().strip()
        if normalized not in VALID_RECOMMENDATION_TYPES:
            raise ValueError(
                f"Unknown recommendation_type '{v}'. Valid types: {sorted(VALID_RECOMMENDATION_TYPES)}"
            )
        return normalized

    @field_validator("recommendation_name", "recommended_by", "episode")
    @classmethod
    def validate_non_empty(cls, v: str) -> str:
        # Reject blank strings in addition to missing fields
        if not v or not v.strip():
            raise ValueError("Field must not be empty")
        return v.strip()
