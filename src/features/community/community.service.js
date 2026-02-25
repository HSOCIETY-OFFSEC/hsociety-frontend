import { io } from 'socket.io-client';
import { API_ENDPOINTS } from '../../config/api.config';
import { envConfig } from '../../config/env.config';
import { apiClient } from '../../shared/services/api.client';
import { sessionManager } from '../../core/auth/session.manager';

const toSocketBaseURL = () => {
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
    return window.location.origin;
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
    transports: ['websocket'],
    auth: { token },
  });
};

export default {
  getCommunityOverview,
  getCommunityMessages,
  createCommunitySocket,
};
