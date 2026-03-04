import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';
import { getPublicErrorMessage } from '../../shared/utils/publicError';

export const getLeaderboard = async (limit = 25) => {
  const endpoint = API_ENDPOINTS.PUBLIC?.LEADERBOARD || '/public/leaderboard';
  const response = await apiClient.get(`${endpoint}?limit=${limit}`);
  if (!response.success) {
    return {
      success: false,
      error: getPublicErrorMessage({ action: 'load', response })
    };
  }
  return { success: true, data: response.data };
};

export default {
  getLeaderboard
};
