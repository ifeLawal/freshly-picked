# Settings Screen

## Overview
This step builds the Settings tab, providing minimal but useful app configuration. The goal is a simple screen that displays the current app version and gives users the ability to reset all locally stored data — clearing favorites, completed, and custom lists from AsyncStorage. No backend interaction; this is a local-only screen.

## Requirements
- Settings screen created and registered in the tab navigator
- App version displayed, sourced from the Expo app config
- Reset local data option implemented, clearing all AsyncStorage keys used for favorites, completed, and custom lists
- Reset action confirmed before executing (e.g. prompt or confirmation step)

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §7 Functional Requirements, §10 Mobile Architecture

---

## Purpose
Provide basic app configuration.

## Scope
- Version display
- Reset option

## Checklist
- [ ] Create Settings screen
- [ ] Show app version
- [ ] Add reset local data option

## Notes