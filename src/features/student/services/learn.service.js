import { API_ENDPOINTS } from '../../../config/api.config';
import { apiClient } from '../../../shared/services/api.client';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';

export const getFreeResources = async () => {
  const response = await apiClient.get(API_ENDPOINTS.STUDENT.FREE_RESOURCES);
  if (response.success) return { success: true, data: response.data || { items: [] } };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const getStudentXpSummary = async () => {
  const response = await apiClient.get(API_ENDPOINTS.STUDENT.XP_SUMMARY);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export default {
  getFreeResources,
  getStudentXpSummary,
};
