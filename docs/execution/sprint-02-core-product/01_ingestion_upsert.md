# Ingestion Upsert Logic

## Overview
This step wires the CLI base into the database, implementing the upsert logic that creates or updates recommendations based on `external_source_id`. The goal is a reliable import process that resolves related entities (host, category, episode), creates missing tags, handles duplicates gracefully, and prints a summary of what was created or updated including media uploads to S3 and linking that upload link to the database.

## Requirements
- Upsert each recommendation record using `external_source_id` as the unique key
- Resolve `host`, `category`, and `episode` by name or ID before writing the recommendation
- Create any tags that don't yet exist; link all tags to the recommendation via `RecommendationTag`
- Handle duplicate records without error — update in place if already exists
- Print a summary after import: records created, updated, and skipped

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §8 Data Model, §11 Backend Architecture, §12 Ingestion Workflow
- @context/audio
- @context/images
- @context/data/harvard_after_hours_picks.json

---

## Purpose
Enable creation and updating of recommendations.

## Scope
- Upsert via external_source_id
- Entity resolution

## Checklist
- [ ] Implement upsert logic
- [ ] Resolve host/category/episode
- [ ] Create missing tags
- [ ] Handle duplicates
- [ ] Add summary output

## Notes