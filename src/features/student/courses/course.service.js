/**
 * Course Learning System Service
 * Location: src/features/student/courses/course.service.js
 *
 * Responsibility:
 * - Fetch course learning data from the backend (future)
 * - For now, load from local mock JSON to simulate API responses
 */

import { API_ENDPOINTS } from '../../../config/api.config';
import { apiClient } from '../../../shared/services/api.client';
import { normalizeCoursePayload } from './course.contract';
import mockCoursePayload from './mockCourseData.json';

/**
 * Get primary student course (single-track for now)
 * @returns {Promise<{success: boolean, data?: any, error?: string, isMock?: boolean}>}
 */
export const getStudentCourse = async () => {
  // Try real API first so we can plug in Express.js later without changing UI code
  const response = await apiClient.get(API_ENDPOINTS.STUDENT.COURSE);

  if (response.success && response.data) {
    return {
      success: true,
      data: normalizeCoursePayload(response.data)
    };
  }

  // Development / fallback: use local mock JSON to keep the UI functional
  if (import.meta.env.DEV) {
    return {
      success: true,
      data: normalizeCoursePayload(mockCoursePayload),
      isMock: true
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to fetch student course'
  };
};

export default {
  getStudentCourse
};

