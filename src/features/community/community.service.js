import { io } from 'socket.io-client';
import { API_ENDPOINTS } from '../../config/api.config';
import { envConfig } from '../../config/env.config';
import { apiClient } from '../../shared/services/api.client';
import { sessionManager } from '../../core/auth/session.manager';

const toSocketBaseURL = () => {
  const socketEnv =
    (typeof import.meta !== 'undefined' && import.meta.env
      ? String(import.meta.env.VITE_SOCKET_URL || '').trim()
      : '') || '';
  if (socketEnv) return socketEnv.replace(/\/+$/, '');

  const base = String(envConfig.api.baseURL || '').trim();
  if (base.startsWith('http://') || base.startsWith('https://')) {
    try {
      const parsed = new URL(base);
      return `${parsed.protocol}//${parsed.host}`;
    } catch (_err) {
      return base;
    }
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('localhost:5173')) {
      return origin.replace('localhost:5173', 'localhost:3000');
    }
    if (origin.includes('127.0.0.1:5173')) {
      return origin.replace('127.0.0.1:5173', '127.0.0.1:3000');
    }
    return origin;
  }

  return '';
};

export const getCommunityOverview = async (role = 'student', feed = 'popular') => {
  const params = new URLSearchParams({ role, feed }).toString();
  const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITY.OVERVIEW}?${params}`);
  if (!response.success) {
    return { success: false, error: response.error || 'Failed to load community overview' };
  }
  return { success: true, data: response.data || {} };
};

export const getCommunityMessages = async (room = 'general', limit = 40) => {
  const params = new URLSearchParams({ room, limit: String(limit) }).toString();
  const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITY.MESSAGES}?${params}`);
  if (!response.success) {
    return { success: false, error: response.error || 'Failed to load community messages' };
  }
  return { success: true, data: response.data || { room, messages: [] } };
};

export const createCommunitySocket = () => {
  const token = sessionManager.getToken();
  return io(toSocketBaseURL(), {
    transports: ['websocket', 'polling'],
    auth: { token },
  });
};

export const uploadCommunityImage = async (file) => {
  const response = await apiClient.upload(API_ENDPOINTS.COMMUNITY.UPLOAD, file, 'file');
  if (!response.success) {
    return { success: false, error: response.error || 'Failed to upload image' };
  }
  return { success: true, data: response.data || {} };
};

export const getCommunityProfile = async (handle) => {
  const safeHandle = String(handle || '').trim();
  if (!safeHandle) return { success: false, error: 'Profile handle is required' };
  const endpoint = API_ENDPOINTS.COMMUNITY.PROFILE.replace(':handle', encodeURIComponent(safeHandle));
  const response = await apiClient.get(endpoint);
  if (!response.success) {
    return { success: false, error: response.error || 'Failed to load profile' };
  }
  return { success: true, data: response.data || {} };
};

export default {
  getCommunityOverview,
  getCommunityMessages,
  createCommunitySocket,
  uploadCommunityImage,
  getCommunityProfile,
};
