/**
 * Admin service
 * Location: src/features/admin/admin.service.js
 */
import { API_ENDPOINTS, buildEndpoint } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';

export const getUsers = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS);
  if (response.success) {
    return { success: true, data: response.data || [] };
  }
  return { success: false, error: response.error || 'Failed to fetch users' };
};

export const updateUser = async (userId, updates) => {
  const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`, updates);
  if (response.success) {
    return { success: true, data: response.data };
  }
  return { success: false, error: response.error || 'Failed to update user' };
};

export const getPentests = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.PENTESTS);
  if (response.success) {
    return { success: true, data: response.data || [] };
  }
  return { success: false, error: response.error || 'Failed to fetch pentests' };
};

export const updatePentest = async (pentestId, updates) => {
  const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.PENTESTS}/${pentestId}`, updates);
  if (response.success) {
    return { success: true, data: response.data };
  }
  return { success: false, error: response.error || 'Failed to update pentest' };
};

export const assignEngagement = async (pentestId, assignedTo) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.ADMIN.ASSIGN_ENGAGEMENT, { id: pentestId });
  const response = await apiClient.patch(endpoint, { assignedTo });
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to assign engagement' };
};

export const approvePayment = async (pentestId) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.ADMIN.APPROVE_PAYMENT, { id: pentestId });
  const response = await apiClient.post(endpoint, {});
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to approve payment' };
};

export const publishCaseStudy = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.ADMIN.CASE_STUDIES, payload);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to publish case study' };
};

export const getAnalytics = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to load analytics' };
};

export default {
  getUsers,
  updateUser,
  getPentests,
  updatePentest,
  assignEngagement,
  approvePayment,
  publishCaseStudy,
  getAnalytics,
};
