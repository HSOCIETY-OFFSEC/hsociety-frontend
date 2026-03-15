import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';

const DEVICE_STORAGE_KEY = 'hsociety_device_id';
const DEFAULT_THROTTLE_INTERVAL_MS = 12_000;
const throttleTimestamps = new Map();

const randomId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const getDeviceId = () => {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(DEVICE_STORAGE_KEY);
  if (existing) return existing;
  const created = randomId();
  localStorage.setItem(DEVICE_STORAGE_KEY, created);
  return created;
};

const buildThrottleKey = ({ eventType = 'frontend_activity', action = 'interaction' } = {}, explicitKey) => {
  if (explicitKey) return explicitKey;
  return `${eventType}:${action}`.toLowerCase();
};

const canSendEvent = (key, intervalMs) => {
  if (intervalMs <= 0) return true;
  const now = Date.now();
  const lastSent = throttleTimestamps.get(key) || 0;
  if (now - lastSent < intervalMs) {
    return false;
  }
  throttleTimestamps.set(key, now);
  return true;
};

export const trackSecurityEvent = async (
  { eventType, action, path, metadata } = {},
  { throttleIntervalMs = DEFAULT_THROTTLE_INTERVAL_MS, throttleKey, forceSend = false } = {}
) => {
  const key = buildThrottleKey({ eventType, action }, throttleKey);
  if (!forceSend && !canSendEvent(key, throttleIntervalMs)) {
    return;
  }

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
