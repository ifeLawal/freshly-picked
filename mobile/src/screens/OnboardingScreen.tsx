import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { storage } from '../utils/storage';
import { recommendations, episodes } from '../data/mockData';
import { Recommendation, Episode } from '../data/mockData';
import { MainStackParamList, MainTabParamList } from '../navigation/types';
import { NavigatorScreenParams } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const slides: { title: string; description: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  {
    title: 'Welcome to After Hours Picks',
    description: 'Your centralized hub for all the books, articles, restaurants, and other recommendations from the After Hours podcast.',
    icon: 'mic',
  },
  {
    title: 'Listen & Discover',
    description: 'Play audio clips of the exact moment each recommendation was made. Rediscover the context and excitement.',
    icon: 'headset',
  },
  {
    title: 'Save Your Favorites',
    description: 'Build your personal library of recommendations. Bookmark what resonates and revisit anytime.',
    icon: 'star',
  },
];

export function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation<NavigationProp>();
  const recommendation: Recommendation = recommendations[1]
  const recommendationTab: NavigatorScreenParams<MainTabParamList> = {
    screen: "DashboardTab",
    params: {
      screen: "RecommendationDetail",
      params: { recommendation: recommendation },
    },
  }

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      await storage.setOnboardingCompleted(true);
      navigation.replace('MainApp', recommendationTab);
    }
  };

  const handleSkip = async () => {
    await storage.setOnboardingCompleted(true);
    navigation.replace('MainApp', recommendationTab);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <Ionicons name={slides[currentSlide].icon} size={80} color="white" />
          </View>
          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <Text style={styles.description}>{slides[currentSlide].description}</Text>

          {/* Progress Dots */}
          <View style={styles.dotsContainer}>
            {slides.map((_, index) => (
              <Pressable
                key={index}
                onPress={() => setCurrentSlide(index)}
                style={[
                  styles.dot,
                  index === currentSlide && styles.dotActive,
                  index === currentSlide && { width: 24 },
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#4689F3" style={styles.chevron} />
        </Pressable>

        {currentSlide < slides.length - 1 && (
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4689F3',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  content: {
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: 'white',
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  nextButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  nextButtonText: {
    color: '#4689F3',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
  skipButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
});

