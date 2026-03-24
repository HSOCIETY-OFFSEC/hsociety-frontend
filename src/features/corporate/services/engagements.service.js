/**
 * Engagements service
 * Location: src/features/corporate/engagements/engagements.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api/api.config';
import { normalizeEngagements } from './engagements.contract';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';


export const getEngagements = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ENGAGEMENTS.LIST);
  if (response.success) {
    const payload = response.data || { active: [], past: [] };
    return {
      success: true,
      data: {
        active: normalizeEngagements(payload.active || []),
        past: normalizeEngagements(payload.past || [])
      }
    };
  }

  return {
    success: false,
    error: getPublicErrorMessage({ action: 'load', response })
  };
};

export const requestEngagement = async (details) => {
  const payload = { ...details };
  const response = await apiClient.post(API_ENDPOINTS.ENGAGEMENTS.REQUEST, payload);
  if (response.success) {
    return { success: true, data: response.data };
  }

  return { success: false, error: getPublicErrorMessage({ action: 'submit', response }) };
};

export default {
  getEngagements,
  requestEngagement
};
