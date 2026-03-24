import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiRecommendation } from '../models/recommendation';
import { useTheme } from '../context/ThemeContext';

interface RecommendationCardProps {
  recommendation: ApiRecommendation;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  onPlay: (recommendation: ApiRecommendation) => void;
  onClick: (recommendation: ApiRecommendation) => void;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Books: '#4689F3',
    Tech: '#2C5DB9',
    Culture: '#7CA7EE',
    Restaurants: '#AEC9F6',
    Articles: '#2E3B70',
    Ideas: '#969BB3',
  };
  return colors[category] || '#4689F3';
};

export function RecommendationCard({
  recommendation,
  isFavorited,
  onToggleFavorite,
  onPlay,
  onClick,
}: RecommendationCardProps) {
  const { isDarkMode } = useTheme();
  const categoryName = recommendation.category?.name ?? '';
  const categoryColor = getCategoryColor(categoryName);
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);

  const hostName = recommendation.host?.name ?? '';
  const season = recommendation.episode?.season;
  const episodeNumber = recommendation.episode?.episode_number;
  const episodeMeta = season != null && episodeNumber != null
    ? `S${season}E${episodeNumber}`
    : null;

  return (
    <Pressable
      style={[styles.card, themeStyles.card]}
      onPress={() => onClick(recommendation)}
      android_ripple={{ color: isDarkMode ? '#333' : '#f0f0f0' }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.mainContent}>
            {categoryName ? (
              <View style={styles.categoryBadge}>
                <View style={[styles.categoryBadgeInner, { backgroundColor: `${categoryColor}15` }]}>
                  <Text style={[styles.categoryText, { color: categoryColor }]}>
                    {categoryName}
                  </Text>
                </View>
              </View>
            ) : null}
            <Text style={[styles.title, themeStyles.title]} numberOfLines={1}>
              {recommendation.title}
            </Text>
          </View>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite(String(recommendation.id));
            }}
            style={styles.favoriteButton}
            hitSlop={8}
          >
            <Ionicons name={isFavorited ? 'star' : 'star-outline'} size={20} color="#4689F3" />
          </Pressable>
        </View>

        <View style={[styles.footer, !recommendation.has_audio && styles.footerNoPlay]}>
          <Text style={[styles.metadata, themeStyles.metadata]}>
            {[hostName, episodeMeta].filter(Boolean).join(' • ')}
          </Text>

          {recommendation.has_audio ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onPlay(recommendation);
              }}
              style={[styles.playButton, { backgroundColor: categoryColor }]}
              hitSlop={8}
            >
              <Ionicons name="play" size={14} color="white" style={styles.playButtonIcon} />
              <Text style={styles.playButtonText}>Play</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mainContent: {
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    marginBottom: 8,
  },
  categoryBadgeInner: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerNoPlay: {
    justifyContent: 'flex-start',
  },
  metadata: {
    fontSize: 12,
    color: '#999',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  playButtonIcon: {
    marginRight: 2,
  },
  playButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

const darkStyles = StyleSheet.create({
  card: { backgroundColor: '#1e1e1e' },
  title: { color: '#e5e5e5' },
  metadata: { color: '#888' },
});
