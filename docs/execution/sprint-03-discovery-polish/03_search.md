# Search Feature

## Overview
This step builds the Search tab, giving users a way to find recommendations by keyword. The goal is a search input that queries the existing catalog API and renders matching results — reusing the same endpoint and card components already in place. No new backend work is required; this is purely a mobile UI step.

## Requirements
- Search screen created and registered in the tab navigator
- Search input field renders and accepts user text
- Input value passed to `GET /api/v1/recommendations?search=` via React Query on change or submit
- Results rendered as recommendation cards, consistent with the Home screen
- Empty state displayed when the query returns no results

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §4 Core Features, §7 Functional Requirements, §9 API Design, §10 Mobile Architecture

---

## Purpose
Enable keyword and fuzzy search.

## Scope
- Search tab
- API integration

## Checklist
- [ ] Create Search screen
- [ ] Add search input
- [ ] Connect to API
- [ ] Render results
- [ ] Handle empty state

## Notes