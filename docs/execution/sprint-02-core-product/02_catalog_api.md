# Recommendation Catalog API

## Overview
This step builds the primary API endpoint the mobile client uses to browse recommendations. The goal is a single `GET /api/v1/recommendations` endpoint that supports filtering by host, category, tag, and episode, a keyword/fuzzy search, and batch fetching by IDs — returning a summarized response shape suitable for list rendering on the mobile client.

## Requirements
- `GET /api/v1/recommendations` endpoint created and returning a summary response (not full detail)
- Filtering supported via query params: `host`, `category`, `tag`, `episode`
- Search supported via `search` query param using `ILIKE` pattern matching
- Batch fetch supported via comma-separated `ids` query param
- Response shape validated and consistent for all filter combinations

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §8 Data Model, §9 API Design, §11 Backend Architecture

---

## Purpose
Serve recommendation list with filtering.

## Scope
- GET /recommendations
- Filtering
- Search

## Checklist
- [ ] Create endpoint
- [ ] Add filters (host, category, tag, episode)
- [ ] Add search (ILIKE)
- [ ] Add ids param
- [ ] Return summary response

## Notes