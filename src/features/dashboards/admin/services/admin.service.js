/**
 * Admin service
 * Location: src/features/dashboards/admin/admin.service.js
 */
import { API_ENDPOINTS, buildEndpoint } from '../../../../config/api/api.config';
import { apiClient } from '../../../../shared/services/api.client';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';

export const getUsers = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS);
  if (response.success) {
    return { success: true, data: response.data || [] };
  }
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const updateUser = async (userId, updates) => {
  const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`, updates);
  if (response.success) {
    return { success: true, data: response.data };
  }
  return { success: false, error: getPublicErrorMessage({ action: 'save', response }) };
};

export const getPentests = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.PENTESTS);
  if (response.success) {
    return { success: true, data: response.data || [] };
  }
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const updatePentest = async (pentestId, updates) => {
  const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.PENTESTS}/${pentestId}`, updates);
  if (response.success) {
    return { success: true, data: response.data };
  }
  return { success: false, error: getPublicErrorMessage({ action: 'save', response }) };
};

export const assignEngagement = async (pentestId, assignedTo) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.ADMIN.ASSIGN_ENGAGEMENT, { id: pentestId });
  const response = await apiClient.patch(endpoint, { assignedTo });
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: getPublicErrorMessage({ action: 'save', response }) };
};

export const approvePayment = async (pentestId) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.ADMIN.APPROVE_PAYMENT, { id: pentestId });
  const response = await apiClient.post(endpoint, {});
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: getPublicErrorMessage({ action: 'submit', response }) };
};

export const publishCaseStudy = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.ADMIN.CASE_STUDIES, payload);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: getPublicErrorMessage({ action: 'submit', response }) };
};

export const getAnalytics = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const getAdminOverview = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.OVERVIEW);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const getCommunityConfig = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.COMMUNITY_CONFIG);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const updateCommunityConfig = async (payload) => {
  const response = await apiClient.patch(API_ENDPOINTS.ADMIN.COMMUNITY_CONFIG, payload);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'save', response }) };
};

export const getAdminCommunityMessages = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.COMMUNITY_MESSAGES);
  if (response.success) return { success: true, data: response.data || [] };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const updateAdminCommunityMessage = async (messageId, updates) => {
  const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.COMMUNITY_MESSAGES}/${messageId}`, updates);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: getPublicErrorMessage({ action: 'save', response }) };
};

export const deleteAdminCommunityMessage = async (messageId) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.ADMIN.COMMUNITY_MESSAGES}/${messageId}`);
  if (response.success) return { success: true };
  return { success: false, error: getPublicErrorMessage({ action: 'submit', response }) };
};

export const getAdminCommunityPosts = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.COMMUNITY_POSTS);
  if (response.success) return { success: true, data: response.data || [] };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const updateAdminCommunityPost = async (postId, updates) => {
  const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.COMMUNITY_POSTS}/${postId}`, updates);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: getPublicErrorMessage({ action: 'save', response }) };
};

export const deleteAdminCommunityPost = async (postId) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.ADMIN.COMMUNITY_POSTS}/${postId}`);
  if (response.success) return { success: true };
  return { success: false, error: getPublicErrorMessage({ action: 'submit', response }) };
};

export const muteUser = async (userId, minutes) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.ADMIN.USER_MUTE, { id: userId });
  const response = await apiClient.patch(endpoint, { minutes });
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: getPublicErrorMessage({ action: 'save', response }) };
};

export const getAdminContent = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.CONTENT);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const updateAdminContent = async (payload) => {
  const response = await apiClient.patch(API_ENDPOINTS.ADMIN.CONTENT, payload);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'save', response }) };
};

export const sendAdminNotification = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.ADMIN.SEND_NOTIFICATION, payload);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'submit', response }) };
};

export const sendBootcampRoomLink = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.ADMIN.SEND_NOTIFICATION, {
    ...payload,
    type: 'bootcamp_meeting',
  });
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'submit', response }) };
};

export const publishBootcampMeeting = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.ADMIN.BOOTCAMP_MEETING, payload);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'submit', response }) };
};

export const getSecurityEvents = async (limit = 120) => {
  const response = await apiClient.get(`${API_ENDPOINTS.ADMIN.SECURITY_EVENTS}?limit=${limit}`);
  if (response.success) return { success: true, data: response.data || { items: [], total: 0 } };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const getSecuritySummary = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.SECURITY_SUMMARY);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
};

export const getRumSummary = async (windowMs = 60 * 60 * 1000) => {
  const query = new URLSearchParams({ windowMs: String(windowMs) }).toString();
  const response = await apiClient.get(`${API_ENDPOINTS.TELEMETRY.RUM_SUMMARY}?${query}`);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
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
  getAdminOverview,
  getCommunityConfig,
  updateCommunityConfig,
  getAdminCommunityMessages,
  updateAdminCommunityMessage,
  deleteAdminCommunityMessage,
  getAdminCommunityPosts,
  updateAdminCommunityPost,
  deleteAdminCommunityPost,
  muteUser,
  getAdminContent,
  updateAdminContent,
  sendAdminNotification,
  sendBootcampRoomLink,
  publishBootcampMeeting,
  getSecurityEvents,
  getSecuritySummary,
  getRumSummary,
};
