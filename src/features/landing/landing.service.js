import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';
import { getPublicErrorMessage } from '../../shared/utils/publicError';

const CACHE_PREFIX = 'hsociety_landing_v1';
const TTL_MS = 10 * 60 * 1000;

const getCache = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(`${CACHE_PREFIX}:${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > TTL_MS) return null;
    return parsed.data || null;
  } catch {
    return null;
  }
};

const setCache = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(
      `${CACHE_PREFIX}:${key}`,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // no-op
  }
};

export const getLandingCacheSnapshot = () => ({
  stats: getCache('stats'),
  profiles: getCache('profiles:6'),
  content: getCache('content'),
});

export const getLandingStats = async (options = {}) => {
  const { cacheOnly = false, forceRefresh = false } = options;
  if (!forceRefresh) {
    const cached = getCache('stats');
    if (cached) return { success: true, data: cached, fromCache: true };
  }
  if (cacheOnly) {
    return { success: false, error: 'Stats unavailable.' };
  }
  const response = await apiClient.get(API_ENDPOINTS.PUBLIC.LANDING_STATS);

  if (!response.success) {
    return {
      success: false,
      error: getPublicErrorMessage({ action: 'load', response })
    };
  }
  setCache('stats', response.data);

  return {
    success: true,
    data: response.data,
    fromCache: false,
  };
};

export const subscribeNewsletter = async (payload = {}) => {
  const response = await apiClient.post(API_ENDPOINTS.PUBLIC.SUBSCRIBE, payload);
  if (!response.success) {
    return {
      success: false,
      error: getPublicErrorMessage({ action: 'submit', response })
    };
  }
  return {
    success: true,
    data: response.data
  };
};

export const getCommunityProfiles = async (limit = 6, options = {}) => {
  const { cacheOnly = false, forceRefresh = false } = options;
  if (!forceRefresh) {
    const cached = getCache(`profiles:${limit}`);
    if (cached) return { success: true, data: cached, fromCache: true };
  }
  if (cacheOnly) {
    return { success: false, error: 'Community profiles unavailable.' };
  }
  const response = await apiClient.get(`${API_ENDPOINTS.PUBLIC.COMMUNITY_PROFILES}?limit=${limit}`);
  if (!response.success) {
    return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
  }
  setCache(`profiles:${limit}`, response.data);
  return { success: true, data: response.data, fromCache: false };
};

export const getLandingContent = async (options = {}) => {
  const { cacheOnly = false, forceRefresh = false } = options;
  if (!forceRefresh) {
    const cached = getCache('content');
    if (cached) return { success: true, data: cached, fromCache: true };
  }
  if (cacheOnly) {
    return { success: false, error: 'Content unavailable.' };
  }
  const response = await apiClient.get(API_ENDPOINTS.PUBLIC.LANDING_CONTENT);
  if (!response.success) {
    return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
  }
  setCache('content', response.data);
  return { success: true, data: response.data, fromCache: false };
};
