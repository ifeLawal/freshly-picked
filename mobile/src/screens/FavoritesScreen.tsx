import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../navigation/types';
import { recommendations } from '../data/mockData';
import { RecommendationCard } from '../components/RecommendationCard';
import { useFavorites } from '../context/FavoritesContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useTheme } from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const { isDarkMode } = useTheme();
  const { favorites, toggleFavorite, isFavorited } = useFavorites();
  const { playRecommendation } = useAudioPlayer();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const emptyIconColor = isDarkMode ? '#666' : '#999';

  const favoritedRecommendations = recommendations.filter((rec) => favorites.has(rec.id));

  const categories = ['All', ...Array.from(new Set(favoritedRecommendations.map((rec) => rec.category)))];

  const filteredRecommendations = selectedCategory && selectedCategory !== 'All'
    ? favoritedRecommendations.filter((rec) => rec.category === selectedCategory)
    : favoritedRecommendations;

  const handleRecommendationClick = (rec: typeof recommendations[0]) => {
    navigation.navigate('RecommendationDetail', { recommendation: rec });
  };

  return (
    <ScrollView style={[styles.container, themeStyles.container]} contentContainerStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={[styles.title, themeStyles.title]}>Favorites ({favoritedRecommendations.length})</Text>
        <Text style={[styles.subtitle, themeStyles.subtitle]}>Your saved recommendations</Text>
      </View>

      {favoritedRecommendations.length > 0 ? (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => {
              const isActive = (category === 'All' && !selectedCategory) || selectedCategory === category;
              return (
                <Pressable
                  key={category}
                  style={[styles.categoryChip, themeStyles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(category === 'All' ? null : category)}
                >
                  <Text style={[styles.categoryChipText, themeStyles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.recommendationsList}>
            {filteredRecommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                isFavorited={true}
                onToggleFavorite={toggleFavorite}
                onPlay={playRecommendation}
                onClick={handleRecommendationClick}
              />
            ))}
          </View>

          {filteredRecommendations.length === 0 && selectedCategory && (
            <View style={styles.emptyState}>
              <Ionicons name="mail-open-outline" size={64} color={emptyIconColor} style={styles.emptyIcon} />
              <Text style={[styles.emptyText, themeStyles.emptyText]}>No {selectedCategory.toLowerCase()} favorites yet</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="star-outline" size={64} color={emptyIconColor} style={styles.emptyIcon} />
          <Text style={[styles.emptyTitle, themeStyles.emptyTitle]}>No favorites yet</Text>
          <Text style={[styles.emptyText, themeStyles.emptyText]}>Start exploring and save your favorite recommendations</Text>
        </View>
      )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  categoriesScroll: {
    marginBottom: 24,
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  categoryChipActive: {
    backgroundColor: '#4689F3',
    borderColor: '#4689F3',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: 'white',
  },
  recommendationsList: {
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  title: { color: '#e5e5e5' },
  subtitle: { color: '#888' },
  categoryChip: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  categoryChipText: { color: '#e5e5e5' },
  emptyTitle: { color: '#e5e5e5' },
  emptyText: { color: '#888' },
});

