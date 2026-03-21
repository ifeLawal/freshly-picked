import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../navigation/types';
import { recommendations, episodes, categories } from '../data/mockData';
import { RecommendationCard } from '../components/RecommendationCard';
import { EpisodeCard } from '../components/EpisodeCard';
import { useFavorites } from '../context/FavoritesContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { storage } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const { isDarkMode } = useTheme();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { playRecommendation } = useAudioPlayer();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const iconColor = isDarkMode ? '#888' : '#999';
  const placeholderColor = isDarkMode ? '#888' : '#999';

  useEffect(() => {
    const loadRecentSearches = async () => {
      const searches = await storage.getRecentSearches();
      setRecentSearches(searches);
    };
    loadRecentSearches();
  }, []);

  const addRecentSearch = async (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    await storage.saveRecentSearches(updated);
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await storage.saveRecentSearches([]);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
    }
  };

  const filteredRecommendations = query.trim()
    ? recommendations.filter(
        (rec) =>
          rec.title.toLowerCase().includes(query.toLowerCase()) ||
          rec.description.toLowerCase().includes(query.toLowerCase()) ||
          rec.host.toLowerCase().includes(query.toLowerCase()) ||
          rec.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredEpisodes = query.trim()
    ? episodes.filter(
        (ep) =>
          ep.title.toLowerCase().includes(query.toLowerCase()) ||
          ep.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hosts = Array.from(new Set(recommendations.map(r => r.host)));
  const filteredHosts = query.trim()
    ? hosts.filter(host => host.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleRecommendationClick = (rec: typeof recommendations[0]) => {
    navigation.navigate('RecommendationDetail', { recommendation: rec });
  };

  const handleEpisodeClick = (ep: typeof episodes[0]) => {
    navigation.navigate('EpisodeDetail', { episode: ep });
  };

  const handleCategoryClick = (category: string) => {
    navigation.navigate('CategoryList', { category });
  };

  return (
    <ScrollView style={[styles.container, themeStyles.container]} contentContainerStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }, themeStyles.header]}>
        <Text style={[styles.title, themeStyles.title]}>Search</Text>

        <View style={[styles.searchContainer, themeStyles.searchContainer]}>
          <Ionicons name="search" size={20} color={iconColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, themeStyles.searchInput]}
            value={query}
            onChangeText={handleSearch}
            placeholder="Search recommendations, hosts, episodes..."
            placeholderTextColor={placeholderColor}
            autoFocus
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close" size={20} color={iconColor} style={styles.clearIcon} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.results}>
        {!query.trim() ? (
          <>
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Recent Searches</Text>
                  <Pressable onPress={clearRecentSearches}>
                    <Text style={styles.clearButton}>Clear</Text>
                  </Pressable>
                </View>
                <View style={styles.recentSearches}>
                  {recentSearches.map((search, index) => (
                    <Pressable
                      key={index}
                      style={[styles.recentSearchChip, themeStyles.recentSearchChip]}
                      onPress={() => setQuery(search)}
                    >
                      <Text style={[styles.recentSearchText, themeStyles.recentSearchText]}>{search}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Browse Categories</Text>
              <View style={styles.categoriesGrid}>
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
            </View>
          </>
        ) : (
          <>
            {filteredRecommendations.length === 0 && filteredEpisodes.length === 0 && filteredHosts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color={iconColor} style={styles.emptyIcon} />
                <Text style={[styles.emptyText, themeStyles.emptyText]}>No results found for "{query}"</Text>
                <Text style={[styles.emptySubtext, themeStyles.emptySubtext]}>Try searching for a book, restaurant, or host name</Text>
              </View>
            ) : (
              <>
                {filteredRecommendations.length > 0 && (
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>
                      Recommendations ({filteredRecommendations.length})
                    </Text>
                    {filteredRecommendations.map((rec) => (
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
                )}

                {filteredEpisodes.length > 0 && (
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Episodes ({filteredEpisodes.length})</Text>
                    {filteredEpisodes.map((ep) => (
                      <EpisodeCard key={ep.id} episode={ep} onClick={handleEpisodeClick} />
                    ))}
                  </View>
                )}

                {filteredHosts.length > 0 && (
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Hosts ({filteredHosts.length})</Text>
                    {filteredHosts.map((host) => (
                      <Pressable
                        key={host}
                        style={[styles.hostCard, themeStyles.hostCard]}
                        onPress={() => setQuery(host)}
                      >
                        <Text style={[styles.hostName, themeStyles.hostName]}>{host}</Text>
                        <Text style={[styles.hostCount, themeStyles.hostCount]}>
                          {recommendations.filter(r => r.host === host).length} recommendations
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </>
            )}
          </>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 12,
  },
  clearIcon: {
    padding: 4,
  },
  results: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  clearButton: {
    fontSize: 14,
    color: '#4689F3',
    fontWeight: '500',
  },
  recentSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentSearchChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  recentSearchText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '47%',
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
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#999',
  },
  hostCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  hostCount: {
    fontSize: 14,
    color: '#999',
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  header: { backgroundColor: '#121212' },
  title: { color: '#e5e5e5' },
  searchContainer: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  searchInput: { color: '#e5e5e5' },
  sectionTitle: { color: '#e5e5e5' },
  recentSearchChip: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  recentSearchText: { color: '#e5e5e5' },
  categoryCard: { backgroundColor: '#1e1e1e' },
  categoryName: { color: '#e5e5e5' },
  categoryCount: { color: '#888' },
  hostCard: { backgroundColor: '#1e1e1e' },
  hostName: { color: '#e5e5e5' },
  hostCount: { color: '#888' },
  emptyText: { color: '#e5e5e5' },
  emptySubtext: { color: '#888' },
});

