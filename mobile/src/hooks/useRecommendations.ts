import { useQuery } from '@tanstack/react-query';
import { fetchRecommendations } from '../services/recommendationsApi';
import { ApiRecommendation } from '../models/recommendation';

export function useRecommendations() {
  return useQuery<ApiRecommendation[]>({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
  });
}
