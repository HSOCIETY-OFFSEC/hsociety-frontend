/**
 * Reports service
 * Location: src/features/corporate/reports/reports.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api/api.config';
import { normalizeReports } from './reports.contract';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';


export const getReports = async () => {
  const response = await apiClient.get(API_ENDPOINTS.REPORTS.LIST);
  if (response.success) {
    const payload = Array.isArray(response.data) ? response.data : response.data?.items || [];
    return {
      success: true,
      data: normalizeReports(payload)
    };
  }

  return {
    success: false,
    error: getPublicErrorMessage({ action: 'load', response })
  };
};

export default {
  getReports
};
