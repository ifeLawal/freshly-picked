import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import {
  BookOpen, FileText, Globe, Tv, Sparkles, Film, Mic, Music,
  UtensilsCrossed, Smartphone, Coffee, Building2,
  Check, Star, type LucideIcon,
} from 'lucide-react-native';
import { ApiRecommendation } from '../models/recommendation';
import { useTheme } from '../context/ThemeContext';

interface RecommendationCardProps {
  recommendation: ApiRecommendation;
  isFavorited: boolean;
  isCompleted: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onClick: (recommendation: ApiRecommendation) => void;
}

// Icon color — matches web's text-* values
const CATEGORY_COLORS: Record<string, string> = {
  book: '#4689F3',       // primary
  article: '#7C3AED',   // accent
  website: '#F59E0B',   // chart-3
  tv: '#10B981',        // chart-4
  other: '#F97316',     // chart-5
  movie: '#EF4444',     // chart-1
  podcast: '#4BADE8',   // chart-2
  music: '#4689F3',     // primary
  restaurant: '#EF4444', // destructive
  app: '#7C3AED',       // accent
  'food-or-drink': '#F59E0B', // chart-3
  organization: '#10B981',    // chart-4
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  book: BookOpen,
  article: FileText,
  website: Globe,
  tv: Tv,
  other: Sparkles,
  movie: Film,
  podcast: Mic,
  music: Music,
  restaurant: UtensilsCrossed,
  app: Smartphone,
  'food-or-drink': Coffee,
  organization: Building2,
};


export function RecommendationCard({
  recommendation,
  isFavorited,
  isCompleted,
  onToggleFavorite,
  onToggleCompleted,
  onClick,
}: RecommendationCardProps) {
  const { isDarkMode } = useTheme();
  const categorySlug = recommendation.category?.slug ?? '';
  const categoryName = recommendation.category?.name ?? '';
  const categoryColor = CATEGORY_COLORS[categorySlug] ?? '#4689F3';
  const CategoryIcon = CATEGORY_ICONS[categorySlug] ?? Sparkles;
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);

  const hostName = recommendation.host?.name ?? '';
  const episode = recommendation.episode;
  const episodeInfo = episode
    ? (`S${episode.season} E${episode.episode_number}` || episode.title)
    : null;

  return (
    <Pressable
      style={[styles.card, themeStyles.card]}
      onPress={() => onClick(recommendation)}
      android_ripple={{ color: isDarkMode ? '#333' : '#f0f0f0' }}
    >
      <View style={styles.content}>
        {/* Left column */}
        <View style={styles.leftColumn}>
          <Text style={[styles.title, themeStyles.title]} numberOfLines={2}>{recommendation.title}</Text>
          {categoryName ? (
            <View style={styles.categoryRow}>
              <View style={[styles.categoryIconBadge, { backgroundColor: `${categoryColor}18` }]}>
                <CategoryIcon size={12} color={categoryColor} />
              </View>
              <Text style={[styles.categoryText, themeStyles.categoryText]}>{categoryName}</Text>
            </View>
          ) : null}
          {hostName ? (
            <Text style={[styles.meta, themeStyles.meta]}>
              Recommended by <Text style={styles.metaBold}>{hostName}</Text>
            </Text>
          ) : null}
          {episodeInfo ? (
            <Text style={[styles.meta, themeStyles.meta]} numberOfLines={1}>{episodeInfo}</Text>
          ) : null}
        </View>

        {/* Right column — image only */}
        <View style={styles.rightColumn}>
          {recommendation.image_url ? (
            <Image
              source={{ uri: recommendation.image_url }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: `${categoryColor}18` }]} />
          )}
        </View>
      </View>

      {/* Icons anchored to bottom-right of card */}
      <View style={styles.iconRow}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onToggleCompleted(String(recommendation.id));
          }}
          hitSlop={8}
          style={[styles.iconButton, isCompleted ? styles.iconButtonCompleted : styles.iconButtonInactive]}
        >
          <Check
            size={14}
            color={isCompleted ? 'white' : '#aaa'}
          />
        </Pressable>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite(String(recommendation.id));
          }}
          hitSlop={8}
          style={[styles.iconButton, isFavorited ? styles.iconButtonFavorited : styles.iconButtonInactive]}
        >
          <Star
            size={14}
            color={isFavorited ? '#1a1a1a' : '#aaa'}
            fill={isFavorited ? '#1a1a1a' : 'none'}
          />
        </Pressable>
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
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 14,
    gap: 12,
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  categoryIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 21,
  },
  meta: {
    fontSize: 12,
    color: '#999',
    lineHeight: 17,
  },
  metaBold: {
    fontWeight: '700',
    color: '#999',
  },
  rightColumn: {
    width: 110,
    alignSelf: 'stretch',
    position: 'relative',
    minHeight: 90,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  iconRow: {
    position: 'absolute',
    bottom: 10,
    right: 14,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonInactive: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  iconButtonCompleted: {
    backgroundColor: '#7C3AED',
    borderWidth: 0,
  },
  iconButtonFavorited: {
    backgroundColor: '#F5A623',
    borderWidth: 0,
  },
});

const darkStyles = StyleSheet.create({
  card: { backgroundColor: '#1e1e1e' },
  title: { color: '#e5e5e5' },
  meta: { color: '#888' },
  categoryText: { color: '#666' },
});
