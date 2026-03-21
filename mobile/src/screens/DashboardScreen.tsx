import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../navigation/types';
import { recommendations, categories } from '../data/mockData';
import { RecommendationCard } from '../components/RecommendationCard';
import { useFavorites } from '../context/FavoritesContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useTheme } from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { isDarkMode } = useTheme();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { playRecommendation } = useAudioPlayer();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const searchIconColor = isDarkMode ? '#888' : '#999';
  const placeholderColor = isDarkMode ? '#888' : '#999';

  const featuredRecommendations = recommendations.slice(0, 5);
  const recentRecommendations = recommendations.slice(5, 10);

  const handleRecommendationClick = (recommendation: typeof recommendations[0]) => {
    navigation.navigate('RecommendationDetail', { recommendation });
  };

  const handleCategoryClick = (category: string) => {
    navigation.navigate('CategoryList', { category });
  };

  return (
    <ScrollView style={[styles.container, themeStyles.container]} contentContainerStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={[styles.title, themeStyles.title]}>After Hours Picks</Text>

        <Pressable
          style={[styles.searchButton, themeStyles.searchButton]}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={20} color={searchIconColor} style={styles.searchIcon} />
          <Text style={[styles.searchPlaceholder, { color: placeholderColor }]}>Search recommendations...</Text>
        </Pressable>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Browse by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <Pressable
                key={category.name}
                style={[styles.categoryCard, themeStyles.categoryCard]}
                onPress={() => handleCategoryClick(category.name)}
              >
                <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={28} color="#4689F3" style={styles.categoryIcon} />
                <Text style={[styles.categoryName, themeStyles.categoryName]}>{category.name}</Text>
                <Text style={[styles.categoryCount, themeStyles.categoryCount]}>{category.count} picks</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Featured Picks */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Featured Picks</Text>
        <View style={styles.cardsContainer}>
          {featuredRecommendations.map((rec) => (
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
      </View>

      {/* Recently Added */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Recently Added</Text>
        <View style={styles.cardsContainer}>
          {recentRecommendations.map((rec) => (
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
    paddingBottom: 120, // Space for mini player + tab bar
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
  categoriesScroll: {
    paddingLeft: 24,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 24,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#999',
  },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  title: { color: '#e5e5e5' },
  searchButton: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  sectionTitle: { color: '#e5e5e5' },
  categoryCard: { backgroundColor: '#1e1e1e' },
  categoryName: { color: '#e5e5e5' },
  categoryCount: { color: '#888' },
});

