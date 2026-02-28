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

export const subscribeNewsletter = async (payload = {}) => {
  const response = await apiClient.post(API_ENDPOINTS.PUBLIC.SUBSCRIBE, payload);
  if (!response.success) {
    return {
      success: false,
      error: response.error || 'Unable to subscribe'
    };
  }
  return {
    success: true,
    data: response.data
  };
};

export const getCommunityProfiles = async (limit = 6) => {
  const response = await apiClient.get(`${API_ENDPOINTS.PUBLIC.COMMUNITY_PROFILES}?limit=${limit}`);
  if (!response.success) {
    return { success: false, error: response.error || 'Failed to load community profiles' };
  }
  return { success: true, data: response.data };
};

export const getLandingContent = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PUBLIC.LANDING_CONTENT);
  if (!response.success) {
    return { success: false, error: response.error || 'Failed to load landing content' };
  }
  return { success: true, data: response.data };
};
