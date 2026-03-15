import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';
import { createAuthSocket } from '../../shared/services/socket.client';
import { getPublicErrorMessage } from '../../shared/utils/publicError';

export const getCommunityOverview = async (role = 'student', feed = 'popular') => {
  const params = new URLSearchParams({ role, feed }).toString();
  const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITY.OVERVIEW}?${params}`);
  if (!response.success) {
    return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
  }
  return { success: true, data: response.data || {} };
};

export const getCommunityMessages = async (room = 'general', limit = 40) => {
  const params = new URLSearchParams({ room, limit: String(limit) }).toString();
  const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITY.MESSAGES}?${params}`);
  if (!response.success) {
    return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
  }
  return { success: true, data: response.data || { room, messages: [] } };
};

export const createCommunitySocket = () => {
  return createAuthSocket();
};

export const uploadCommunityImage = async (file) => {
  const response = await apiClient.upload(API_ENDPOINTS.COMMUNITY.UPLOAD, file, 'file');
  if (!response.success) {
    return { success: false, error: getPublicErrorMessage({ action: 'submit', response }) };
  }
  return { success: true, data: response.data || {} };
};

export const getCommunityProfile = async (handle) => {
  const safeHandle = String(handle || '').trim();
  if (!safeHandle) return { success: false, error: getPublicErrorMessage({ action: 'load' }) };
  const endpoint = API_ENDPOINTS.COMMUNITY.PROFILE.replace(':handle', encodeURIComponent(safeHandle));
  const response = await apiClient.get(endpoint);
  if (!response.success) {
    return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
  }
  return { success: true, data: response.data || {} };
};

export const getCommunityProfilesList = async (limit = 12) => {
  const params = new URLSearchParams({ limit: String(limit) }).toString();
  const response = await apiClient.get(`${API_ENDPOINTS.PUBLIC.COMMUNITY_PROFILES}?${params}`);
  if (!response.success) {
    return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
  }
  return { success: true, data: response.data || [] };
};

export default {
  getCommunityOverview,
  getCommunityMessages,
  createCommunitySocket,
  uploadCommunityImage,
  getCommunityProfile,
  getCommunityProfilesList,
};
