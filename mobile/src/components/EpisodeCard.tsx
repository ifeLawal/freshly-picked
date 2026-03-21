import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Episode } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface EpisodeCardProps {
  episode: Episode;
  onClick: (episode: Episode) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export function EpisodeCard({ episode, onClick }: EpisodeCardProps) {
  const { isDarkMode } = useTheme();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const dateIconColor = isDarkMode ? '#888' : '#999';

  return (
    <Pressable
      style={[styles.card, themeStyles.card]}
      onPress={() => onClick(episode)}
      android_ripple={{ color: isDarkMode ? '#333' : '#f0f0f0' }}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="play" size={28} color="white" />
        </View>

        <View style={styles.textContent}>
          <View style={[styles.badge, themeStyles.badge]}>
            <Text style={styles.badgeText}>
              Season {episode.season}, Episode {episode.episode}
            </Text>
          </View>

          <Text style={[styles.title, themeStyles.title]}>{episode.title}</Text>

          <Text style={[styles.description, themeStyles.description]} numberOfLines={2}>
            {episode.description}
          </Text>

          <View style={styles.metadata}>
            <Ionicons name="calendar-outline" size={14} color={dateIconColor} style={styles.dateIcon} />
            <Text style={[styles.date, themeStyles.date]}>{formatDate(episode.date)}</Text>
            <Text style={[styles.count, themeStyles.count]}>
              {episode.recommendationIds.length} recommendation{episode.recommendationIds.length !== 1 ? 's' : ''}
            </Text>
          </View>
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
    flexDirection: 'row',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#4689F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContent: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4689F3',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateIcon: {
    marginRight: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  count: {
    fontSize: 12,
    color: '#999',
  },
});

const darkStyles = StyleSheet.create({
  card: { backgroundColor: '#1e1e1e' },
  badge: { backgroundColor: '#1e3a5f' },
  title: { color: '#e5e5e5' },
  description: { color: '#888' },
  date: { color: '#888' },
  count: { color: '#888' },
});

