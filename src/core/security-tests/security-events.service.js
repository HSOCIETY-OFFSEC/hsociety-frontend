import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';

const DEVICE_STORAGE_KEY = 'hsociety_device_id';

const randomId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const getDeviceId = () => {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(DEVICE_STORAGE_KEY);
  if (existing) return existing;
  const created = randomId();
  localStorage.setItem(DEVICE_STORAGE_KEY, created);
  return created;
};

export const trackSecurityEvent = async ({ eventType, action, path, metadata } = {}) => {
  try {
    await apiClient.post(API_ENDPOINTS.PUBLIC.SECURITY_EVENT, {
      eventType: eventType || 'frontend_activity',
      action: action || 'interaction',
      path: path || (typeof window !== 'undefined' ? window.location.pathname : ''),
      deviceId: getDeviceId(),
      metadata: metadata && typeof metadata === 'object' ? metadata : {},
    });
  } catch {
    // silent by design; tracking should not interrupt UX
  }
};

export default {
  trackSecurityEvent,
  getDeviceId,
};
