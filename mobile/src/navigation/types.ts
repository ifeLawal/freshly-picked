import { NavigatorScreenParams } from '@react-navigation/native';
import { Episode } from '../data/mockData';
import { ApiRecommendation } from '../models/recommendation';

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
  RecommendationDetail: { recommendation: ApiRecommendation };
  EpisodeDetail: { episode: Episode };
  CategoryList: { category: string };
};

