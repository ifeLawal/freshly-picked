import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image, Linking, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { MainStackParamList } from '../navigation/types';
import { useFavorites } from '../context/FavoritesContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useRecommendationDetailScreen } from '../context/RecommendationDetailScreenContext';
import { useTheme } from '../context/ThemeContext';
import { fetchRecommendationDetail } from '../services/recommendationsApi';

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
  const { currentlyPlaying, isPlaying, currentTime, duration, playPause, skip, playRecommendation } = useAudioPlayer();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const controlIconColor = isDarkMode ? '#888' : '#666';

  useEffect(() => {
    setOnRecommendationDetailScreen(true);
    return () => setOnRecommendationDetailScreen(false);
  }, [setOnRecommendationDetailScreen]);

  const { data: detail, isLoading } = useQuery({
    queryKey: ['recommendation', recommendation.id],
    queryFn: () => fetchRecommendationDetail(recommendation.id),
  });

  // Use detail data when available, fall back to summary from route params
  const title = detail?.title ?? recommendation.title;
  const imageUrl = detail?.image_url ?? recommendation.image_url;
  const hasAudio = detail?.has_audio ?? recommendation.has_audio;
  const categoryName = detail?.category?.name ?? recommendation.category?.name ?? '';
  const categoryColor = getCategoryColor(categoryName);

  const isThisRecommendationPlaying = currentlyPlaying?.id === recommendation.id;
  const showPause = isThisRecommendationPlaying && isPlaying;
  const displayTime = isThisRecommendationPlaying ? currentTime : 0;
  const displayDuration = isThisRecommendationPlaying ? duration : 0;
  const progress = isThisRecommendationPlaying && displayDuration > 0 ? (displayTime / displayDuration) * 100 : 0;

  return (
    <ScrollView style={[styles.container, themeStyles.container]} contentContainerStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#4689F3" style={styles.backIcon} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.details}>

        <View style={styles.titleRow}>
          <Text style={[styles.title, themeStyles.title]}>{title}</Text>
          <Pressable onPress={() => toggleFavorite(String(recommendation.id))} style={styles.favoriteButton}>
            <Ionicons name={isFavorited(String(recommendation.id)) ? 'star' : 'star-outline'} size={24} color="#4689F3" />
          </Pressable>
        </View>

        <Text style={[styles.metadata, themeStyles.metadata]}>
          {[
            recommendation.host?.name,
            recommendation.episode
              ? `S${recommendation.episode.season}E${recommendation.episode.episode_number}`
              : null,
          ].filter(Boolean).join(' • ')}
        </Text>

        {categoryName ? (
          <Text style={[styles.categoryText, styles.categoryBadge, { backgroundColor: `${categoryColor}15` }, { color: categoryColor }]}>
            {categoryName}
          </Text>
        ) : null}

        {detail?.tags && detail.tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {detail.tags.map((tag) => (
              <View key={tag.id} style={[styles.tag, themeStyles.tag]}>
                <Text style={[styles.tagText, themeStyles.tagText]}>{tag.name}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Image */}
        {imageUrl ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={DEFAULT_RECOMMENDATION_IMAGE} style={styles.image} resizeMode="cover" />
          </View>
        )}

        {/* Audio Player */}
        <View style={[styles.playerCard, themeStyles.playerCard]}>
          {hasAudio ? (
            <>
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, themeStyles.progressBar]}>
                  <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: categoryColor }]} />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={[styles.timeText, themeStyles.timeText]}>{formatTime(displayTime)}</Text>
                  <Text style={[styles.timeText, themeStyles.timeText]}>{formatTime(displayDuration)}</Text>
                </View>
              </View>

              {/* Controls */}
              <View style={styles.controls}>
                <Pressable style={styles.controlButton} onPress={() => skip(-10)}>
                  <Ionicons name="play-skip-back" size={24} color={controlIconColor} />
                </Pressable>

                <Pressable
                  style={[styles.playButton, { backgroundColor: categoryColor }]}
                  onPress={() => {
                    if (showPause) {
                      playPause();
                    } else {
                      playRecommendation(detail ?? recommendation);
                    }
                  }}
                >
                  <Ionicons name={showPause ? 'pause' : 'play'} size={32} color="white" />
                </Pressable>

                <Pressable style={styles.controlButton} onPress={() => skip(10)}>
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

        {/* Why Recommended */}
        {isLoading ? (
          <ActivityIndicator size="small" color="#4689F3" style={styles.loader} />
        ) : detail?.why_recommended ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Why Recommended</Text>
            <Text style={[styles.sectionBody, themeStyles.sectionBody]}>{detail.why_recommended}</Text>
          </View>
        ) : null}

        {/* External Link */}
        {detail?.external_url ? (
          <Pressable
            style={[styles.externalLink, { borderColor: categoryColor }]}
            onPress={() => Linking.openURL(detail.external_url!)}
          >
            <Ionicons name="open-outline" size={18} color={categoryColor} style={styles.externalLinkIcon} />
            <Text style={[styles.externalLinkText, { color: categoryColor }]}>Open Link</Text>
          </Pressable>
        ) : null}

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
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
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
  metadata: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#e5e5e5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 16,
    color: '#555',
    lineHeight: 26,
  },
  externalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  externalLinkIcon: {
    marginRight: 8,
  },
  externalLinkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  title: { color: '#e5e5e5' },
  metadata: { color: '#888' },
  playerCard: { backgroundColor: '#1e1e1e' },
  comingSoonTitle: { color: '#e5e5e5' },
  comingSoonSubtext: { color: '#888' },
  progressBar: { backgroundColor: '#333' },
  timeText: { color: '#888' },
  tag: { backgroundColor: '#2a2a2a' },
  tagText: { color: '#aaa' },
  sectionTitle: { color: '#e5e5e5' },
  sectionBody: { color: '#aaa' },
});
