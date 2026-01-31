// src/config/api.config.js

/**
 * API Configuration
 * Centralized API endpoint management for Hsociety
 */

const ENV = import.meta.env.MODE || 'development';

const API_ENDPOINTS = {
  development: {
    BASE_URL: 'http://localhost:3000/api',
    WS_URL: 'ws://localhost:3000',
  },
  production: {
    BASE_URL: 'https://api.hsociety.com/api',
    WS_URL: 'wss://api.hsociety.com',
  },
};

export const API_CONFIG = {
  BASE_URL: API_ENDPOINTS[ENV].BASE_URL,
  WS_URL: API_ENDPOINTS[ENV].WS_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const API_ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // User Management
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete',
    SETTINGS: '/user/settings',
  },
  
  // Penetration Tests
  PENTESTS: {
    LIST: '/pentests',
    GET: (id) => `/pentests/${id}`,
    CREATE: '/pentests',
    UPDATE: (id) => `/pentests/${id}`,
    DELETE: (id) => `/pentests/${id}`,
    FINDINGS: (id) => `/pentests/${id}/findings`,
  },
  
  // Tasks
  TASKS: {
    LIST: '/tasks',
    GET: (id) => `/tasks/${id}`,
    CREATE: '/tasks',
    UPDATE: (id) => `/tasks/${id}`,
    DELETE: (id) => `/tasks/${id}`,
    BY_PROJECT: (projectId) => `/tasks/project/${projectId}`,
  },
  
  // Team Management
  TEAM: {
    MEMBERS: '/team/members',
    INVITE: '/team/invite',
    REMOVE: (userId) => `/team/remove/${userId}`,
  },
  
  // Analytics & Reports
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    REPORTS: '/analytics/reports',
    EXPORT: (id) => `/analytics/export/${id}`,
  },
};

export default API_CONFIG;