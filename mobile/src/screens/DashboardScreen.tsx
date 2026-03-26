import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../navigation/types';
import { ApiRecommendation } from '../models/recommendation';
import { RecommendationCard } from '../components/RecommendationCard';
import { CategoryPicksSection } from '../components/CategoryPicksSection';
import { useFavorites } from '../context/FavoritesContext';
import { useCompleted } from '../context/CompletedContext';
import { useTheme } from '../context/ThemeContext';
import { useRecommendations } from '../hooks/useRecommendations';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { isDarkMode } = useTheme();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { isCompleted, toggleCompleted } = useCompleted();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useRecommendations();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const searchIconColor = isDarkMode ? '#888' : '#999';
  const placeholderColor = isDarkMode ? '#888' : '#999';

  const recommendations = data?.pages.flat() ?? [];

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

  const handleEndReached = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const listHeader = useMemo(() => (
    <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
      <Text style={[styles.title, themeStyles.title]}>Freshly Picked</Text>
      <Pressable
        style={[styles.searchButton, themeStyles.searchButton]}
        onPress={() => navigation.navigate('Search')}
      >
        <Ionicons name="search" size={20} color={searchIconColor} style={styles.searchIcon} />
        <Text style={[styles.searchPlaceholder, { color: placeholderColor }]}>Search recommendations...</Text>
      </Pressable>
      <View style={styles.categorySections}>
        <CategoryPicksSection sectionTitle="Books" categorySlug="book" />
        <CategoryPicksSection sectionTitle="TV" categorySlug="tv" />
      </View>
      <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>All Picks</Text>
    </View>
  ), [insets.top, themeStyles, searchIconColor, placeholderColor, navigation]);

  const listEmpty = useMemo(() => isLoading ? (
    <View style={styles.centeredState}>
      <ActivityIndicator size="large" color="#4689F3" />
    </View>
  ) : isError ? (
    <View style={styles.centeredState}>
      <Text style={[styles.stateText, themeStyles.stateText]}>Failed to load recommendations.</Text>
    </View>
  ) : (
    <View style={styles.centeredState}>
      <Text style={[styles.stateText, themeStyles.stateText]}>No picks yet.</Text>
    </View>
  ), [isLoading, isError, themeStyles]);

  const listFooter = useMemo(() => isFetchingNextPage ? (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="small" color="#4689F3" />
    </View>
  ) : null, [isFetchingNextPage]);

  return (
    <FlatList
      style={[styles.container, themeStyles.container]}
      contentContainerStyle={styles.content}
      data={recommendations}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={listEmpty}
      ListFooterComponent={listFooter}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 28,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#999',
    flex: 1,
  },
  categorySections: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 8,
    marginBottom: 16,
  },
  centeredState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  stateText: {
    fontSize: 16,
    color: '#999',
  },
  footerLoader: {
    paddingVertical: 24,
    alignItems: 'center',
  },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  title: { color: '#e5e5e5' },
  searchButton: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  sectionTitle: { color: '#e5e5e5' },
  stateText: { color: '#666' },
});
