/**
 * Account service
 */
import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';

export const deleteAccount = async () => {
  const response = await apiClient.delete(API_ENDPOINTS.PROFILE.DELETE);
  if (response.success) {
    return { success: true };
  }
  return { success: false, error: response.error || 'Failed to delete account' };
};

export const updateProfile = async (updates) => {
  const response = await apiClient.put(API_ENDPOINTS.PROFILE.UPDATE, updates);
  if (response.success) {
    return { success: true, data: response.data };
  }
  return { success: false, error: response.error || 'Failed to update profile' };
};

export default {
  deleteAccount,
  updateProfile,
};
