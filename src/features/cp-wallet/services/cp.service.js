import { API_ENDPOINTS } from '../../../config/api/api.config';
import { apiClient } from '../../../shared/services/api.client';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';

export const getCpBalance = async () => {
  const response = await apiClient.get(API_ENDPOINTS.CP.BALANCE);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const getCpTransactions = async (limit = 20) => {
  const response = await apiClient.get(`${API_ENDPOINTS.CP.TRANSACTIONS}?limit=${limit}`);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};
