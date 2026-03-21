# Recommendation Detail API

## Overview
This step adds the endpoint that returns the full detail of a single recommendation by ID. The goal is a `GET /api/v1/recommendations/{id}` endpoint that returns all metadata fields including optional media URLs — giving the mobile detail screen everything it needs in one response.

## Requirements
- `GET /api/v1/recommendations/{id}` endpoint created
- Returns full recommendation metadata: title, `why_recommended`, `external_url`, host, episode, category, tags
- Includes optional media fields: `image_url`, `audio_clip_url`, `audio_start_seconds`, `audio_end_seconds`
- Response shape validated — consistent structure whether media fields are present or null

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §8 Data Model, §9 API Design, §11 Backend Architecture

---

## Purpose
Serve full recommendation details.

## Scope
- GET /recommendations/{id}

## Checklist
- [ ] Create endpoint
- [ ] Return full metadata
- [ ] Include media URLs
- [ ] Validate response shape

## Notes