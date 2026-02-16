/**
 * Student Profile Service (XP, levels, badges, certificates)
 * Location: src/features/student/profile/profile.service.js
 *
 * Responsibility:
 * - Abstract future backend calls for XP / level / badge state
 * - Provide local helpers for computing XP & level from course progress
 */

import { API_ENDPOINTS } from '../../../config/api.config';
import { apiClient } from '../../../shared/services/api.client';

/**
 * XP model:
 * - Each room completion: +100 XP
 * - Each module CTF completion: +250 XP
 */
export const XP_RULES = {
  room: 100,
  ctf: 250
};

/**
 * Simple level curve for thousands of students:
 * - Level 1 starts at 0 XP
 * - Each level requires +500 XP more than previous
 */
export const getLevelFromXp = (xp) => {
  let level = 1;
  let threshold = 500;
  let remainingXp = xp;

  while (remainingXp >= threshold) {
    remainingXp -= threshold;
    level += 1;
    threshold += 250; // gentle ramp so active students feel continuous growth
  }

  return {
    level,
    currentLevelXp: xp - remainingXp,
    nextLevelXp: xp - remainingXp + threshold,
    xpIntoLevel: threshold - remainingXp,
    levelThreshold: threshold
  };
};

/**
 * Derive XP and unlocked badges from the course state.
 */
export const deriveProfileFromCourseState = (course, progressState) => {
  if (!course) {
    return {
      xp: 0,
      levelInfo: getLevelFromXp(0),
      unlockedBadges: [],
      completedModules: 0,
      totalModules: 0,
      hasCertificate: false
    };
  }

  let xp = 0;
  const unlockedBadges = [];
  let completedModules = 0;
  const totalModules = course.modules.length;

  course.modules.forEach((module) => {
    const moduleProgress = progressState.modules[module.moduleId] || {
      rooms: {},
      ctfCompleted: false
    };

    // Rooms
    module.rooms.forEach((room) => {
      if (moduleProgress.rooms[room.roomId]) {
        xp += XP_RULES.room;
      }
    });

    // CTF
    if (moduleProgress.ctfCompleted) {
      xp += XP_RULES.ctf;
    }

    const allRoomsCompleted =
      module.rooms.length > 0 &&
      module.rooms.every((room) => moduleProgress.rooms[room.roomId]);

    if (allRoomsCompleted && moduleProgress.ctfCompleted) {
      completedModules += 1;
      if (module.badge) {
        unlockedBadges.push(module.badge);
      }
    }
  });

  const hasCertificate =
    completedModules === totalModules && totalModules > 0 && Boolean(course.certification);

  return {
    xp,
    levelInfo: getLevelFromXp(xp),
    unlockedBadges,
    completedModules,
    totalModules,
    hasCertificate,
    certificationName: hasCertificate ? course.certification : null
  };
};

/**
 * Placeholder for future backend call to persist progress / profile.
 */
export const syncProfileProgress = async (profileSnapshot) => {
  try {
    await apiClient.post(API_ENDPOINTS.STUDENT.PROFILE, profileSnapshot);
  } catch {
    // Best-effort only in current frontend-only implementation
  }
};

export default {
  XP_RULES,
  getLevelFromXp,
  deriveProfileFromCourseState,
  syncProfileProgress
};

