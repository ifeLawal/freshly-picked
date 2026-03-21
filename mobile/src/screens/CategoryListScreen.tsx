import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../navigation/types';
import { recommendations } from '../data/mockData';
import { RecommendationCard } from '../components/RecommendationCard';
import { useFavorites } from '../context/FavoritesContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useTheme } from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type RoutePropType = RouteProp<MainStackParamList, 'CategoryList'>;

const getCategoryIconName = (cat: string): keyof typeof Ionicons.glyphMap => {
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Books: 'book',
    Tech: 'laptop-outline',
    Culture: 'color-palette-outline',
    Restaurants: 'restaurant',
    Food: 'restaurant',
    Articles: 'newspaper-outline',
    Article: 'newspaper-outline',
    Ideas: 'bulb-outline',
    Activity: 'bicycle-outline',
    Book: 'book',
  };
  return icons[cat] || 'pin';
};

export function CategoryListScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  const { category } = route.params;
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical'>('recent');
  const { isDarkMode } = useTheme();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { playRecommendation } = useAudioPlayer();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const emptyIconColor = isDarkMode ? '#666' : '#999';

  const categoryRecommendations = recommendations.filter((rec) => rec.category === category);

  const sortedRecommendations = [...categoryRecommendations].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleRecommendationClick = (rec: typeof recommendations[0]) => {
    navigation.navigate('RecommendationDetail', { recommendation: rec });
  };

  return (
    <ScrollView style={[styles.container, themeStyles.container]} contentContainerStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#4689F3" style={styles.backIcon} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.categoryHeader}>
          <Ionicons name={getCategoryIconName(category)} size={40} color="#4689F3" style={styles.categoryIcon} />
          <View style={styles.categoryInfo}>
            <Text style={[styles.title, themeStyles.title]}>{category}</Text>
            <Text style={[styles.count, themeStyles.count]}>
              {categoryRecommendations.length} recommendation{categoryRecommendations.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View style={styles.sortContainer}>
          <Pressable
            style={[styles.sortButton, themeStyles.sortButton, sortBy === 'recent' && styles.sortButtonActive]}
            onPress={() => setSortBy('recent')}
          >
            <Text style={[styles.sortButtonText, themeStyles.sortButtonText, sortBy === 'recent' && styles.sortButtonTextActive]}>
              Most Recent
            </Text>
          </Pressable>
          <Pressable
            style={[styles.sortButton, themeStyles.sortButton, sortBy === 'alphabetical' && styles.sortButtonActive]}
            onPress={() => setSortBy('alphabetical')}
          >
            <Text style={[styles.sortButtonText, themeStyles.sortButtonText, sortBy === 'alphabetical' && styles.sortButtonTextActive]}>
              A-Z
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.recommendationsList}>
        {sortedRecommendations.map((rec) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            isFavorited={isFavorited(rec.id)}
            onToggleFavorite={toggleFavorite}
            onPlay={playRecommendation}
            onClick={handleRecommendationClick}
          />
        ))}
      </View>

      {sortedRecommendations.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="mail-open-outline" size={64} color={emptyIconColor} style={styles.emptyIcon} />
          <Text style={[styles.emptyText, themeStyles.emptyText]}>No items in this category</Text>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 24,
  },
  backIcon: {
    marginRight: 4,
  },
  backText: {
    fontSize: 16,
    color: '#4689F3',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    color: '#999',
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  sortButtonActive: {
    backgroundColor: '#4689F3',
    borderColor: '#4689F3',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  sortButtonTextActive: {
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
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  title: { color: '#e5e5e5' },
  count: { color: '#888' },
  sortButton: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  sortButtonText: { color: '#e5e5e5' },
  emptyText: { color: '#888' },
});

