import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from './types';
import { DashboardScreen } from '../screens/DashboardScreen';
import { EpisodesScreen } from '../screens/EpisodesScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RecommendationDetailScreen } from '../screens/RecommendationDetailScreen';
import { EpisodeDetailScreen } from '../screens/EpisodeDetailScreen';
import { CategoryListScreen } from '../screens/CategoryListScreen';
import { MiniPlayer } from '../components/MiniPlayer';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useRecommendationDetailScreen } from '../context/RecommendationDetailScreenContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<MainStackParamList>();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="RecommendationDetail" component={RecommendationDetailScreen} />
      <Stack.Screen name="CategoryList" component={CategoryListScreen} />
    </Stack.Navigator>
  );
}

function EpisodesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Episodes" component={EpisodesScreen} />
      <Stack.Screen name="EpisodeDetail" component={EpisodeDetailScreen} />
      <Stack.Screen name="RecommendationDetail" component={RecommendationDetailScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="RecommendationDetail" component={RecommendationDetailScreen} />
      <Stack.Screen name="EpisodeDetail" component={EpisodeDetailScreen} />
      <Stack.Screen name="CategoryList" component={CategoryListScreen} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="RecommendationDetail" component={RecommendationDetailScreen} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

const TAB_BAR_BASE_HEIGHT = 56;

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { currentlyPlaying, isPlaying, currentTime, playPause, seek } = useAudioPlayer();
  const navigation = useNavigation<any>();

  const { isOnRecommendationDetailScreen } = useRecommendationDetailScreen();
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + insets.bottom;

  const handleMiniPlayerTap = () => {
    if (currentlyPlaying) {
      navigation.navigate('DashboardTab', {
        screen: 'RecommendationDetail',
        params: { recommendation: currentlyPlaying },
      });
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#4689F3',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            height: tabBarHeight,
            paddingTop: 8,
            paddingBottom: 8 + insets.bottom,
          },
        }}
      >
        <Tab.Screen
          name="DashboardTab"
          component={DashboardStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="EpisodesTab"
          component={EpisodesStack}
          options={{
            tabBarLabel: 'Episodes',
            tabBarIcon: ({ color, size }) => <Ionicons name="play" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStack}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesStack}
          options={{
            tabBarLabel: 'Favorites',
            tabBarIcon: ({ color, size }) => <Ionicons name="star" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsStack}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
      {currentlyPlaying && !isOnRecommendationDetailScreen && (
        <MiniPlayer
          recommendation={currentlyPlaying}
          isPlaying={isPlaying}
          currentTime={currentTime}
          onPlayPause={playPause}
          onSeek={seek}
          onTap={handleMiniPlayerTap}
          bottomOffset={tabBarHeight}
        />
      )}
    </>
  );
}

