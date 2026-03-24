# Current Feature: Recommendation Catalog API

## Status

In Progress

## Goals

- Create `GET /api/v1/recommendations` endpoint returning a summary response shape
- Support filtering via query params: `host`, `category`, `tag`, `episode`
- Support keyword/fuzzy search via `search` query param using `ILIKE` pattern matching
- Support batch fetching via comma-separated `ids` query param
- Response shape validated and consistent across all filter combinations

## Notes

- Response should be a summary shape (not full detail) — suitable for list rendering on mobile
- Ref: §8 Data Model, §9 API Design, §11 Backend Architecture in the project overview

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-03-19: Backend setup — FastAPI project with layered structure, pyproject.toml, config module, and `/health` endpoint (`sprint-01/01_backend_setup.md`)
- 2026-03-19: Database setup — Neon Postgres connected, SQLModel engine, Alembic initialized with async env.py, first migration confirmed (`sprint-01/02_database_setup.md`)
- 2026-03-19: Data models — all 6 SQLModel entities defined with relationships, timestamps, slug/external_source_id fields, migration confirmed against Neon (`sprint-01/03_data_models.md`)
- 2026-03-19: S3 setup done — AWS bucket, credentials, upload helper for images and audio (`sprint-01/04_s3_setup.md`)
- 2026-03-20: Mobile Setup done — Create the react native application and screens (`05_mobile_setup.md`)
- 2026-03-21: Ingestion CLI base done — CLI entry point, JSON loading, validation, dry-run flag (`sprint-01/06_ingestion_cli_base.md`)
- 2026-03-22: Ingestion upsert complete — DB writes, media upload to S3, import summary, idempotent upsert via external_source_id; tag creation and linking not implemented (source JSON has no tag data) (`sprint-02/01_ingestion_upsert.md`)
- 2026-03-23: Ingestion logic refinement — added `--include-media` flag to opt-in to audio/image uploads (skipped by default); image uploads check S3 via head_object and skip re-uploading if key already exists (`sprint-02/ingestion-upsert-update`)
- 2026-03-23: Link JSON image and audio file for S3 — added `audio_start_seconds` and `audio_end_seconds` keys (null) to all 437 JSON records; `PickRecord` and importer already handled `image_file`/`audio_file` upload and URL linking (`02-sprint/ingestion-upsert-update`)
