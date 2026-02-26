/**
 * Student Dashboard Service
 * Location: src/features/student/student.service.js
 */

import { API_ENDPOINTS, buildEndpoint } from '../../config/api.config';
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

export const initializeBootcampPayment = async (payload = {}) => {
  const response = await apiClient.post(API_ENDPOINTS.STUDENT.BOOTCAMP_PAYMENT_INIT, payload);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to start payment', status: response.status };
};

export const verifyBootcampPayment = async (reference) => {
  const response = await apiClient.get(`${API_ENDPOINTS.STUDENT.BOOTCAMP_PAYMENT_VERIFY}?reference=${encodeURIComponent(reference)}`);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to verify payment', status: response.status };
};

export const submitBootcampBtcPayment = async (payload = {}) => {
  const response = await apiClient.post(API_ENDPOINTS.STUDENT.BOOTCAMP_PAYMENT_BTC, payload);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to submit BTC payment', status: response.status };
};

export const enrollTraining = async (payload = {}) => {
  const response = await apiClient.post(API_ENDPOINTS.STUDENT.ENROLL_TRAINING, payload);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to enroll in training' };
};

export const completeLearningModule = async (moduleId) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.STUDENT.COMPLETE_MODULE, { moduleId });
  const response = await apiClient.post(endpoint, {});
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to complete module' };
};

export const joinStudentCommunity = async () => {
  const response = await apiClient.post(API_ENDPOINTS.STUDENT.JOIN_COMMUNITY, {});
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to join community' };
};

export const getSupervisedEngagements = async () => {
  const response = await apiClient.get(API_ENDPOINTS.STUDENT.SUPERVISED_ENGAGEMENTS);
  if (response.success) return { success: true, data: response.data || [] };
  return { success: false, error: response.error || 'Failed to load supervised engagements' };
};

export const refreshStudentSkills = async (payload = {}) => {
  const response = await apiClient.post(API_ENDPOINTS.STUDENT.SKILL_REFRESH, payload);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to refresh skills' };
};

export const deployStudentProfessional = async (payload = {}) => {
  const response = await apiClient.post(API_ENDPOINTS.STUDENT.DEPLOYMENT, payload);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to deploy profile' };
};

export default {
  getStudentOverview,
  registerBootcamp,
  enrollTraining,
  completeLearningModule,
  joinStudentCommunity,
  getSupervisedEngagements,
  refreshStudentSkills,
  deployStudentProfessional,
  initializeBootcampPayment,
  verifyBootcampPayment,
  submitBootcampBtcPayment,
};
