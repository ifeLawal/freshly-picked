import React from 'react';
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
type RoutePropType = RouteProp<MainStackParamList, 'EpisodeDetail'>;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export function EpisodeDetailScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  const { episode } = route.params;
  const { isDarkMode } = useTheme();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { playRecommendation } = useAudioPlayer();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const dateIconColor = isDarkMode ? '#888' : '#999';
  const emptyIconColor = isDarkMode ? '#666' : '#999';

  const episodeRecommendations = recommendations.filter((rec) =>
    episode.recommendationIds.includes(rec.id)
  );

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

        <View style={[styles.badge, themeStyles.badge]}>
          <Text style={styles.badgeText}>
            Season {episode.season}, Episode {episode.episode}
          </Text>
        </View>

        <Text style={[styles.title, themeStyles.title]}>{episode.title}</Text>

        <View style={styles.metadata}>
          <Ionicons name="calendar-outline" size={16} color={dateIconColor} style={styles.dateIcon} />
          <Text style={[styles.date, themeStyles.date]}>{formatDate(episode.date)}</Text>
        </View>

        <Text style={[styles.description, themeStyles.description]}>{episode.description}</Text>
      </View>

      <View style={styles.recommendationsSection}>
        <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>
          Recommendations ({episodeRecommendations.length})
        </Text>

        {episodeRecommendations.map((rec) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            isFavorited={isFavorited(rec.id)}
            onToggleFavorite={toggleFavorite}
            onPlay={playRecommendation}
            onClick={handleRecommendationClick}
          />
        ))}

        {episodeRecommendations.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="mail-open-outline" size={64} color={emptyIconColor} style={styles.emptyIcon} />
            <Text style={[styles.emptyText, themeStyles.emptyText]}>No recommendations for this episode</Text>
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
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4689F3',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateIcon: {
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  recommendationsSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
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
  badge: { backgroundColor: '#1e3a5f' },
  title: { color: '#e5e5e5' },
  date: { color: '#888' },
  description: { color: '#888' },
  sectionTitle: { color: '#e5e5e5' },
  emptyText: { color: '#888' },
});

