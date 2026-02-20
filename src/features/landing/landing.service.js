import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';

export const getLandingStats = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PUBLIC.LANDING_STATS);

  if (!response.success) {
    return {
      success: false,
      error: response.error || 'Failed to load landing stats'
    };
  }

  return {
    success: true,
    data: response.data
  };
};
