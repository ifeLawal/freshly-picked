# After Hours Picks - React Native App

A React Native mobile app for browsing and listening to recommendations from the After Hours podcast. This app is a mobile port of the web React application.

## Tech Stack

- **Expo** - React Native framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation (Stack & Bottom Tabs)
- **AsyncStorage** - Local data persistence
- **expo-av** - Audio playback (currently simulated for mock data)

## Project Structure

```
after-hours-picks-rn/
├── src/
│   ├── screens/          # Screen components
│   │   ├── OnboardingScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── EpisodesScreen.tsx
│   │   ├── EpisodeDetailScreen.tsx
│   │   ├── CategoryListScreen.tsx
│   │   ├── RecommendationDetailScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/       # Reusable components
│   │   ├── RecommendationCard.tsx
│   │   ├── EpisodeCard.tsx
│   │   └── MiniPlayer.tsx
│   ├── navigation/       # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   └── types.ts
│   ├── context/          # React Context providers
│   │   ├── FavoritesContext.tsx
│   │   └── AudioPlayerContext.tsx
│   ├── data/            # Mock data and types
│   │   └── mockData.ts
│   └── utils/           # Utility functions
│       └── storage.ts
├── App.tsx              # Root component
└── package.json
```

## Navigation Structure

### Root Stack Navigator
- **Onboarding** - First-time user experience (conditional)
- **MainApp** - Main application (Tab Navigator)

### Main Tab Navigator
- **Dashboard** - Featured recommendations and categories
- **Episodes** - List of all episodes
- **Search** - Search recommendations, episodes, hosts
- **Favorites** - User's saved recommendations
- **Settings** - App settings

### Stack Navigators (nested in tabs)
- **RecommendationDetail** - Full recommendation with audio player
- **EpisodeDetail** - Episode with its recommendations
- **CategoryList** - Recommendations filtered by category

## State Management

### Favorites
- Stored in `FavoritesContext`
- Persisted to AsyncStorage
- Accessible via `useFavorites()` hook

### Audio Playback
- Managed in `AudioPlayerContext`
- Currently simulates playback for mock data
- Accessible via `useAudioPlayer()` hook
- **Note**: Real audio playback requires actual audio URLs. The current implementation simulates playback for development.

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator / Expo Go app

### Installation

1. Navigate to the project directory:
```bash
cd after-hours-picks-rn
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your device:
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## Features

- ✅ Onboarding flow
- ✅ Browse recommendations by category
- ✅ View episode details and recommendations
- ✅ Search across recommendations, episodes, and hosts
- ✅ Save favorites (persisted locally)
- ✅ Audio player UI (simulated for mock data)
- ✅ Mini player that persists across screens
- ✅ Bottom tab navigation

## Audio Playback

The app currently simulates audio playback for mock data. To enable real audio playback:

1. Update `AudioPlayerContext.tsx` to load actual audio URLs
2. Ensure audio files are accessible (hosted or bundled)
3. Update the `playRecommendation` function to use real audio sources

Example:
```typescript
const { sound } = await Audio.Sound.createAsync(
  { uri: recommendation.audioUrl },
  { shouldPlay: true }
);
```

## Data Models

### Recommendation
- `id`, `title`, `category`, `description`
- `host`, `episodeId`, `episodeTitle`
- `season`, `episode`, `date`
- `audioUrl`, `duration`, `imageUrl?`

### Episode
- `id`, `title`, `season`, `episode`
- `date`, `description`
- `recommendationIds[]`, `thumbnailUrl?`

## Persistence

The app uses AsyncStorage to persist:
- **Favorites** - Array of recommendation IDs
- **Onboarding completion** - Boolean flag
- **Recent searches** - Array of search strings

## Future Enhancements

- Real audio playback integration
- API integration to replace mock data
- Push notifications for new recommendations
- Offline mode with cached content
- User accounts and cloud sync
- Dark mode theme support

## Development Notes

- The app uses React Native primitives (`View`, `Text`, `Pressable`, etc.)
- Styling uses `StyleSheet.create()` for performance
- Navigation is type-safe with TypeScript
- All screens are functional components with hooks

## License

This project is part of the After Hours Picks application suite.

