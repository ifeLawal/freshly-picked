import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchRecommendations, PAGE_SIZE } from '../services/recommendationsApi';
import { ApiRecommendation } from '../models/recommendation';

export function useRecommendations() {
  return useInfiniteQuery<ApiRecommendation[]>({
    queryKey: ['recommendations'],
    queryFn: ({ pageParam }) => fetchRecommendations(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.reduce((total, page) => total + page.length, 0);
    },
  });
}
