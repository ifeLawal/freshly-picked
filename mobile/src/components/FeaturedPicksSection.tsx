import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { RecommendationCard } from './RecommendationCard';
import { ApiRecommendation } from '../models/recommendation';

interface FeaturedPicksSectionProps {
  recommendations: ApiRecommendation[];
  isFavorited: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onPlay: (recommendation: ApiRecommendation) => void;
  onPress: (recommendation: ApiRecommendation) => void;
}

export function FeaturedPicksSection({
  recommendations,
  isFavorited,
  onToggleFavorite,
  onPlay,
  onPress,
}: FeaturedPicksSectionProps) {
  const { isDarkMode } = useTheme();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);

  if (recommendations.length === 0) return null;

  const featured = recommendations.slice(0, 5);
  const recent = recommendations.slice(5, 10);

  return (
    <>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Featured Picks</Text>
        <View style={styles.cardsContainer}>
          {featured.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              isFavorited={isFavorited(String(rec.id))}
              onToggleFavorite={onToggleFavorite}
              onPlay={onPlay}
              onClick={onPress}
            />
          ))}
        </View>
      </View>

      {recent.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Recently Added</Text>
          <View style={styles.cardsContainer}>
            {recent.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                isFavorited={isFavorited(String(rec.id))}
                onToggleFavorite={onToggleFavorite}
                onPlay={onPlay}
                onClick={onPress}
              />
            ))}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
});

const darkStyles = StyleSheet.create({
  sectionTitle: { color: '#e5e5e5' },
});
