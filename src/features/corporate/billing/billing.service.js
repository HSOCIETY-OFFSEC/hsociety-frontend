/**
 * Billing service
 * Location: src/features/corporate/billing/billing.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api.config';
import {
  normalizeAgreements,
  normalizeInvoices
} from './billing.contract';

const mockInvoices = [
  {
    id: 'INV-2026-001',
    engagementName: 'Enterprise Web Application',
    date: Date.now() - (20 * 24 * 60 * 60 * 1000),
    amount: 4800,
    status: 'Paid',
    downloadUrl: ''
  },
  {
    id: 'INV-2026-002',
    engagementName: 'Cloud Infrastructure',
    date: Date.now() - (10 * 24 * 60 * 60 * 1000),
    amount: 5600,
    status: 'Pending',
    downloadUrl: ''
  },
  {
    id: 'INV-2026-003',
    engagementName: 'Mobile Application',
    date: Date.now() - (40 * 24 * 60 * 60 * 1000),
    amount: 6100,
    status: 'Failed',
    downloadUrl: ''
  }
];

const mockAgreements = [
  {
    id: 'AGR-2026-01',
    title: 'Enterprise Web Engagement Agreement',
    date: Date.now() - (20 * 24 * 60 * 60 * 1000),
    downloadUrl: ''
  },
  {
    id: 'AGR-2026-02',
    title: 'Cloud Infrastructure Scope Agreement',
    date: Date.now() - (12 * 24 * 60 * 60 * 1000),
    downloadUrl: ''
  }
];

export const getInvoices = async () => {
  const response = await apiClient.get(API_ENDPOINTS.BILLING.INVOICES);
  if (response.success) {
    const payload = Array.isArray(response.data) ? response.data : response.data?.items || [];
    return { success: true, data: normalizeInvoices(payload) };
  }

  if (import.meta.env.DEV) {
    return { success: true, data: normalizeInvoices(mockInvoices), isMock: true };
  }

  return { success: false, error: response.error || 'Failed to load invoices' };
};

export const getAgreements = async () => {
  const response = await apiClient.get(API_ENDPOINTS.BILLING.AGREEMENTS);
  if (response.success) {
    const payload = Array.isArray(response.data) ? response.data : response.data?.items || [];
    return { success: true, data: normalizeAgreements(payload) };
  }

  if (import.meta.env.DEV) {
    return { success: true, data: normalizeAgreements(mockAgreements), isMock: true };
  }

  return { success: false, error: response.error || 'Failed to load agreements' };
};

export default {
  getInvoices,
  getAgreements
};
