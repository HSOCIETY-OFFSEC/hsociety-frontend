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

export const updateAvatar = async (avatarUrl) => {
  const response = await apiClient.put(API_ENDPOINTS.PROFILE.AVATAR, { avatarUrl });
  if (response.success) {
    return { success: true, data: response.data };
  }
  return { success: false, error: response.error || 'Failed to update avatar' };
};

export const removeAvatar = async () => {
  const response = await apiClient.delete(API_ENDPOINTS.PROFILE.AVATAR);
  if (response.success) {
    return { success: true, data: response.data };
  }
  return { success: false, error: response.error || 'Failed to remove avatar' };
};

// SECURITY UPDATE IMPLEMENTED: Change password (strong validation on backend)
export const changePassword = async (currentPassword, newPassword) => {
  const response = await apiClient.put(API_ENDPOINTS.PROFILE.PASSWORD, {
    currentPassword,
    newPassword,
  });
  if (response.success) {
    return { success: true };
  }
  return { success: false, error: response.error || 'Failed to change password' };
};

export default {
  deleteAccount,
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
};
