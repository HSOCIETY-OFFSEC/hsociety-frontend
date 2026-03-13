import { API_ENDPOINTS, buildEndpoint } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';
import { getPublicErrorMessage } from '../../shared/utils/publicError';

const normalizeHandle = (handle) => {
  if (!handle) return '';
  const raw = String(handle).trim().replace(/^@/, '').toLowerCase();
  return raw.replace(/[^a-z0-9._-]/g, '');
};

const extractProfile = (data) => {
  if (!data) return null;
  if (data.profile) return data.profile;
  if (data.user) return data.user;
  if (data.data) return data.data;
  return data;
};

export const getPublicProfileByHandle = async (handle) => {
  const safeHandle = normalizeHandle(handle);
  if (!safeHandle) {
    return { success: false, error: 'Profile handle is missing.' };
  }

  const endpoint = buildEndpoint(API_ENDPOINTS.PUBLIC.COMMUNITY_PROFILE, {
    handle: safeHandle
  });

  const response = await apiClient.get(endpoint);
  if (response.success) {
    const profile = extractProfile(response.data);
    if (profile) {
      const mergedProfile = {
        ...profile,
        stats: profile.stats || response.data?.stats,
        xpSummary: profile.xpSummary || response.data?.xpSummary,
        emblems: profile.emblems || response.data?.emblems,
        activity: profile.activity || response.data?.activity,
      };
      return { success: true, data: mergedProfile };
    }
    return { success: false, error: 'Profile not found.' };
  }

  // Fallback: attempt to resolve from the public profiles list.
  const listResponse = await apiClient.get(`${API_ENDPOINTS.PUBLIC.COMMUNITY_PROFILES}?limit=50`);
  if (!listResponse.success) {
    return { success: false, error: getPublicErrorMessage({ action: 'load', response }) };
  }

  const profiles = listResponse.data?.profiles || listResponse.data || [];
  const match = profiles.find((entry) => {
    const entryHandle = normalizeHandle(entry?.hackerHandle || entry?.handle || entry?.name);
    return entryHandle && entryHandle === safeHandle;
  });

  if (!match) {
    return { success: false, error: 'Profile not found.' };
  }

  return { success: true, data: match };
};

export default {
  getPublicProfileByHandle
};
