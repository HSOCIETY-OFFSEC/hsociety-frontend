/**
 * Remediation service
 * Location: src/features/corporate/remediation/remediation.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api/api.config';
import {
  normalizeRemediationSummary,
  normalizeRemediationReports
} from './remediation.contract';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';


export const getRemediationSummary = async () => {
  const response = await apiClient.get(API_ENDPOINTS.REMEDIATION.SUMMARY);
  if (response.success) {
    return {
      success: true,
      data: normalizeRemediationSummary(response.data || {})
    };
  }

  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const getRemediationReports = async () => {
  const response = await apiClient.get(API_ENDPOINTS.REMEDIATION.REPORTS);
  if (response.success) {
    const payload = Array.isArray(response.data) ? response.data : response.data?.items || [];
    return {
      success: true,
      data: normalizeRemediationReports(payload)
    };
  }

  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export default {
  getRemediationSummary,
  getRemediationReports
};
