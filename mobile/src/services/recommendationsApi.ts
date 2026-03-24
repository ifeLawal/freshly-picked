import { ApiRecommendation } from '../models/recommendation';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function fetchRecommendations(): Promise<ApiRecommendation[]> {
  const response = await fetch(`${API_BASE_URL}/recommendations`);
  if (!response.ok) throw new Error(`Failed to fetch recommendations: ${response.status}`);
  return response.json();
}
