export interface Recommendation {
  id: string;
  title: string;
  category: 'Book' | 'Article' | 'Activity' | 'Tech' | 'Ideas' | 'Food';
  description: string;
  host: string;
  episodeId: string;
  episodeTitle: string;
  season: number;
  episode: number;
  date: string;
  /** When absent or empty, no audio clip is available yet (show "Coming Soon" in UI). */
  audioUrl?: string;
  duration?: number; // in seconds (only relevant when audioUrl is set)
  imageUrl?: string;
}

export interface Episode {
  id: string;
  title: string;
  season: number;
  episode: number;
  date: string;
  description: string;
  recommendationIds: string[];
  thumbnailUrl?: string;
}

export const episodes: Episode[] = [
  {
    id: 'ep-1',
    title: 'Who Is Afraid of Woke Capitalism?',
    season: 6,
    episode: 7,
    date: '2022-11-02',
    description: '',
    recommendationIds: ['rec-1', 'rec-2', 'rec-3'],
  },
]

export const recommendations: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Dentyne Gum',
    category: 'Food',
    description: '',
    host: 'Felix',
    episodeId: 'ep-1',
    episodeTitle: 'Who Is Afraid of Woke Capitalism?',
    season: 6,
    episode: 7,
    date: '2022-11-02',
    audioUrl: require('../../assets/audio/After_Hours_S6_EP06_Dentyne_Gum.m4a'),
    duration: 100,
    imageUrl: require('../../assets/Dentyne.png'),
  },
  {
    id: 'rec-2',
    title: 'Pickleball',
    category: 'Activity',
    description: '',
    host: 'Dolly Chugh',
    episodeId: 'ep-1',
    episodeTitle: 'Who Is Afraid of Woke Capitalism?',
    season: 6,
    episode: 7,
    date: '2022-11-02',
    audioUrl: require('../../assets/audio/After_Hours_S6_EP06_Pickleball.m4a'),
    duration: 100,
  },
  {
    id: 'rec-3',
    title: 'Rosetta Bakery',
    category: 'Food',
    description: '',
    host: 'Mihir',
    episodeId: 'ep-1',
    episodeTitle: 'Who Is Afraid of Woke Capitalism?',
    season: 6,
    episode: 7,
    date: '2022-11-02',
  },
]

export const categories = [
  { name: 'Food', icon: 'restaurant' as const, count: recommendations.filter(r => r.category === 'Food').length },
  { name: 'Book', icon: 'book' as const, count: recommendations.filter(r => r.category === 'Book').length },
  { name: 'Tech', icon: 'laptop-outline' as const, count: recommendations.filter(r => r.category === 'Tech').length },
  { name: 'Activity', icon: 'bicycle-outline' as const, count: recommendations.filter(r => r.category === 'Activity').length },
  { name: 'Article', icon: 'newspaper-outline' as const, count: recommendations.filter(r => r.category === 'Article').length },
  { name: 'Ideas', icon: 'bulb-outline' as const, count: recommendations.filter(r => r.category === 'Ideas').length },
];

