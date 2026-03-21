# Recommendation Detail Screen

## Overview
This step builds the detail screen that users navigate to from a recommendation card. The goal is a screen that fetches and renders the full recommendation — metadata, image, external link, and audio playback if an audio clip is available. This is the deepest view into a single recommendation in the MVP.

## Requirements
- Detail screen created and reachable via navigation from a recommendation card
- Fetches full recommendation data from `GET /api/v1/recommendations/{id}` using React Query
- Renders all metadata: title, `why_recommended`, host, episode, category, tags
- Displays image if `image_url` is present
- External link rendered and opens in browser
- Audio playback implemented via Expo AV when `audio_clip_url` is present

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §4 Core Features, §6 System Architecture, §7 Functional Requirements, §10 Mobile Architecture

---

## Purpose
Display full recommendation info.

## Scope
- Detail UI
- Audio playback

## Checklist
- [ ] Create screen
- [ ] Fetch detail data
- [ ] Render metadata
- [ ] Add external link
- [ ] Add image display
- [ ] Add audio playback

## Notes