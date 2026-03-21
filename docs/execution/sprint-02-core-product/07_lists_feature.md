# Lists Feature

## Overview
This step builds the Lists tab UI that surfaces a user's saved and custom-organized recommendations. The goal is a screen that displays the Favorites list, the Completed list, and any custom lists the user has created — with the ability to create new lists, remove items, and hydrate full recommendation data from the catalog API using the `ids` batch endpoint. This step depends on local storage being in place.

## Requirements
- Lists screen created and registered in the tab navigator
- Favorites list rendered from locally stored favorite IDs
- Completed list rendered from locally stored completed IDs
- Custom list creation supported (name input + empty list initialized in storage)
- Remove-from-list action implemented for all list types
- Full recommendation data hydrated by passing stored IDs to `GET /api/v1/recommendations?ids=`

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §4 Core Features, §7 Functional Requirements, §9 API Design, §10 Mobile Architecture

---

## Purpose
Allow users to organize recommendations.

## Scope
- Lists tab
- Custom lists

## Checklist
- [ ] Build Lists screen
- [ ] Show favorites list
- [ ] Show completed list
- [ ] Add custom list creation
- [ ] Add remove-from-list logic
- [ ] Hydrate using ids endpoint

## Notes