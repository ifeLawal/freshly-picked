import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  FAVORITES: 'favorites',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  RECENT_SEARCHES: 'recentSearches',
  DARK_MODE: 'darkMode',
} as const;

export const storage = {
  // Favorites
  async getFavorites(): Promise<Set<string>> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
      return new Set();
    } catch (error) {
      console.error('Error loading favorites:', error);
      return new Set();
    }
  },

  async saveFavorites(favorites: Set<string>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(Array.from(favorites)));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },

  // Onboarding
  async getOnboardingCompleted(): Promise<boolean> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return stored === 'true';
    } catch (error) {
      console.error('Error loading onboarding status:', error);
      return false;
    }
  },

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed ? 'true' : 'false');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  },

  // Recent Searches
  async getRecentSearches(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Error loading recent searches:', error);
      return [];
    }
  },

  async saveRecentSearches(searches: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  },

  // Dark mode
  async getDarkMode(): Promise<boolean> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE);
      return stored === 'true';
    } catch (error) {
      console.error('Error loading dark mode:', error);
      return false;
    }
  },

  async setDarkMode(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DARK_MODE, enabled ? 'true' : 'false');
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  },
};

