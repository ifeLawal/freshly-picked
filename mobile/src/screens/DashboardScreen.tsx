import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../navigation/types';
import { ApiRecommendation } from '../models/recommendation';
import { RecommendationCard } from '../components/RecommendationCard';
import { useFavorites } from '../context/FavoritesContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useTheme } from '../context/ThemeContext';
import { useRecommendations } from '../hooks/useRecommendations';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { isDarkMode } = useTheme();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { playRecommendation } = useAudioPlayer();
  const { data: recommendations, isLoading, isError } = useRecommendations();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const searchIconColor = isDarkMode ? '#888' : '#999';
  const placeholderColor = isDarkMode ? '#888' : '#999';

  const handleRecommendationClick = (recommendation: ApiRecommendation) => {
    navigation.navigate('RecommendationDetail', { recommendation });
  };

  return (
    <ScrollView style={[styles.container, themeStyles.container]} contentContainerStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={[styles.title, themeStyles.title]}>Freshly Picked</Text>

        <Pressable
          style={[styles.searchButton, themeStyles.searchButton]}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={20} color={searchIconColor} style={styles.searchIcon} />
          <Text style={[styles.searchPlaceholder, { color: placeholderColor }]}>Search recommendations...</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>All Picks</Text>

        {isLoading && (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#4689F3" />
          </View>
        )}

        {isError && (
          <View style={styles.centeredState}>
            <Text style={[styles.stateText, themeStyles.stateText]}>Failed to load recommendations.</Text>
          </View>
        )}

        {!isLoading && !isError && recommendations?.length === 0 && (
          <View style={styles.centeredState}>
            <Text style={[styles.stateText, themeStyles.stateText]}>No picks yet.</Text>
          </View>
        )}

        {!isLoading && !isError && recommendations && recommendations.length > 0 && (
          <View style={styles.cardsContainer}>
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                isFavorited={isFavorited(String(rec.id))}
                onToggleFavorite={toggleFavorite}
                onPlay={playRecommendation}
                onClick={handleRecommendationClick}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#999',
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  cardsContainer: {
    paddingHorizontal: 24,
  },
  centeredState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  stateText: {
    fontSize: 16,
    color: '#999',
  },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  title: { color: '#e5e5e5' },
  searchButton: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  sectionTitle: { color: '#e5e5e5' },
  stateText: { color: '#666' },
});
