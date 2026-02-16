/**
 * Dashboard Service
 * Location: src/features/dashboard/dashboard.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api.config';
import {
  normalizeDashboardOverview,
  normalizeDashboardStats,
  normalizeRecentActivity
} from './dashboard.contract';

const mockStats = {
  activePentests: 3,
  completedAudits: 12,
  pendingReports: 2,
  vulnerabilitiesFound: 47,
  remediationRate: 68
};

const mockRecentActivity = [
  {
    id: '1',
    type: 'pentest',
    title: 'Web Application Pentest',
    status: 'in-progress',
    date: Date.now() - (2 * 24 * 60 * 60 * 1000),
    icon: 'shield'
  },
  {
    id: '2',
    type: 'audit',
    title: 'Security Audit Report',
    status: 'completed',
    date: Date.now() - (5 * 24 * 60 * 60 * 1000),
    icon: 'file'
  },
  {
    id: '3',
    type: 'report',
    title: 'Vulnerability Assessment',
    status: 'pending',
    date: Date.now() - (7 * 24 * 60 * 60 * 1000),
    icon: 'alert'
  }
];

const mockOverview = {
  stats: mockStats,
  recentActivity: mockRecentActivity,
  quickStats: {
    avgResponseTime: '24 hours',
    securityScore: 85,
    lastScan: Date.now() - (3 * 24 * 60 * 60 * 1000)
  }
};

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} - Dashboard stats
 */
export const getDashboardStats = async () => {
  const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.STATS);
  if (response.success) {
    return {
      success: true,
      data: normalizeDashboardStats(response.data || {})
    };
  }

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: normalizeDashboardStats(mockStats),
      isMock: true
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to fetch dashboard stats'
  };
};

/**
 * Get recent activity
 * @param {number} limit - Number of activities to fetch
 * @returns {Promise<Object>} - Recent activities
 */
export const getRecentActivity = async (limit = 10) => {
  const query = new URLSearchParams({ limit: String(limit) }).toString();
  const endpoint = `${API_ENDPOINTS.DASHBOARD.ACTIVITY}?${query}`;
  const response = await apiClient.get(endpoint);
  if (response.success) {
    const payload = Array.isArray(response.data) ? response.data : response.data?.items || [];
    return {
      success: true,
      data: normalizeRecentActivity(payload)
    };
  }

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: normalizeRecentActivity(mockRecentActivity.slice(0, limit)),
      isMock: true
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to fetch recent activity'
  };
};

/**
 * Get dashboard overview
 * @returns {Promise<Object>} - Complete dashboard data
 */
export const getDashboardOverview = async () => {
  const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.OVERVIEW);
  if (response.success) {
    return {
      success: true,
      data: normalizeDashboardOverview(response.data || {})
    };
  }

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: normalizeDashboardOverview(mockOverview),
      isMock: true
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to fetch dashboard overview'
  };
};

export default {
  getDashboardStats,
  getRecentActivity,
  getDashboardOverview
};
