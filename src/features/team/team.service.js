import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';

export const getTeamContent = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PUBLIC.TEAM_CONTENT);
  if (!response.success) {
    return { success: false, error: response.error || 'Failed to load team content' };
  }
  return { success: true, data: response.data || {} };
};
