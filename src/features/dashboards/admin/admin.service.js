/**
 * Admin service
 * Location: src/features/dashboards/admin/admin.service.js
 */
import { API_ENDPOINTS, buildEndpoint } from '../../../config/api.config';
import { apiClient } from '../../../shared/services/api.client';

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

export const getAdminOverview = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.OVERVIEW);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: response.error || 'Failed to load admin overview' };
};

export const getCommunityConfig = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.COMMUNITY_CONFIG);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: response.error || 'Failed to load community config' };
};

export const updateCommunityConfig = async (payload) => {
  const response = await apiClient.patch(API_ENDPOINTS.ADMIN.COMMUNITY_CONFIG, payload);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: response.error || 'Failed to update community config' };
};

export const getAdminCommunityMessages = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.COMMUNITY_MESSAGES);
  if (response.success) return { success: true, data: response.data || [] };
  return { success: false, error: response.error || 'Failed to load messages' };
};

export const updateAdminCommunityMessage = async (messageId, updates) => {
  const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.COMMUNITY_MESSAGES}/${messageId}`, updates);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to update message' };
};

export const deleteAdminCommunityMessage = async (messageId) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.ADMIN.COMMUNITY_MESSAGES}/${messageId}`);
  if (response.success) return { success: true };
  return { success: false, error: response.error || 'Failed to delete message' };
};

export const getAdminCommunityPosts = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.COMMUNITY_POSTS);
  if (response.success) return { success: true, data: response.data || [] };
  return { success: false, error: response.error || 'Failed to load posts' };
};

export const updateAdminCommunityPost = async (postId, updates) => {
  const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.COMMUNITY_POSTS}/${postId}`, updates);
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to update post' };
};

export const deleteAdminCommunityPost = async (postId) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.ADMIN.COMMUNITY_POSTS}/${postId}`);
  if (response.success) return { success: true };
  return { success: false, error: response.error || 'Failed to delete post' };
};

export const muteUser = async (userId, minutes) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.ADMIN.USER_MUTE, { id: userId });
  const response = await apiClient.patch(endpoint, { minutes });
  if (response.success) return { success: true, data: response.data };
  return { success: false, error: response.error || 'Failed to update mute status' };
};

export const getAdminContent = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.CONTENT);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: response.error || 'Failed to load content' };
};

export const updateAdminContent = async (payload) => {
  const response = await apiClient.patch(API_ENDPOINTS.ADMIN.CONTENT, payload);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: response.error || 'Failed to update content' };
};

export const getSecurityEvents = async (limit = 120) => {
  const response = await apiClient.get(`${API_ENDPOINTS.ADMIN.SECURITY_EVENTS}?limit=${limit}`);
  if (response.success) return { success: true, data: response.data || { items: [], total: 0 } };
  return { success: false, error: response.error || 'Failed to load security events' };
};

export const getSecuritySummary = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.SECURITY_SUMMARY);
  if (response.success) return { success: true, data: response.data || {} };
  return { success: false, error: response.error || 'Failed to load security summary' };
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
  getSecurityEvents,
  getSecuritySummary,
};
