/**
 * Remediation service
 * Location: src/features/corporate/remediation/remediation.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api.config';
import {
  normalizeRemediationSummary,
  normalizeRemediationReports
} from './remediation.contract';

const mockSummary = {
  totalVulnerabilities: 128,
  fixedVulnerabilities: 89,
  openVulnerabilities: 39,
  remediationRate: 71
};

const mockReports = [
  {
    id: 'rem-0101',
    title: 'Remediation Playbook Q1',
    generatedOn: Date.now() - (5 * 24 * 60 * 60 * 1000),
    owner: 'HSOCIETY Recovery Team',
    downloadUrl: ''
  },
  {
    id: 'rem-0102',
    title: 'API Remediation Report',
    generatedOn: Date.now() - (9 * 24 * 60 * 60 * 1000),
    owner: 'HSOCIETY Recovery Team',
    downloadUrl: ''
  }
];

export const getRemediationSummary = async () => {
  const response = await apiClient.get(API_ENDPOINTS.REMEDIATION.SUMMARY);
  if (response.success) {
    return {
      success: true,
      data: normalizeRemediationSummary(response.data || {})
    };
  }

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: normalizeRemediationSummary(mockSummary),
      isMock: true
    };
  }

  return { success: false, error: response.error || 'Failed to load remediation summary' };
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

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: normalizeRemediationReports(mockReports),
      isMock: true
    };
  }

  return { success: false, error: response.error || 'Failed to load remediation reports' };
};

export default {
  getRemediationSummary,
  getRemediationReports
};
