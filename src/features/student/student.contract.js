/**
 * Student contract
 * Location: src/features/student/student.contract.js
 */

export const normalizeLearningPathItem = (item = {}) => ({
  id: String(item.id || ''),
  title: item.title || 'Untitled module',
  status: item.status || 'next',
  progress: Number(item.progress || 0)
});

export const normalizeModuleOverview = (item = {}) => ({
  id: String(item.id || ''),
  title: item.title || 'Untitled module',
  roomsTotal: Number(item.roomsTotal || 0),
  roomsCompleted: Number(item.roomsCompleted || 0),
  ctf: item.ctf || '',
  badge: item.badge || '',
  progress: Number(item.progress || 0)
});

export const normalizeSnapshotItem = (item = {}) => ({
  id: String(item.id || ''),
  label: item.label || '',
  value: String(item.value || '0'),
  icon: item.icon || 'check'
});

export const normalizeCommunityStats = (stats = {}) => ({
  questions: Number(stats.questions || 0),
  answered: Number(stats.answered || 0),
  channels: Number(stats.channels || 0),
});

export const normalizeStudentOverview = (overview = {}) => ({
  learningPath: (overview.learningPath || []).map(normalizeLearningPathItem),
  modules: (overview.modules || []).map(normalizeModuleOverview),
  snapshot: (overview.snapshot || []).map(normalizeSnapshotItem),
  bootcampStatus: overview.bootcampStatus || 'not_enrolled',
  communityStats: normalizeCommunityStats(overview.communityStats || {})
});

export default {
  normalizeLearningPathItem,
  normalizeModuleOverview,
  normalizeSnapshotItem,
  normalizeCommunityStats,
  normalizeStudentOverview
};
