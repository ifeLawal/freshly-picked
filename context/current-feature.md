# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-03-19: Backend setup — FastAPI project with layered structure, pyproject.toml, config module, and `/health` endpoint (`sprint-01/01_backend_setup.md`)
- 2026-03-19: Database setup — Neon Postgres connected, SQLModel engine, Alembic initialized with async env.py, first migration confirmed (`sprint-01/02_database_setup.md`)
- 2026-03-19: Data models — all 6 SQLModel entities defined with relationships, timestamps, slug/external_source_id fields, migration confirmed against Neon (`sprint-01/03_data_models.md`)
- 2026-03-19: S3 setup done — AWS bucket, credentials, upload helper for images and audio (`sprint-01/04_s3_setup.md`)
- 2026-03-20: Mobile Setup done — Create the react native application and screens (`05_mobile_setup.md`)
- 2026-03-21: Ingestion CLI base done — CLI entry point, JSON loading, validation, dry-run flag (`sprint-01/06_ingestion_cli_base.md`)
- 2026-03-22: Ingestion upsert complete — DB writes, media upload to S3, import summary, idempotent upsert via external_source_id; tag creation and linking not implemented (source JSON has no tag data) (`sprint-02/01_ingestion_upsert.md`)
