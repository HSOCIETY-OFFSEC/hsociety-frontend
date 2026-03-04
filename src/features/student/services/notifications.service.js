import { API_ENDPOINTS, buildEndpoint } from '../../../config/api.config';
import { apiClient } from '../../../shared/services/api.client';
import { getPublicErrorMessage } from '../../../shared/utils/publicError';

export const listNotifications = async () => {
  const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
  if (response.success) return { success: true, data: response.data || [] };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const markNotificationRead = async (id) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.NOTIFICATIONS.MARK_READ, { id });
  const response = await apiClient.post(endpoint, {});
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'save', response }) };
};

export const markAllNotificationsRead = async () => {
  const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {});
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'save', response }) };
};

export default {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};
