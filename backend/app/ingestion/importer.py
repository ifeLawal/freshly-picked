"""Ingestion upsert — writes validated PickRecord items to the database.

Upsert key: external_source_id
  Each record's external_source_id is derived from a SHA-256 hash of:

      "{recommendation_name}:{recommended_by}:{episode}"  (all lowercased, stripped)

  This makes ingestion idempotent — re-running the same JSON updates existing
  rows rather than inserting duplicates.

  Operator note: if source data corrects a typo in name, host, or episode label,
  the derived ID changes and a new row is created. The orphaned row must be
  deleted manually before re-importing. Prefer fixing source data before the
  first production import to avoid this.
"""

import asyncio
import hashlib
import re
from dataclasses import dataclass, field
from datetime import date, datetime
from pathlib import Path
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import AsyncSessionLocal
from app.ingestion.schemas import PickRecord
from app.models.category import Category
from app.models.episode import Episode
from app.models.host import Host
from app.models.recommendation import Recommendation
from app.storage.s3 import build_public_url, key_exists, upload_audio, upload_image


@dataclass
class ImportSummary:
    created: int = 0
    updated: int = 0
    skipped: int = 0  # invalid records that failed validation and were not imported
    errors: list[dict] = field(default_factory=list)


def build_external_source_id(record: PickRecord) -> str:
    # First 16 hex chars of SHA-256 over name:host:episode — 64 bits, collision-safe across ~500 records
    # Changing any of the three fields produces a different ID, creating a new row instead of updating
    key = ":".join([
        record.recommendation_name.strip().lower(),
        record.recommended_by.strip().lower(),
        record.episode.strip().lower(),
    ])
    return hashlib.sha256(key.encode()).hexdigest()[:16]


def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")


def _parse_episode(episode_str: str) -> tuple[int, int]:
    # Expects "Season 7, Episode 10" format from the source JSON
    match = re.match(r"Season\s+(\d+),?\s+Episode\s+(\d+)", episode_str, re.IGNORECASE)
    if not match:
        raise ValueError(f"Cannot parse episode string: {episode_str!r}")
    return int(match.group(1)), int(match.group(2))


def _parse_air_date(date_str: Optional[str]) -> Optional[date]:
    # Expects "Dec 26, 2023" format — returns None if absent or unparseable
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str.strip(), "%b %d, %Y").date()
    except ValueError:
        return None


async def _get_or_create_host(session: AsyncSession, name: str) -> Host:
    slug = _slugify(name)
    row = (await session.execute(select(Host).where(Host.slug == slug))).scalar_one_or_none()
    if not row:
        row = Host(name=name.strip(), slug=slug)
        session.add(row)
        await session.flush()  # flush to get the id before linking to recommendations
    return row


async def _get_or_create_episode(
    session: AsyncSession,
    episode_str: str,
    episode_title: Optional[str],
    episode_date: Optional[str],
) -> Episode:
    season, ep_num = _parse_episode(episode_str)
    slug = f"season-{season}-episode-{ep_num}"  # stable slug regardless of title wording
    row = (await session.execute(select(Episode).where(Episode.slug == slug))).scalar_one_or_none()
    if not row:
        row = Episode(
            title=(episode_title or episode_str).strip(),
            slug=slug,
            season=season,
            episode_number=ep_num,
            air_date=_parse_air_date(episode_date),
        )
        session.add(row)
        await session.flush()
    return row


async def _get_or_create_category(session: AsyncSession, recommendation_type: str) -> Category:
    slug = _slugify(recommendation_type)
    row = (await session.execute(select(Category).where(Category.slug == slug))).scalar_one_or_none()
    if not row:
        display = recommendation_type.replace("-", " ").title()
        row = Category(name=display, slug=slug)
        session.add(row)
        await session.flush()
    return row


def _upload_media(
    record: PickRecord,
    slug: str,
    media_dir: Optional[Path],
    include_media: bool,
    force_media: bool = False,
) -> tuple[Optional[str], Optional[str]]:
    # Skip entirely if media uploads are disabled or no media dir was provided
    if not include_media or not media_dir:
        return None, None

    image_url: Optional[str] = None  # will be set if an image is successfully uploaded or already exists in S3
    audio_url: Optional[str] = None  # will be set if an audio file is successfully uploaded

    if record.image_file:  # only attempt upload if the record references an image file
        # Resolve from {media_dir}/images/ — JSON stores filename only, not a path
        local = media_dir / "images" / record.image_file  # full local path to the image file
        ext = Path(record.image_file).suffix  # preserve original extension (e.g. .jpg, .png) for the S3 key
        image_s3_key = f"images/{slug}{ext}"  # S3 key: images/<slug>.<ext>
        try:
            if not force_media and key_exists(image_s3_key):
                # File already in S3 — return the existing URL without re-uploading
                image_url = build_public_url(image_s3_key)
                print(f"  Skipped image upload for {slug!r}: already exists in S3")
            else:
                image_url = upload_image(str(local), image_s3_key)
        except (FileNotFoundError, RuntimeError) as e:
            # Warn but don't abort — a missing media file shouldn't fail the whole import
            print(f"  Warning: image upload skipped for {slug!r}: {e}")

    if record.audio_file:  # only attempt upload if the record references an audio file
        # Resolve from {media_dir}/audio/ — JSON stores filename only, not a path
        local = media_dir / "audio" / record.audio_file  # full local path to the audio file
        ext = Path(record.audio_file).suffix  # preserve original extension (e.g. .mp3, .m4a) for the S3 key
        audio_s3_key = f"audio/{slug}{ext}"  # S3 key: audio/<slug>.<ext>
        try:
            if not force_media and key_exists(audio_s3_key):
                # File already in S3 — return the existing URL without re-uploading
                audio_url = build_public_url(audio_s3_key)
                print(f"  Skipped audio upload for {slug!r}: already exists in S3")
            else:
                audio_url = upload_audio(str(local), audio_s3_key)
        except (FileNotFoundError, RuntimeError) as e:
            print(f"  Warning: audio upload skipped for {slug!r}: {e}")  # warn but continue — audio is optional

    return image_url, audio_url  # return URLs (or None) to be stored on the recommendation record


async def _upsert_one(
    session: AsyncSession,
    record: PickRecord,
    dry_run: bool,
    media_dir: Optional[Path],
    include_media: bool,
    force_media: bool,
) -> str:
    ext_id = build_external_source_id(record)

    # Resolve or create supporting entities before touching the recommendation
    host = await _get_or_create_host(session, record.recommended_by)
    episode = await _get_or_create_episode(
        session, record.episode, record.episode_title, record.episode_date
    )
    category = await _get_or_create_category(session, record.recommendation_type)

    existing = (
        await session.execute(
            select(Recommendation).where(Recommendation.external_source_id == ext_id)
        )
    ).scalar_one_or_none()

    if existing:
        # Update all mutable fields — slug and external_source_id are never changed on update
        existing.title = record.recommendation_name
        existing.external_url = record.recommendation_link
        existing.why_recommended = record.raw_pick_content
        existing.host_id = host.id
        existing.episode_id = episode.id
        existing.category_id = category.id
        existing.audio_start_seconds = record.audio_start_seconds
        existing.audio_end_seconds = record.audio_end_seconds

        if not dry_run:
            image_url, audio_url = _upload_media(record, existing.slug, media_dir, include_media, force_media)
            if image_url:
                existing.image_url = image_url
            if audio_url:
                existing.audio_clip_url = audio_url

        return "updated"

    # Slug: readable prefix (capped at 60 chars) + first 8 chars of the ID for uniqueness
    rec_slug = f"{_slugify(record.recommendation_name)[:60]}-{ext_id[:8]}"
    image_url, audio_url = None, None
    if not dry_run:
        image_url, audio_url = _upload_media(record, rec_slug, media_dir, include_media, force_media)

    rec = Recommendation(
        slug=rec_slug,
        external_source_id=ext_id,
        title=record.recommendation_name,
        external_url=record.recommendation_link,
        why_recommended=record.raw_pick_content,
        host_id=host.id,
        episode_id=episode.id,
        category_id=category.id,
        image_url=image_url,
        audio_clip_url=audio_url,
        audio_start_seconds=record.audio_start_seconds,
        audio_end_seconds=record.audio_end_seconds,
    )
    session.add(rec)
    return "created"


async def _run(
    records: list[PickRecord],
    dry_run: bool,
    media_dir: Optional[Path],
    include_media: bool,
    force_media: bool,
) -> ImportSummary:
    summary = ImportSummary()

    async with AsyncSessionLocal() as session:
        for record in records:
            try:
                action = await _upsert_one(session, record, dry_run, media_dir, include_media, force_media)
                if action == "created":
                    summary.created += 1
                else:
                    summary.updated += 1
            except Exception as e:
                # Collect errors per-record so one bad record doesn't abort the whole batch
                summary.errors.append({"record": record.recommendation_name, "error": str(e)})

        # Roll back the entire session in dry-run — no writes should reach the DB
        if dry_run:
            await session.rollback()
        else:
            await session.commit()

    return summary


def run_import(
    records: list[PickRecord],
    dry_run: bool = False,
    media_dir: Optional[Path] = None,
    include_media: bool = False,
    force_media: bool = False,
) -> ImportSummary:
    # asyncio.run drives the async session from the synchronous CLI entry point
    return asyncio.run(_run(records, dry_run, media_dir, include_media, force_media))
