# Migration Notes: Web to React Native

## Current Web App Structure

### Navigation Flow
The app uses a manual page-based routing system with a discriminated union `Page` type:

1. **Onboarding** - First-time user experience (3 slides)
2. **Main App** (after onboarding):
   - **Dashboard** - Featured recommendations, categories, recently added
   - **Episodes** - List of all episodes
   - **Search** - Search recommendations, episodes, hosts, categories
   - **Favorites** - User's favorited recommendations
   - **Settings** - App settings
3. **Detail Screens** (stack navigation):
   - **Recommendation Detail** - Full recommendation with audio player
   - **Episode Detail** - Episode with its recommendations
   - **Category List** - Recommendations filtered by category

### State Management

#### Favorites
- **Type**: `Set<string>` (recommendation IDs)
- **Storage**: `localStorage.getItem('favorites')` / `localStorage.setItem('favorites', ...)`
- **Serialization**: Array.from(favorites) → JSON.stringify → localStorage
- **Usage**: Toggle favorites from any screen, persisted across sessions

#### Audio Playback
- **State**:
  - `currentlyPlaying: Recommendation | null`
  - `isPlaying: boolean`
  - `currentTime: number` (seconds)
- **Simulation**: Uses `setInterval` to increment `currentTime` every second
- **Controls**: Play/pause, seek, skip forward/backward 10 seconds
- **UI**: Mini player at bottom (above tab bar), full player in recommendation detail

#### Onboarding
- **Storage**: `localStorage.getItem('onboardingCompleted')` → 'true' | null
- **Behavior**: Show onboarding on first launch, skip on subsequent launches

#### Recent Searches (Search screen)
- **Storage**: `localStorage.getItem('recentSearches')` → string[]
- **Limit**: 5 most recent searches

### Data Models

#### Recommendation
```typescript
{
  id: string;
  title: string;
  category: 'Books' | 'Articles' | 'Restaurants' | 'Culture' | 'Tech' | 'Ideas';
  description: string;
  host: string;
  episodeId: string;
  episodeTitle: string;
  season: number;
  episode: number;
  date: string;
  audioUrl: string;
  duration: number; // seconds
  imageUrl?: string;
}
```

#### Episode
```typescript
{
  id: string;
  title: string;
  season: number;
  episode: number;
  date: string;
  description: string;
  recommendationIds: string[];
  thumbnailUrl?: string;
}
```

### Key Components

1. **TabBar** - Bottom navigation (Dashboard, Episodes, Search, Favorites, Settings)
2. **MiniPlayer** - Fixed bottom player (above tab bar), shows current track, progress, play/pause
3. **RecommendationCard** - Card showing recommendation with category badge, favorite button, play button
4. **EpisodeCard** - Card showing episode with season/episode badge, date, recommendation count

### localStorage Usage

1. `favorites` - JSON array of recommendation IDs
2. `onboardingCompleted` - 'true' string
3. `recentSearches` - JSON array of search strings
4. `theme` - 'light' | 'dark' (from ThemeContext)

## React Native Migration Plan

### Navigation Structure
- **Root Stack Navigator**:
  - OnboardingScreen (conditional based on AsyncStorage)
  - MainApp (Tab Navigator)
- **Tab Navigator** (MainApp):
  - DashboardTab
  - EpisodesTab
  - SearchTab
  - FavoritesTab
  - SettingsTab
- **Stack Navigators** (nested in MainApp):
  - RecommendationDetailScreen
  - EpisodeDetailScreen
  - CategoryListScreen

### State Management (React Native)

#### Favorites
- **Storage**: `@react-native-async-storage/async-storage`
- **Key**: `'favorites'`
- **Format**: JSON array → Set<string> in memory

#### Audio Playback
- **Library**: `expo-av`
- **Context**: `AudioPlayerContext` or `useAudioPlayer` hook
- **State**: Same as web (currentlyPlaying, isPlaying, currentTime)

#### Onboarding
- **Storage**: AsyncStorage key `'onboardingCompleted'`
- **Type**: boolean (true/false)

#### Recent Searches
- **Storage**: AsyncStorage key `'recentSearches'`
- **Format**: JSON array of strings

### Component Adaptations

- `div` → `View`
- `span` → `Text`
- `button` → `Pressable` or `TouchableOpacity`
- `input` → `TextInput`
- CSS classes → `StyleSheet.create()` or styled components
- `lucide-react` icons → `@expo/vector-icons` or `react-native-vector-icons`
- `localStorage` → `AsyncStorage`

### File Structure (RN App)
```
after-hours-picks-rn/
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── EpisodesScreen.tsx
│   │   ├── EpisodeDetailScreen.tsx
│   │   ├── CategoryListScreen.tsx
│   │   ├── RecommendationDetailScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   │   ├── RecommendationCard.tsx
│   │   ├── EpisodeCard.tsx
│   │   ├── MiniPlayer.tsx
│   │   └── ui/ (simplified RN components)
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   └── types.ts
│   ├── context/
│   │   ├── AudioPlayerContext.tsx
│   │   └── FavoritesContext.tsx (optional)
│   ├── hooks/
│   │   ├── useAudioPlayer.ts
│   │   └── useAsyncStorage.ts
│   ├── data/
│   │   └── mockData.ts
│   └── utils/
│       └── storage.ts
├── App.tsx
├── app.json
└── package.json
```

