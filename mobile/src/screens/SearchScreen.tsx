import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, ActivityIndicator, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { MainStackParamList } from '../navigation/types';
import { ApiRecommendation } from '../models/recommendation';
import { RecommendationCard } from '../components/RecommendationCard';
import { useFavorites } from '../context/FavoritesContext';
import { useCompleted } from '../context/CompletedContext';
import { useTheme } from '../context/ThemeContext';
import { fetchRecommendationsBySearch } from '../services/recommendationsApi';
import { storage } from '../utils/storage';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const { isDarkMode } = useTheme();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { isCompleted, toggleCompleted } = useCompleted();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const iconColor = isDarkMode ? '#888' : '#999';
  const placeholderColor = isDarkMode ? '#888' : '#999';

  useEffect(() => {
    storage.getRecentSearches().then(setRecentSearches);
  }, []);

  // Debounce query to avoid firing on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['recommendations', 'search', debouncedQuery],
    queryFn: () => fetchRecommendationsBySearch(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const addRecentSearch = async (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    await storage.saveRecentSearches(updated);
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await storage.saveRecentSearches([]);
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
  };

  const handleSubmitEditing = () => {
    if (query.trim()) addRecentSearch(query.trim());
  };

  const handleRecommendationClick = useCallback((recommendation: ApiRecommendation) => {
    navigation.navigate('RecommendationDetail', { recommendation });
  }, [navigation]);

  const renderItem: ListRenderItem<ApiRecommendation> = useCallback(({ item }) => (
    <RecommendationCard
      recommendation={item}
      isFavorited={isFavorited(String(item.id))}
      isCompleted={isCompleted(String(item.id))}
      onToggleFavorite={toggleFavorite}
      onToggleCompleted={toggleCompleted}
      onClick={handleRecommendationClick}
    />
  ), [isFavorited, isCompleted, toggleFavorite, toggleCompleted, handleRecommendationClick]);

  const showResults = debouncedQuery.length > 0;

  const listHeader = (
    <View style={[styles.header, { paddingTop: insets.top + 24 }, themeStyles.header]}>
      <Text style={[styles.title, themeStyles.title]}>Search</Text>

      <View style={[styles.searchContainer, themeStyles.searchContainer]}>
        <Ionicons name="search" size={20} color={iconColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, themeStyles.searchInput]}
          value={query}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          placeholder="Search recommendations..."
          placeholderTextColor={placeholderColor}
          autoFocus
          returnKeyType="search"
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close" size={20} color={iconColor} style={styles.clearIcon} />
          </Pressable>
        ) : null}
      </View>

      {!showResults && recentSearches.length > 0 ? (
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Recent Searches</Text>
            <Pressable onPress={clearRecentSearches}>
              <Text style={styles.clearButton}>Clear</Text>
            </Pressable>
          </View>
          <View style={styles.recentChips}>
            {recentSearches.map((search, index) => (
              <Pressable
                key={index}
                style={[styles.recentChip, themeStyles.recentChip]}
                onPress={() => setQuery(search)}
              >
                <Text style={[styles.recentChipText, themeStyles.recentChipText]}>{search}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {showResults && !isLoading ? (
        <Text style={[styles.resultsCount, themeStyles.resultsCount]}>
          {results.length} {results.length === 1 ? 'result' : 'results'} for "{debouncedQuery}"
        </Text>
      ) : null}
    </View>
  );

  const listEmpty = showResults ? (
    isLoading ? (
      <View style={styles.centeredState}>
        <ActivityIndicator size="large" color="#4689F3" />
      </View>
    ) : (
      <View style={styles.emptyState}>
        <Ionicons name="search-outline" size={64} color={iconColor} style={styles.emptyIcon} />
        <Text style={[styles.emptyText, themeStyles.emptyText]}>No results for "{debouncedQuery}"</Text>
        <Text style={[styles.emptySubtext, themeStyles.emptySubtext]}>Try a different keyword</Text>
      </View>
    )
  ) : null;

  return (
    <FlatList
      style={[styles.container, themeStyles.container]}
      contentContainerStyle={styles.content}
      data={showResults ? results : []}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={listEmpty}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    paddingBottom: 8,
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
    marginBottom: 16,
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
  recentSection: {
    marginBottom: 8,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  clearButton: {
    fontSize: 14,
    color: '#4689F3',
    fontWeight: '500',
  },
  recentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  recentChipText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  resultsCount: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  centeredState: {
    paddingVertical: 48,
    alignItems: 'center',
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
  recentChip: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  recentChipText: { color: '#e5e5e5' },
  resultsCount: { color: '#666' },
  emptyText: { color: '#e5e5e5' },
  emptySubtext: { color: '#888' },
});
