# UI Polish

## Overview
This step improves the overall quality and resilience of the mobile UI before deployment. The goal is consistent loading indicators, empty states, and error/retry handling across all screens, plus fallback image handling for recommendations without an image and general spacing and layout improvements. No new features — this step makes what's already built feel complete.

## Requirements
- Loading indicators added to all screens that fetch data (Home, Episodes, Search, Lists, Detail)
- Empty states present on all screens that can return zero results
- Retry UI in place on screens where a fetch can fail, allowing users to re-trigger the request
- Fallback image rendered when a recommendation's `image_url` is null or fails to load
- Spacing and layout reviewed and consistent across screens

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §4 Core Features, §7 Functional Requirements, §10 Mobile Architecture, §14 Non-Functional Requirements

---

## Purpose
Improve UX quality and completeness.

## Scope
- Loading states
- Empty states
- Error handling

## Checklist
- [ ] Add loading indicators
- [ ] Add empty states
- [ ] Add retry UI
- [ ] Add fallback image handling
- [ ] Improve spacing and layout

## Notes