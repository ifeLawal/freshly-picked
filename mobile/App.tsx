import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer, DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { AudioPlayerProvider } from './src/context/AudioPlayerContext';
import { RecommendationDetailScreenProvider } from './src/context/RecommendationDetailScreenContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const AppLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4689F3',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#1a1a1a',
    border: '#e5e5e5',
  },
};

const AppDarkTheme = {
  ...NavDarkTheme,
  dark: true,
  colors: {
    ...NavDarkTheme.colors,
    primary: '#4689F3',
    background: '#121212',
    card: '#1e1e1e',
    text: '#e5e5e5',
    border: '#333',
  },
};

function AppContent() {
  const { isDarkMode } = useTheme();
  return (
    <>
      <NavigationContainer theme={isDarkMode ? AppDarkTheme : AppLightTheme}>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <FavoritesProvider>
            <AudioPlayerProvider>
              <RecommendationDetailScreenProvider>
                <AppContent />
              </RecommendationDetailScreenProvider>
            </AudioPlayerProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
