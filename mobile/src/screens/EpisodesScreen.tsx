import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../navigation/types';
import { episodes } from '../data/mockData';
import { EpisodeCard } from '../components/EpisodeCard';
import { useTheme } from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function EpisodesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { isDarkMode } = useTheme();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const emptyIconColor = isDarkMode ? '#666' : '#999';

  const handleEpisodeClick = (episode: typeof episodes[0]) => {
    navigation.navigate('EpisodeDetail', { episode });
  };

  return (
    <ScrollView style={[styles.container, themeStyles.container]} contentContainerStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={[styles.title, themeStyles.title]}>Episodes</Text>
        <Text style={[styles.subtitle, themeStyles.subtitle]}>Browse all After Hours episodes and their recommendations</Text>
      </View>

      <View style={styles.episodesList}>
        {episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} onClick={handleEpisodeClick} />
        ))}
      </View>

      {episodes.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="mic-outline" size={64} color={emptyIconColor} style={styles.emptyIcon} />
          <Text style={[styles.emptyText, themeStyles.emptyText]}>No episodes available</Text>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  episodesList: {
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
  subtitle: { color: '#888' },
  emptyText: { color: '#888' },
});

