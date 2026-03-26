import { API_ENDPOINTS } from '../../../config/api/api.config';
import { apiClient } from '../../../shared/services/api.client';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';

export const getPublicProducts = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PUBLIC.CP_PRODUCTS);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const getPublicFreeResources = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PUBLIC.FREE_RESOURCES);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const purchaseProduct = async (productId) => {
  const response = await apiClient.post(API_ENDPOINTS.CP.PURCHASE, { productId });
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'submit', response }) };
};
