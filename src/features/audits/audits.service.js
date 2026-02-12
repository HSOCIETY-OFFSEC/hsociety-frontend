/**
 * Audits service
 * Location: src/features/audits/audits.service.js
 */

import { API_ENDPOINTS, buildEndpoint } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';
import { normalizeAudits } from './audits.contract';

const mockAudits = [
  {
    id: '1',
    title: 'Q4 2024 Security Assessment',
    type: 'Web Application',
    date: Date.now() - (5 * 24 * 60 * 60 * 1000),
    status: 'completed',
    severity: { critical: 2, high: 5, medium: 12, low: 8, info: 15 },
    remediationProgress: 65,
    tester: 'Security Team A',
    reportAvailable: true
  },
  {
    id: '2',
    title: 'Network Infrastructure Audit',
    type: 'Network',
    date: Date.now() - (15 * 24 * 60 * 60 * 1000),
    status: 'in-review',
    severity: { critical: 0, high: 3, medium: 7, low: 5, info: 10 },
    remediationProgress: 40,
    tester: 'Security Team B',
    reportAvailable: false
  },
  {
    id: '3',
    title: 'Mobile App Security Scan',
    type: 'Mobile Application',
    date: Date.now() - (30 * 24 * 60 * 60 * 1000),
    status: 'completed',
    severity: { critical: 1, high: 4, medium: 9, low: 11, info: 20 },
    remediationProgress: 100,
    tester: 'Security Team C',
    reportAvailable: true
  },
  {
    id: '4',
    title: 'API Security Assessment',
    type: 'API',
    date: Date.now() - (45 * 24 * 60 * 60 * 1000),
    status: 'completed',
    severity: { critical: 0, high: 2, medium: 6, low: 8, info: 12 },
    remediationProgress: 85,
    tester: 'Security Team A',
    reportAvailable: true
  }
];

export const getAudits = async () => {
  const response = await apiClient.get(API_ENDPOINTS.AUDITS.LIST);
  if (response.success) {
    return {
      success: true,
      data: normalizeAudits(Array.isArray(response.data) ? response.data : response.data?.items || [])
    };
  }

  if (import.meta.env.DEV) {
    return { success: true, data: normalizeAudits(mockAudits), isMock: true };
  }

  return { success: false, error: response.error || 'Failed to load audits' };
};

export const downloadAuditReport = async (auditId) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.AUDITS.DOWNLOAD, { id: auditId });
  const filename = `audit-report-${auditId}.pdf`;
  const response = await apiClient.download(endpoint, filename);
  return response;
};

export default {
  getAudits,
  downloadAuditReport
};
