import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
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
import { useRecommendationDetailScreen } from '../context/RecommendationDetailScreenContext';
import { useTheme } from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type RoutePropType = RouteProp<MainStackParamList, 'RecommendationDetail'>;

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

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const DEFAULT_RECOMMENDATION_IMAGE = require('../../assets/HBR-Presents-Logo-Placeholder.png');

export function RecommendationDetailScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  const { recommendation } = route.params;
  const { isDarkMode } = useTheme();
  const { setOnRecommendationDetailScreen } = useRecommendationDetailScreen();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { currentlyPlaying, isPlaying, currentTime, playPause, seek, skip, playRecommendation } = useAudioPlayer();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const controlIconColor = isDarkMode ? '#888' : '#666';

  useEffect(() => {
    setOnRecommendationDetailScreen(true);
    return () => setOnRecommendationDetailScreen(false);
  }, [setOnRecommendationDetailScreen]);

  const hasAudio = Boolean(recommendation.audioUrl);
  const isThisRecommendationPlaying = currentlyPlaying?.id === recommendation.id;
  const showPause = isThisRecommendationPlaying && isPlaying;
  const duration = recommendation.duration ?? 0;
  const displayTime = isThisRecommendationPlaying ? currentTime : 0;
  const progress = isThisRecommendationPlaying && duration > 0 ? (currentTime / duration) * 100 : 0;

  const relatedRecommendations = recommendations.filter(
    (rec) => rec.episodeId === recommendation.episodeId && rec.id !== recommendation.id
  );

  const categoryColor = getCategoryColor(recommendation.category);

  const handleRelatedClick = (rec: typeof recommendations[0]) => {
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
      </View>

      <View style={styles.details}>

        <View style={styles.titleRow}>
          <Text style={[styles.title, themeStyles.title]}>{recommendation.title}</Text>
            <Pressable
            onPress={() => toggleFavorite(recommendation.id)}
            style={styles.favoriteButton}
          >
            <Ionicons name={isFavorited(recommendation.id) ? 'star' : 'star-outline'} size={24} color="#4689F3" />
          </Pressable>
        </View>

        {/* Audio Player */}
        <View style={[styles.playerCard, themeStyles.playerCard]}>
          {hasAudio ? (
            <>
              {/* Recommendation image */}
              <View style={styles.recommendationImageContainer}>
                <Image
                  source={recommendation.imageUrl ? recommendation.imageUrl : DEFAULT_RECOMMENDATION_IMAGE}
                  style={styles.recommendationImage}
                  resizeMode="cover"
                />
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, themeStyles.progressBar]}>
                  <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: categoryColor }]} />
                </View>
              <View style={styles.timeContainer}>
                <Text style={[styles.timeText, themeStyles.timeText]}>{formatTime(displayTime)}</Text>
                <Text style={[styles.timeText, themeStyles.timeText]}>{formatTime(duration)}</Text>
              </View>
              </View>

              {/* Controls */}
              <View style={styles.controls}>
                <Pressable
                  style={styles.controlButton}
                  onPress={() => skip(-10)}
                >
                  <Ionicons name="play-skip-back" size={24} color={controlIconColor} />
                </Pressable>

                <Pressable
                  style={[styles.playButton, { backgroundColor: categoryColor }]}
                  onPress={() => {
                    if (showPause) {
                      playPause();
                    } else {
                      playRecommendation(recommendation);
                    }
                  }}
                >
                  <Ionicons name={showPause ? 'pause' : 'play'} size={32} color="white" />
                </Pressable>

                <Pressable
                  style={styles.controlButton}
                  onPress={() => skip(10)}
                >
                  <Ionicons name="play-skip-forward" size={24} color={controlIconColor} />
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.comingSoonContainer}>
              <View style={[styles.comingSoonIconWrap, { backgroundColor: `${categoryColor}18` }]}>
                <Ionicons name="musical-notes-outline" size={48} color={categoryColor} />
              </View>
              <Text style={[styles.comingSoonTitle, themeStyles.comingSoonTitle]}>Coming Soon</Text>
              <Text style={[styles.comingSoonSubtext, themeStyles.comingSoonSubtext]}>Audio clip for this recommendation is on the way.</Text>
            </View>
          )}
        </View>

        <Text style={[styles.metadata, themeStyles.metadata]}>
          {recommendation.host} • S{recommendation.season}E{recommendation.episode} • {new Date(recommendation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>

        <Text style={[styles.categoryText, styles.categoryBadge, { backgroundColor: `${categoryColor}15` }, { color: categoryColor }]}>
          {recommendation.category}
        </Text>

        <Text style={[styles.description, themeStyles.description]}>{recommendation.description}</Text>

        {/* Related Recommendations */}
        {relatedRecommendations.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={[styles.relatedTitle, themeStyles.relatedTitle]}>More from this episode</Text>
            {relatedRecommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                isFavorited={isFavorited(rec.id)}
                onToggleFavorite={toggleFavorite}
                onPlay={playRecommendation}
                onClick={handleRelatedClick}
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
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 8,
  },
  backIcon: {
    fontSize: 20,
    color: '#4689F3',
    marginRight: 4,
  },
  backText: {
    fontSize: 16,
    color: '#4689F3',
  },
  details: {
    paddingHorizontal: 24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 12,
  },
  favoriteButton: {
    padding: 8,
  },
  star: {
    fontSize: 24,
    color: '#4689F3',
  },
  metadata: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  playerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  comingSoonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  comingSoonIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  recommendationImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#e5e5e5',
  },
  recommendationImage: {
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e5e5',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  controlButton: {
    padding: 12,
  },
  controlIcon: {
    fontSize: 24,
    color: '#4689F3',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 28,
    color: 'white',
  },
  relatedSection: {
    marginTop: 8,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  title: { color: '#e5e5e5' },
  metadata: { color: '#888' },
  description: { color: '#888' },
  playerCard: { backgroundColor: '#1e1e1e' },
  comingSoonTitle: { color: '#e5e5e5' },
  comingSoonSubtext: { color: '#888' },
  progressBar: { backgroundColor: '#333' },
  timeText: { color: '#888' },
  relatedTitle: { color: '#e5e5e5' },
});

