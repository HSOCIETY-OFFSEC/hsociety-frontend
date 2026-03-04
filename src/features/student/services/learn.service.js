import { API_ENDPOINTS } from '../../../config/api.config';
import { apiClient } from '../../../shared/services/api.client';

export const getFreeResources = async () => {
  const response = await apiClient.get(API_ENDPOINTS.STUDENT.FREE_RESOURCES);
  if (response.success) return { success: true, data: response.data || { items: [] } };
  return { success: false, error: response.error || 'Failed to load free resources' };
};

export const getStudentXpSummary = async () => {
  const response = await apiClient.get(API_ENDPOINTS.STUDENT.XP_SUMMARY);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: response.error || 'Failed to load XP summary' };
};

export default {
  getFreeResources,
  getStudentXpSummary,
};
