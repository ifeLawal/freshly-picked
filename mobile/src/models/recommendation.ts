export interface ApiHostSummary {
  id: number;
  name: string;
  slug: string;
}

export interface ApiEpisodeSummary {
  id: number;
  slug: string;
  title: string;
  season: number;
  episode_number: number;
}

export interface ApiCategorySummary {
  id: number;
  name: string;
  slug: string;
}

export interface ApiTagSummary {
  id: number;
  name: string;
  slug: string;
}

export interface ApiRecommendation {
  id: number;
  slug: string;
  title: string;
  image_url: string | null;
  has_audio: boolean;
  audio_clip_url: string | null;
  host: ApiHostSummary | null;
  episode: ApiEpisodeSummary | null;
  category: ApiCategorySummary | null;
}

export interface ApiRecommendationDetail extends ApiRecommendation {
  why_recommended: string | null;
  external_url: string | null;
  audio_start_seconds: number | null;
  audio_end_seconds: number | null;
  tags: ApiTagSummary[];
}
