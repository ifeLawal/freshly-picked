import { NavigatorScreenParams } from '@react-navigation/native';
import { Recommendation, Episode } from '../data/mockData';

export type RootStackParamList = {
  Onboarding: undefined;
  MainApp: NavigatorScreenParams<MainTabParamList>;
};

export type MainTabParamList = {
  DashboardTab: NavigatorScreenParams<MainStackParamList>;
  EpisodesTab: NavigatorScreenParams<MainStackParamList>;
  SearchTab: NavigatorScreenParams<MainStackParamList>;
  FavoritesTab: NavigatorScreenParams<MainStackParamList>;
  SettingsTab: NavigatorScreenParams<MainStackParamList>;
};

export type MainStackParamList = {
  Dashboard?: undefined;
  Episodes?: undefined;
  Search?: undefined;
  Favorites?: undefined;
  Settings?: undefined;
  RecommendationDetail: { recommendation: Recommendation };
  EpisodeDetail: { episode: Episode };
  CategoryList: { category: string };
};

