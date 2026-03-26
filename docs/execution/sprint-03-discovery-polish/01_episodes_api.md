# Episodes API

## Overview
This step adds the episode-related endpoints that allow the mobile client to browse episodes and fetch the recommendations associated with each one. The goal is two endpoints — a list of all episodes and a per-episode recommendations fetch — with recommendation counts included so the UI can display them without a second request.

## Requirements
- `GET /api/v1/episodes` endpoint created, returning all episodes with a recommendation count per episode
- `GET /api/v1/episodes/{id}/recommendations` endpoint created, returning all recommendations linked to that episode
- Recommendation linkage resolved via the existing `episode_id` relationship on the `Recommendation` model
- Response shapes validated and consistent

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §8 Data Model, §9 API Design, §11 Backend Architecture

---

## Purpose
Expose episode data and related recommendations.

## Scope
- GET /episodes
- GET /episodes/{id}/recommendations

## Checklist
- [ ] Create episodes endpoint
- [ ] Add recommendation linkage
- [ ] Return counts

## Notes