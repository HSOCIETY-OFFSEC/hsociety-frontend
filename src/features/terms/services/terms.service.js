import { API_ENDPOINTS } from '../../../config/api/api.config';
import { apiClient } from '../../../shared/services/api.client';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';

export const getTermsContent = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PUBLIC.TERMS_CONTENT);
  if (!response.success) {
    return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
  }
  return { success: true, data: response.data };
};
