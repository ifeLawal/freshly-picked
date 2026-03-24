import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiRecommendation } from '../models/recommendation';
import { useTheme } from '../context/ThemeContext';

interface MiniPlayerProps {
  recommendation: ApiRecommendation | null;
  isPlaying: boolean;
  currentTime: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onTap: () => void;
  /** Distance from bottom of screen (e.g. tab bar height including safe area). */
  bottomOffset?: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const DEFAULT_BOTTOM_OFFSET = 60;

export function MiniPlayer({
  recommendation,
  isPlaying,
  currentTime,
  onPlayPause,
  onTap,
  bottomOffset = DEFAULT_BOTTOM_OFFSET,
}: MiniPlayerProps) {
  const { isDarkMode } = useTheme();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);

  if (!recommendation) return null;

  // TODO: duration is not available on ApiRecommendation summary — update once a full detail endpoint provides it
  const duration = 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const hostName = recommendation.host?.name ?? '';
  const season = recommendation.episode?.season;
  const episodeNumber = recommendation.episode?.episode_number;
  const episodeMeta = season != null && episodeNumber != null ? `S${season}E${episodeNumber}` : null;
  const subtitleParts = [hostName, episodeMeta, formatTime(currentTime)].filter(Boolean);
  
  return (
    <View style={[styles.container, themeStyles.container, { bottom: bottomOffset }]}>
      {/* Progress Bar */}
      <View style={[styles.progressBarContainer, themeStyles.progressBarContainer]}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Player Content */}
      <Pressable style={styles.content} onPress={onTap}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, themeStyles.title]} numberOfLines={1}>
            {recommendation.title}
          </Text>
          <Text style={[styles.subtitle, themeStyles.subtitle]} numberOfLines={1}>
            {subtitleParts.join(' • ')}
          </Text>
        </View>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onPlayPause();
          }}
          style={styles.playButton}
          hitSlop={8}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="white" />
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: '#e5e5e5',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4689F3',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4689F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#1e1e1e', borderTopColor: '#333' },
  progressBarContainer: { backgroundColor: '#333' },
  title: { color: '#e5e5e5' },
  subtitle: { color: '#888' },
});

