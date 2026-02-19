/**
 * Admin service
 * Location: src/features/admin/admin.service.js
 */
import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';

export const getUsers = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS);
  if (response.success) {
    return { success: true, data: response.data || [] };
  }
  return { success: false, error: response.error || 'Failed to fetch users' };
};

export const updateUser = async (userId, updates) => {
  const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`, updates);
  if (response.success) {
    return { success: true, data: response.data };
  }
  return { success: false, error: response.error || 'Failed to update user' };
};

export default {
  getUsers,
  updateUser,
};
