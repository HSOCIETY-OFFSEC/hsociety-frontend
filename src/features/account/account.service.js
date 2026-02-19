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

export default {
  deleteAccount,
};
