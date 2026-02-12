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

export const normalizeChallenge = (item = {}) => ({
  id: String(item.id || ''),
  title: item.title || 'Untitled challenge',
  level: item.level || 'Easy',
  time: item.time || '',
  icon: item.icon || 'target'
});

export const normalizeMentor = (item = {}) => ({
  id: String(item.id || ''),
  name: item.name || 'Mentor',
  focus: item.focus || '',
  status: item.status || 'Unavailable'
});

export const normalizeSnapshotItem = (item = {}) => ({
  id: String(item.id || ''),
  label: item.label || '',
  value: String(item.value || '0'),
  icon: item.icon || 'check'
});

export const normalizeStudentOverview = (overview = {}) => ({
  learningPath: (overview.learningPath || []).map(normalizeLearningPathItem),
  challenges: (overview.challenges || []).map(normalizeChallenge),
  mentors: (overview.mentors || []).map(normalizeMentor),
  snapshot: (overview.snapshot || []).map(normalizeSnapshotItem)
});

export default {
  normalizeLearningPathItem,
  normalizeChallenge,
  normalizeMentor,
  normalizeSnapshotItem,
  normalizeStudentOverview
};
