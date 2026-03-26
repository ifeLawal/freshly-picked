# Episodes UI

## Overview
This step builds the Episodes tab, giving users a way to browse recommendations organized by episode. The goal is an Episodes list screen and an Episode detail screen — the list shows all episodes, and tapping one fetches and renders the recommendations associated with it. This step depends on the Episodes API endpoints being in place.

## Requirements
- Episodes screen created and registered in the tab navigator, fetching from `GET /api/v1/episodes` via React Query
- Each episode rendered with its title and recommendation count
- Episode detail screen created and reachable by tapping an episode
- Detail screen fetches recommendations from `GET /api/v1/episodes/{id}/recommendations` and renders them as cards

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §4 Core Features, §7 Functional Requirements, §10 Mobile Architecture

---

## Purpose
Enable browsing by episode.

## Scope
- Episodes tab
- Episode detail

## Checklist
- [ ] Build Episodes screen
- [ ] Build Episode detail screen
- [ ] Fetch recommendations per episode

## Notes