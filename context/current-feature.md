# Current Feature

## Status

<!-- Not Started|In Progress|Completed -->

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes | branch name sprint-#/<file-name> -->

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
- 2026-03-26: Deployment — FastAPI deployed to Render with render.yaml; Python pinned to 3.12 via .python-version; alembic migrations run on startup; mobile API URL driven by EXPO_PUBLIC_API_URL env var with localhost fallback; EAS preview and production builds configured with Render URL (`sprint-03/06_deployment.md`)
- 2026-03-29: Update AWS Files — added `--force-media` flag to re-upload image/audio to S3 even when key already exists; fixed audio block reusing image s3_key variable; `force_media` threaded through all ingestion layers (`sprint-02/ingestion_upsert_update`)
- 2026-03-29: Recommendation Detail API — `GET /api/v1/recommendations/{id}` with full metadata including `why_recommended`, `external_url`, tags, and all media fields; `RecommendationDetail` schema added; `get_recommendation_by_id` repository function with eager-loaded host, episode, category, and tags; returns 404 if not found (`sprint-02/04_recommendation_detail_api`)
- 2026-03-29: Fix file upload — skip image upload for placeholder flat filenames (no `/` in path); only directory-prefixed image_file paths are uploaded to S3; added `--slugs` flag for targeted record re-uploads; deferred host/episode/category DB queries until after slug filter to avoid unnecessary work (`sprint-02/ingestion_refinement`)
- 2026-03-30: Recommendation Detail Screen — `RecommendationDetailScreen` fetches full detail via `useQuery` from `GET /api/v1/recommendations/{id}`; renders `why_recommended`, tags pills, standalone image, external link via `Linking.openURL`, and audio player; `ApiRecommendationDetail` type and `fetchRecommendationDetail` service added (`sprint-02/05_recommendation_detail_screen`)
- 2026-03-30: Swagger / OpenAPI Docs — conditional `/docs`, `/redoc`, `/openapi.json` enabled only when `ENV=local`; all routers tagged; both recommendation endpoints and health endpoint annotated with `summary`, `description`, `response_model`, `Query()`, and `Path()` descriptions (`sprint-02/05_api_swagger`)
- 2026-03-31: Episodes API — `GET /api/v1/episodes` returns all episodes with recommendation count via aggregate query; `GET /api/v1/episodes/{id}/recommendations` returns linked recommendations with 404 on unknown episode; `EpisodeWithCount` schema, episode repository, and episodes router added (`sprint-03/01_episodes_api`)
