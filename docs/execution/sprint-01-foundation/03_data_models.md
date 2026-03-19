# Data Models

## Overview
This step defines all core SQLModel entities for the recommendation system. The models created here are the schema foundation that migrations, repositories, and the API layer will all build on. The goal is fully defined models with correct relationships, timestamps, and the key fields (`slug`, `external_source_id`) needed for ingestion and lookup.

## Requirements
- SQLModel models defined for all 6 entities: `Recommendation`, `Host`, `Episode`, `Category`, `Tag`, `RecommendationTag`
- Relationships wired between models (e.g. Recommendation → Host, Episode, Category, Tags)
- `created_at` / `updated_at` timestamps on relevant models
- `external_source_id` present on `Recommendation` for upsert support during ingestion
- `slug` fields present where needed
- Alembic migration generated from models and confirmed to run successfully

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §8 Data Model, §11 Backend Architecture, §12 Ingestion Workflow
- @context/data/harvard_after_hours_picks.json
- @context/data/mockData.ts

---

## Purpose
Define core entities for recommendations system.

## Scope
- Recommendation
- Host
- Episode
- Category
- Tag
- RecommendationTag

## Checklist
- [ ] Define SQLModel models
- [ ] Add relationships
- [ ] Add timestamps
- [ ] Add external_source_id
- [ ] Add slug fields
- [ ] Run migration

## Notes