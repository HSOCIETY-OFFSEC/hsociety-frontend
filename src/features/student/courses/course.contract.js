/**
 * Course Learning System Contract
 * Location: src/features/student/courses/course.contract.js
 *
 * Normalizes course / module / room structures coming from the API (or mocks)
 * so the UI can rely on a stable, predictable shape.
 */

export const normalizeRoom = (room = {}) => ({
  roomId: Number(room.roomId ?? 0),
  title: room.title || 'Untitled room'
});

export const normalizeModule = (module = {}) => ({
  moduleId: Number(module.moduleId ?? 0),
  title: module.title || 'Untitled module',
  badge: module.badge || '',
  rooms: (module.rooms || []).map(normalizeRoom),
  ctf: module.ctf || ''
});

export const normalizeCourse = (course = {}) => ({
  id: String(course.id || ''),
  title: course.title || 'Untitled course',
  creator: course.creator || '',
  levelSystem: Boolean(course.levelSystem),
  badgeSystem: Boolean(course.badgeSystem),
  modules: (course.modules || []).map(normalizeModule),
  certification: course.certification || ''
});

export const normalizeCoursePayload = (payload = {}) => {
  // Support both { course: {...} } and a raw course object
  if (payload.course) {
    return normalizeCourse(payload.course);
  }
  return normalizeCourse(payload);
};

export default {
  normalizeRoom,
  normalizeModule,
  normalizeCourse,
  normalizeCoursePayload
};

