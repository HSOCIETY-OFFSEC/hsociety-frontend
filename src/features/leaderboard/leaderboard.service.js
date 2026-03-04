import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';

export const getLeaderboard = async (limit = 25) => {
  const endpoint = API_ENDPOINTS.PUBLIC?.LEADERBOARD || '/public/leaderboard';
  const response = await apiClient.get(`${endpoint}?limit=${limit}`);
  if (!response.success) {
    return {
      success: false,
      error: response.error || 'Failed to load leaderboard'
    };
  }
  return { success: true, data: response.data };
};

export default {
  getLeaderboard
};
