/**
 * Engagements service
 * Location: src/features/corporate/engagements/engagements.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api.config';
import { normalizeEngagements } from './engagements.contract';

const mockActiveEngagements = [
  {
    id: 'eng-1001',
    name: 'Enterprise Web Application',
    scope: 'Web Applications, APIs, CI/CD pipelines',
    status: 'recon',
    startDate: Date.now() - (5 * 24 * 60 * 60 * 1000),
    expectedCompletion: Date.now() + (7 * 24 * 60 * 60 * 1000),
    summary: 'Full-stack engagement covering website, APIs, and automation.',
    budget: 4200
  },
  {
    id: 'eng-1027',
    name: 'Cloud Infrastructure',
    scope: 'Azure, Identity, and Storage',
    status: 'exploitation',
    startDate: Date.now() - (10 * 24 * 60 * 60 * 1000),
    expectedCompletion: Date.now() + (2 * 24 * 60 * 60 * 1000),
    summary: 'Hybrid cloud scope with emphasis on secure identity flows.',
    budget: 5600
  }
];

const mockPastEngagements = [
  {
    id: 'eng-0894',
    name: 'Payments API',
    scope: 'API endpoints, authentication, and logging',
    status: 'reporting',
    startDate: Date.now() - (40 * 24 * 60 * 60 * 1000),
    expectedCompletion: Date.now() - (30 * 24 * 60 * 60 * 1000),
    summary: 'Focused API pentest with regulatory reporting deliverables.',
    budget: 3800
  },
  {
    id: 'eng-0741',
    name: 'Mobile Application',
    scope: 'Android and iOS clients, backend services',
    status: 'completed',
    startDate: Date.now() - (90 * 24 * 60 * 60 * 1000),
    expectedCompletion: Date.now() - (72 * 24 * 60 * 60 * 1000),
    summary: 'Post-release validation with retest plan ready.',
    budget: 6100
  }
];

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

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: {
        active: normalizeEngagements(mockActiveEngagements),
        past: normalizeEngagements(mockPastEngagements)
      },
      isMock: true
    };
  }

  return {
    success: false,
    error: response.error || 'Unable to load engagement data'
  };
};

export const requestEngagement = async (details) => {
  const payload = { ...details };
  const response = await apiClient.post(API_ENDPOINTS.ENGAGEMENTS.REQUEST, payload);
  if (response.success) {
    return { success: true, data: response.data };
  }

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: {
        invoiceId: `INV-${Date.now()}`
      },
      isMock: true
    };
  }

  return { success: false, error: response.error || 'Failed to request engagement' };
};

export default {
  getEngagements,
  requestEngagement
};
