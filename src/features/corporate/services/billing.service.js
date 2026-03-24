/**
 * Billing service
 * Location: src/features/corporate/billing/billing.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api/api.config';
import {
  normalizeAgreements,
  normalizeInvoices
} from './billing.contract';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';


export const getInvoices = async () => {
  const response = await apiClient.get(API_ENDPOINTS.BILLING.INVOICES);
  if (response.success) {
    const payload = Array.isArray(response.data) ? response.data : response.data?.items || [];
    return { success: true, data: normalizeInvoices(payload) };
  }

  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const getAgreements = async () => {
  const response = await apiClient.get(API_ENDPOINTS.BILLING.AGREEMENTS);
  if (response.success) {
    const payload = Array.isArray(response.data) ? response.data : response.data?.items || [];
    return { success: true, data: normalizeAgreements(payload) };
  }

  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export default {
  getInvoices,
  getAgreements
};
