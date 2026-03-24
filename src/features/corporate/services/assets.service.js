/**
 * Assets service
 * Location: src/features/corporate/assets/assets.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api/api.config';
import { normalizeAssets } from './assets.contract';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';


export const getAssets = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ASSETS.LIST);
  if (response.success) {
    const payload = Array.isArray(response.data) ? response.data : response.data?.items || [];
    return {
      success: true,
      data: normalizeAssets(payload)
    };
  }

  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export default {
  getAssets
};
