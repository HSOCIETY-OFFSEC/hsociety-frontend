/**
 * Student Dashboard Service
 * Location: src/features/student/student.service.js
 */

import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';
import { normalizeStudentOverview } from './student.contract';

/**
 * Get student dashboard overview
 * @returns {Promise<Object>} - Student dashboard data
 */
export const getStudentOverview = async () => {
  const response = await apiClient.get(API_ENDPOINTS.STUDENT.OVERVIEW);
  if (response.success) {
    return {
      success: true,
      data: normalizeStudentOverview(response.data || {})
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to fetch student overview'
  };
};

export const registerBootcamp = async (application = null) => {
  const payload = application ? { application } : {};
  const response = await apiClient.post(API_ENDPOINTS.STUDENT.BOOTCAMP, payload);
  if (response.success) {
    return { success: true, data: response.data };
  }
  return { success: false, error: response.error || 'Failed to register for bootcamp' };
};

export default {
  getStudentOverview,
  registerBootcamp
};
