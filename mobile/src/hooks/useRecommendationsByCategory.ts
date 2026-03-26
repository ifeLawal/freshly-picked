import { useQuery } from '@tanstack/react-query';
import { fetchRecommendationsByCategory } from '../services/recommendationsApi';
import { ApiRecommendation } from '../models/recommendation';

export function useRecommendationsByCategory(categorySlug: string) {
  return useQuery<ApiRecommendation[]>({
    queryKey: ['recommendations', 'category', categorySlug],
    queryFn: () => fetchRecommendationsByCategory(categorySlug),
  });
}
