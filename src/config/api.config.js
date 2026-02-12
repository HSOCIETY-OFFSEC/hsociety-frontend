/**
 * API Configuration
 * Location: src/config/api.config.js
 * 
 * Features:
 * - API endpoint definitions
 * - Request/response configurations
 * - API versioning
 * - Endpoint helpers
 */

import { envConfig } from './env.config';

/**
 * API Base Configuration
 */
export const API_CONFIG = {
  baseURL: envConfig.api.baseURL,
  timeout: envConfig.api.timeout,
  version: envConfig.api.version,
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

  retry: {
    attempts: 3,
    delay: 1000,
    multiplier: 2
  }
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    ME: '/auth/me',
    PASSWORD_RESET_REQUEST: '/auth/password-reset/request',
    PASSWORD_RESET_CONFIRM: '/auth/password-reset/confirm',
    CHANGE_PASSWORD: '/auth/change-password'
  },

  // OTP
  OTP: {
    REQUEST: '/auth/otp/request',
    VERIFY: '/auth/otp/verify',
    RESEND: '/auth/otp/resend'
  },

  // Two-Factor Authentication
  TWO_FA: {
    SETUP: '/auth/2fa/setup',
    VERIFY: '/auth/2fa/verify',
    ENABLE: '/auth/2fa/enable',
    DISABLE: '/auth/2fa/disable',
    VERIFY_BACKUP: '/auth/2fa/verify-backup',
    REGENERATE_BACKUP: '/auth/2fa/regenerate-backup',
    STATUS: '/auth/2fa/status'
  },

  // User Profile
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    DELETE: '/profile',
    AVATAR: '/profile/avatar'
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ACTIVITY: '/dashboard/activity',
    OVERVIEW: '/dashboard/overview'
  },

  // Penetration Testing
  PENTEST: {
    LIST: '/pentest',
    CREATE: '/pentest',
    GET: '/pentest/:id',
    UPDATE: '/pentest/:id',
    DELETE: '/pentest/:id',
    SUBMIT: '/pentest/:id/submit',
    CANCEL: '/pentest/:id/cancel',
    REPORTS: '/pentest/:id/reports'
  },

  // Audits
  AUDITS: {
    LIST: '/audits',
    CREATE: '/audits',
    GET: '/audits/:id',
    UPDATE: '/audits/:id',
    DELETE: '/audits/:id',
    DOWNLOAD: '/audits/:id/download',
    HISTORY: '/audits/:id/history'
  },

  // Feedback
  FEEDBACK: {
    SUBMIT: '/feedback',
    LIST: '/feedback',
    GET: '/feedback/:id'
  },

  // File Upload
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: '/files/:id/download',
    DELETE: '/files/:id'
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    GET: '/notifications/:id',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: '/notifications/:id'
  },

  // Admin (future)
  ADMIN: {
    USERS: '/admin/users',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings'
  }
};

/**
 * Build endpoint URL with parameters
 * @param {string} endpoint - Endpoint path with placeholders
 * @param {Object} params - Parameters to replace in path
 * @returns {string} - Built endpoint URL
 */
export const buildEndpoint = (endpoint, params = {}) => {
  let url = endpoint;

  // Replace path parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });

  return url;
};

/**
 * Get full API URL
 * @param {string} endpoint - Endpoint path
 * @param {Object} params - Path parameters
 * @returns {string} - Full API URL
 */
export const getFullUrl = (endpoint, params = {}) => {
  const builtEndpoint = buildEndpoint(endpoint, params);
  return `${API_CONFIG.baseURL}${builtEndpoint}`;
};

/**
 * API Response Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * Check if status code is successful
 * @param {number} status - HTTP status code
 * @returns {boolean} - True if successful (2xx)
 */
export const isSuccessStatus = (status) => {
  return status >= 200 && status < 300;
};

/**
 * Check if status code is client error
 * @param {number} status - HTTP status code
 * @returns {boolean} - True if client error (4xx)
 */
export const isClientError = (status) => {
  return status >= 400 && status < 500;
};

/**
 * Check if status code is server error
 * @param {number} status - HTTP status code
 * @returns {boolean} - True if server error (5xx)
 */
export const isServerError = (status) => {
  return status >= 500 && status < 600;
};

/**
 * Get error message for status code
 * @param {number} status - HTTP status code
 * @returns {string} - Error message
 */
export const getStatusMessage = (status) => {
  const messages = {
    [HTTP_STATUS.BAD_REQUEST]: 'Bad request. Please check your input.',
    [HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized. Please login again.',
    [HTTP_STATUS.FORBIDDEN]: 'Access forbidden.',
    [HTTP_STATUS.NOT_FOUND]: 'Resource not found.',
    [HTTP_STATUS.CONFLICT]: 'Conflict with existing data.',
    [HTTP_STATUS.UNPROCESSABLE_ENTITY]: 'Validation error.',
    [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Too many requests. Please try again later.',
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Server error. Please try again later.',
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service unavailable. Please try again later.'
  };

  return messages[status] || 'An error occurred.';
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  buildEndpoint,
  getFullUrl,
  HTTP_STATUS,
  isSuccessStatus,
  isClientError,
  isServerError,
  getStatusMessage
};