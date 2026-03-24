import { ApiRecommendation } from '../models/recommendation';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const PAGE_SIZE = 50;

export async function fetchRecommendations(offset: number = 0): Promise<ApiRecommendation[]> {
  const response = await fetch(`${API_BASE_URL}/recommendations?limit=${PAGE_SIZE}&offset=${offset}`);
  if (!response.ok) throw new Error(`Failed to fetch recommendations: ${response.status}`);
  return response.json();
}
