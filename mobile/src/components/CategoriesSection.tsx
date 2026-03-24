import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../data/mockData';

interface CategoriesSectionProps {
  onCategoryPress: (category: string) => void;
}

export function CategoriesSection({ onCategoryPress }: CategoriesSectionProps) {
  const { isDarkMode } = useTheme();
  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Browse by Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <Pressable
              key={category.name}
              style={[styles.categoryCard, themeStyles.categoryCard]}
              onPress={() => onCategoryPress(category.name)}
            >
              <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={28} color="#4689F3" style={styles.categoryIcon} />
              <Text style={[styles.categoryName, themeStyles.categoryName]}>{category.name}</Text>
              <Text style={[styles.categoryCount, themeStyles.categoryCount]}>{category.count} picks</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  categoriesScroll: {
    paddingLeft: 24,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 24,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minWidth: 120,
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
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#999',
  },
});

const darkStyles = StyleSheet.create({
  sectionTitle: { color: '#e5e5e5' },
  categoryCard: { backgroundColor: '#1e1e1e' },
  categoryName: { color: '#e5e5e5' },
  categoryCount: { color: '#888' },
});
