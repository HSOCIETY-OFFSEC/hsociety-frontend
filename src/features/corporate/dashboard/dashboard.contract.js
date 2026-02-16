/**
 * Dashboard contract
 * Location: src/features/dashboard/dashboard.contract.js
 */

export const normalizeDashboardStats = (stats = {}) => ({
  activePentests: Number(stats.activePentests || 0),
  completedAudits: Number(stats.completedAudits || 0),
  pendingReports: Number(stats.pendingReports || 0),
  vulnerabilitiesFound: Number(stats.vulnerabilitiesFound || 0),
  remediationRate: Number(stats.remediationRate || 0)
});

export const normalizeActivityItem = (activity = {}) => ({
  id: String(activity.id || ''),
  type: activity.type || 'activity',
  title: activity.title || 'Untitled activity',
  status: activity.status || 'pending',
  date: activity.date || Date.now(),
  icon: activity.icon || 'shield'
});

export const normalizeRecentActivity = (items = []) =>
  items.map(normalizeActivityItem);

export const normalizeDashboardOverview = (data = {}) => ({
  stats: normalizeDashboardStats(data.stats || {}),
  recentActivity: normalizeRecentActivity(data.recentActivity || []),
  quickStats: {
    avgResponseTime: data?.quickStats?.avgResponseTime || 'N/A',
    securityScore: Number(data?.quickStats?.securityScore || 0),
    lastScan: data?.quickStats?.lastScan || null
  }
});

export default {
  normalizeDashboardStats,
  normalizeActivityItem,
  normalizeRecentActivity,
  normalizeDashboardOverview
};
