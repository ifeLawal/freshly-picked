# After Hours Picks – Roadmap to TestFlight ✅

## Phase 1 – Define Scope & Content

- [x] Clarify MVP
  - [x] Home screen with logo + category cards
  - [x] Category screen: list of recommendations
  - [x] Recommendation detail: metadata + audio link + favorite button
  - [x] Favorites screen: view all favorited picks
- [ ] Define data model
  - [ ] Decide fields for a `Recommendation` (id, title, type, mentionedBy, season, episode, episodeTitle, episodeDate, episodeUrl, audioLink, etc.)
  - [ ] Decide category taxonomy (Books, TV & Movies, Podcasts, Articles, Places, Other)
- [ ] Capture “Our Picks” data
  - [ ] Copy or scrape recommendations from the After Hours “Our Picks” page
  - [ ] Normalize into a table (Sheets / Notion / CSV)
  - [ ] Clean up text for consistent formatting (e.g., “Mentioned by Mihir on Season 7 – Episode 10…”)
  - [ ] Export data as `recommendations.json` for use in the app

---

## Phase 2 – UX / UI & Brand

- [x] Define app personality & style
  - [x] Choose overall tone (classy / academic / podcast-lounge vibe)
  - [x] Pick color palette (primary, secondary, background, accent)
  - [x] Pick typography (heading + body font choices)
- [x] Rough wireframes
  - [x] Home screen: logo, brief intro, category grid/list
  - [x] Category screen: list of recommendations
  - [x] Recommendation detail: full metadata + audio button + favorite toggle
  - [x] Favorites screen: list of favorited recommendations
- [x] Create basic visual design
  - [x] Build wireframes in Figma (or another AI-assisted design tool)
  - [x] Design simple logo / app icon (e.g., with DALL·E or Figma)
  - [x] Export any necessary image assets (logo, background illustration, etc.)

---

## Phase 3 – Project Setup (React Native + Expo)

- [x] Initialize project
  - [x] Create a new Expo app (`npx create-expo-app after-hours-picks`)
  - [x] Set up TypeScript if desired
- [x] Install dependencies
  - [x] React Navigation (stack + bottom tabs)
  - [x] AsyncStorage (for favorites)
  - [x] Expo AV (if you plan any in-app audio later)
- [x] Setup navigation structure
  - [x] Root navigation container
  - [x] Stack navigator for main flows
  - [x] Bottom tab navigator with:
    - [x] Home
    - [x] Favorites

---

## Phase 4 – Data Integration

- [ ] Add static data
  - [ ] Place `recommendations.json` in `src/data/`
  - [ ] Create TypeScript types/interfaces for `Recommendation` and `Category`
- [ ] Data loading logic
  - [ ] Add a function/hook to load categories from `recommendations.json`
  - [ ] Add a function/hook to load recommendations by category
  - [ ] Add a function to get a single recommendation by id

---

## Phase 5 – Core Screens & Components

### 5.1 Home Screen

- [ ] Implement home screen
  - [ ] Display app logo + title + short description
  - [ ] Show categories (cards or list)
  - [ ] On tap of category → navigate to Category screen

### 5.2 Category Screen

- [ ] Implement category screen
  - [ ] Receive category id/name via navigation params
  - [ ] Filter recommendations by category
  - [ ] Render list of recommendations (title + brief metadata)
  - [ ] On tap → navigate to Recommendation Detail

### 5.3 Recommendation Detail Screen

- [ ] Implement detail screen
  - [ ] Show recommendation title
  - [ ] Show formatted metadata text  
        (e.g., “Mentioned by Mihir on Season 7 – Episode 10 ‘Our Predictions for 2024’ on Dec 26, 2023.”)
  - [ ] Show optional link(s) to book/article/video/etc.
  - [ ] Audio section:
    - [ ] Show “Play Segment” or “Open Episode” button
    - [ ] For MVP: Deep link out to the full podcast episode (Apple/Spotify/web)
  - [ ] Favorite button (heart / star icon) to toggle favorite state

### 5.4 Favorites Screen

- [ ] Implement favorites screen
  - [ ] Load favorited recommendations from local store
  - [ ] Display list (similar to category list)
  - [ ] On tap → navigate to Recommendation Detail
  - [ ] Handle empty state (no favorites yet)

---

## Phase 6 – Favorites State & Persistence

- [ ] Setup favorites store
  - [ ] Decide state approach (Context API / Zustand / Redux – simplest is Context + useReducer)
  - [ ] Implement `addFavorite`, `removeFavorite`, `isFavorite` logic
- [ ] Persist with AsyncStorage
  - [ ] Save favorites array (ids) to AsyncStorage on change
  - [ ] Load favorites from AsyncStorage on app startup
- [ ] Wire into UI
  - [ ] Connect favorite button on Recommendation Detail
  - [ ] Use `isFavorite` to render correct button state
  - [ ] Favorites screen reads from global favorites state

---

## Phase 7 – Audio Integration (MVP)

- [ ] Decide on MVP approach
  - [ ] For TestFlight: deep links to podcast episodes (no clipping yet)
- [ ] Map each recommendation to its episode
  - [ ] Add `episodeUrl` (Apple/Spotify/web) to each recommendation
  - [ ] If possible, add `timeHint` (e.g., “around 35:20”) as plain text for now
- [ ] Implement deep linking
  - [ ] Use React Native’s `Linking` to `openURL(episodeUrl)`
  - [ ] Style a clear “Listen in podcast app” button on the detail screen
- [ ] (Optional for later, not required for TestFlight)
  - [ ] Setup pipeline to transcribe episodes & find timestamps
  - [ ] Store `startTimeSeconds` per recommendation for future deep links or clips

---

## Phase 8 – Polish & QA

- [ ] Visual polish
  - [ ] Apply consistent spacing, colors, and typography from your design system
  - [ ] Add loading/empty states where needed
  - [ ] Check light/dark mode behavior (if relevant)
- [ ] Behavior checks
  - [ ] Confirm navigation between all screens works
  - [ ] Confirm favorites persist across app restarts
  - [ ] Confirm all links open correctly (episodes, external links)
  - [ ] Test on at least:
    - [ ] iOS simulator
    - [ ] Physical iPhone (via Expo Go) if possible
- [ ] Basic tests (optional but nice)
  - [ ] Unit tests for favorites reducer/store
  - [ ] Snapshot/render tests for core screens

---

## Phase 9 – Prepare for TestFlight (Expo + Apple)

- [ ] Apple setup
  - [ ] Enroll in Apple Developer Program (if not already)
  - [ ] Create App ID / bundle identifier (e.g., `com.yourname.afterhourspicks`)
  - [ ] Create app record in App Store Connect (name, bundle id, basic info)
- [ ] Expo build setup
  - [ ] Add correct `expo.name`, `slug`, `scheme`, `ios.bundleIdentifier` in `app.json`/`app.config.ts`
  - [ ] Install and log into Expo account (`npx expo login`)
  - [ ] Setup EAS (`npx expo install eas-cli`)
  - [ ] Configure EAS build for iOS (`eas build:configure`)
- [ ] Build for iOS
  - [ ] Run an EAS iOS build (`eas build -p ios`)
  - [ ] Wait for build to complete and appear in App Store Connect
- [ ] App Store Connect configuration
  - [ ] Add basic app metadata (description, category, age rating, etc.)
  - [ ] Upload app icon & screenshots (can be simple, from simulator)
- [ ] TestFlight setup
  - [ ] Create an internal testing group
  - [ ] Add yourself + friends as internal testers
  - [ ] Submit build for TestFlight review (for first-time app)
  - [ ] Once approved, invite testers and verify installation

---

## Phase 10 – Post-TestFlight Feedback Loop

- [ ] Collect feedback
  - [ ] Ask testers about usability and clarity of categories/detail pages
  - [ ] Ask if favorites and audio flow feel intuitive
- [ ] Prioritize v1.1 improvements
  - [ ] Better audio experience (timestamps, partial clips)
  - [ ] Search / filter across all picks
  - [ ] Additional metadata (links to buy/read/watch)
