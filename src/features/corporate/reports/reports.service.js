/**
 * Reports service
 * Location: src/features/corporate/reports/reports.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api.config';
import { normalizeReports } from './reports.contract';

const mockReports = [
  {
    id: 'rpt-2026-001',
    title: 'Enterprise Web Application Report',
    engagementName: 'Enterprise Web Application',
    date: Date.now() - (3 * 24 * 60 * 60 * 1000),
    status: 'Final',
    downloadUrl: ''
  },
  {
    id: 'rpt-2026-002',
    title: 'Cloud Infrastructure Assessment',
    engagementName: 'Cloud Infrastructure',
    date: Date.now() - (9 * 24 * 60 * 60 * 1000),
    status: 'Draft',
    downloadUrl: ''
  },
  {
    id: 'rpt-2026-003',
    title: 'Payments API Retest',
    engagementName: 'Payments API',
    date: Date.now() - (20 * 24 * 60 * 60 * 1000),
    status: 'Retest',
    downloadUrl: ''
  }
];

export const getReports = async () => {
  const response = await apiClient.get(API_ENDPOINTS.REPORTS.LIST);
  if (response.success) {
    const payload = Array.isArray(response.data) ? response.data : response.data?.items || [];
    return {
      success: true,
      data: normalizeReports(payload)
    };
  }

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: normalizeReports(mockReports),
      isMock: true
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to load reports'
  };
};

export default {
  getReports
};
