/**
 * Dashboard Service
 * Location: src/features/dashboards/corporate/dashboard.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api.config';
import {
  normalizeDashboardOverview,
  normalizeDashboardStats,
  normalizeRecentActivity
} from './dashboard.contract';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';

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
  return {
    success: false,
    error: getPublicErrorMessage({ action: 'load', response })
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
  return {
    success: false,
    error: getPublicErrorMessage({ action: 'load', response })
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

  // Fallback: try individual endpoints in parallel
  const [statsRes, activityRes] = await Promise.all([
    getDashboardStats(),
    getRecentActivity()
  ]);

  if (statsRes.success || activityRes.success) {
    return {
      success: true,
      data: normalizeDashboardOverview({
        stats: statsRes.success ? statsRes.data : {},
        recentActivity: activityRes.success ? activityRes.data : [],
        quickStats: {
          avgResponseTime: '24 hours',
          securityScore: statsRes.success ? Number(statsRes.data?.remediationProgress || 0) : 0,
          lastScan: null
        }
      }),
      isFallback: true
    };
  }

  return {
    success: false,
    error: getPublicErrorMessage({ action: 'load', response })
  };
};

export default {
  getDashboardStats,
  getRecentActivity,
  getDashboardOverview
};
