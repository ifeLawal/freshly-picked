import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { ApiRecommendation } from '../models/recommendation';
import { useRecommendationsByCategory } from '../hooks/useRecommendationsByCategory';
import { useTheme } from '../context/ThemeContext';

interface CategoryPicksSectionProps {
  sectionTitle: string;
  categorySlug: string;
}

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const CARD_WIDTH = 130;
const IMAGE_HEIGHT = 170;

export function CategoryPicksSection({ sectionTitle, categorySlug }: CategoryPicksSectionProps) {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { data: recommendations, isLoading } = useRecommendationsByCategory(categorySlug);
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>{sectionTitle}</Text>
        <Pressable onPress={() => navigation.navigate('CategoryList', { category: categorySlug })}>
          <Text style={styles.exploreText}>Explore</Text>
        </Pressable>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4689F3" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {(recommendations ?? []).slice(0, 10).map((item) => (
            <Pressable
              key={item.id}
              style={[styles.card, themeStyles.card]}
              onPress={() => navigation.navigate('RecommendationDetail', { recommendation: item })}
            >
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={[styles.imagePlaceholder, themeStyles.imagePlaceholder]} />
              )}
              <Text style={[styles.cardTitle, themeStyles.cardTitle]} numberOfLines={2}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  exploreText: {
    fontSize: 14,
    color: '#4689F3',
    fontWeight: '500',
  },
  loadingContainer: {
    height: IMAGE_HEIGHT + 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    gap: 12,
    paddingRight: 4,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
  },
  imagePlaceholder: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: '#e8f0fe',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1a1a1a',
    padding: 8,
    paddingBottom: 10,
  },
});

const darkStyles = StyleSheet.create({
  sectionTitle: { color: '#e5e5e5' },
  card: { backgroundColor: '#1e1e1e' },
  imagePlaceholder: { backgroundColor: '#2a2a2a' },
  cardTitle: { color: '#e5e5e5' },
});
