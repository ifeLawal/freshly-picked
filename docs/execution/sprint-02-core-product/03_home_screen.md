# Home Screen

## Overview
This step builds the first visible screen of the mobile app — a scrollable list of recommendations fetched from the catalog API. The goal is a functional Home screen that fetches data via React Query, renders recommendation cards, and handles loading and empty states cleanly. No filtering or search UI yet — just a working, data-connected list.

## Requirements
- Home screen created and registered in the tab navigator - CHECK STATUS
- Recommendations fetched from `GET /api/v1/recommendations` using React Query
- Each recommendation rendered as a card showing summary info (title, host, category) - UPDATE TO USE BACKEND CALL
- Loading state displayed while fetch is in progress
- Empty state displayed when no recommendations are returned - CHECK STATUS

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §4 Core Features, §7 Functional Requirements, §10 Mobile Architecture

---

## Purpose
Display recommendation catalog.

## Scope
- Fetch recommendations
- Render list

## Checklist
- [ ] Create Home screen
- [ ] Fetch via React Query
- [ ] Render recommendation cards
- [ ] Add loading state
- [ ] Add empty state

## Notes