# Current Feature

Deployment

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

- Deploy FastAPI backend to Render and confirm it is publicly accessible
- Configure all environment variables in Render (database URL, S3 credentials, etc.)
- Connect Neon Postgres database and confirm migrations have run in production
- Confirm S3 bucket access works from the deployed backend
- Update mobile app API base URL to point at the Render deployment
- Test end-to-end production flow: ingest data → API returns it → mobile app displays it

## Notes

<!-- Any extra notes -->

- Follow project's simple, low-cost, minimal-ops deployment principles
- Infrastructure: Render (backend), Neon (Postgres), AWS S3 (media)
- Environments: local and production only
- Spec: `docs/execution/sprint-03-discovery-polish/06_deployment.md`

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
- 2026-03-23: Recommendation Catalog API — `GET /api/v1/recommendations` with host/category/tag/episode slug filters, ILIKE keyword search, and comma-separated ids batch fetch; summary response shape with eager-loaded host, episode, and category (`sprint-02/02_catalog_api.md`)
- 2026-03-23: Home Screen — DashboardScreen connected to live API via React Query; ApiRecommendation type introduced; RecommendationCard, MiniPlayer, AudioPlayerContext, and nav types migrated off mock data; CategoriesSection and FeaturedPicksSection extracted as components for future use; backend RecommendationSummary extended with audio_clip_url (`sprint-02/03_home_screen.md`)
- 2026-03-23: Optimize Dashboard Load — backend adds limit/offset pagination (default 50) to GET /api/v1/recommendations; frontend switches to useInfiniteQuery with FlatList and onEndReached; loading screen clears after first page, remaining pages auto-fetch as user scrolls (`sprint-02/04_optimize_dashboard_load.md`)
- 2026-03-25: Home Screen Uplift — added CategoryPicksSection for horizontal-scrolling Books and TV rows; redesigned RecommendationCard with category icon badge, full-height rectangle image, and floating check/star icons at bottom-right; added CompletedContext with AsyncStorage persistence; removed unused CategoriesSection (`sprint-02/03_home_screen_uplift.md`)
