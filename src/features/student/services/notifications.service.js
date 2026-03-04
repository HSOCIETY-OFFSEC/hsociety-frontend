import { API_ENDPOINTS, buildEndpoint } from '../../../config/api.config';
import { apiClient } from '../../../shared/services/api.client';

export const listNotifications = async () => {
  const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
  if (response.success) return { success: true, data: response.data || [] };
  return { success: false, error: response.error || 'Failed to load notifications' };
};

export const markNotificationRead = async (id) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.NOTIFICATIONS.MARK_READ, { id });
  const response = await apiClient.post(endpoint, {});
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: response.error || 'Failed to mark notification' };
};

export const markAllNotificationsRead = async () => {
  const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {});
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: response.error || 'Failed to mark all notifications' };
};

export default {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};
