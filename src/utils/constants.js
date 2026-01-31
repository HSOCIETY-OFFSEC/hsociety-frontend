// src/utils/constants.js

/**
 * Application Constants
 * Centralized constant values used throughout the app
 */

// API Response Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Pentest Statuses
export const PENTEST_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on-hold',
};

// Task Statuses
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  BLOCKED: 'blocked',
};

// Task Priorities
export const TASK_PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// Vulnerability Severity Levels
export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  PENTESTER: 'pentester',
  ANALYST: 'analyst',
  CLIENT: 'client',
  VIEWER: 'viewer',
};

// Pentest Types
export const PENTEST_TYPES = {
  WEB_APP: 'web-application',
  NETWORK: 'network',
  MOBILE: 'mobile',
  API: 'api',
  CLOUD: 'cloud',
  WIRELESS: 'wireless',
  SOCIAL_ENGINEERING: 'social-engineering',
  PHYSICAL: 'physical',
};

// Finding Categories
export const FINDING_CATEGORIES = {
  INJECTION: 'injection',
  BROKEN_AUTH: 'broken-authentication',
  SENSITIVE_DATA: 'sensitive-data-exposure',
  XXE: 'xml-external-entities',
  BROKEN_ACCESS: 'broken-access-control',
  SECURITY_MISCONFIG: 'security-misconfiguration',
  XSS: 'cross-site-scripting',
  DESERIALIZATION: 'insecure-deserialization',
  VULNERABLE_COMPONENTS: 'vulnerable-components',
  INSUFFICIENT_LOGGING: 'insufficient-logging',
};

// Date Formats
export const DATE_FORMATS = {
  FULL: { year: 'numeric', month: 'long', day: 'numeric' },
  SHORT: { year: 'numeric', month: 'short', day: 'numeric' },
  NUMERIC: { year: 'numeric', month: '2-digit', day: '2-digit' },
  TIME: { hour: '2-digit', minute: '2-digit' },
  FULL_WITH_TIME: { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'hsociety-theme',
  LANGUAGE: 'hsociety-language',
  SIDEBAR_STATE: 'hsociety-sidebar-state',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in.',
  LOGOUT_SUCCESS: 'Successfully logged out.',
  SIGNUP_SUCCESS: 'Account created successfully.',
  UPDATE_SUCCESS: 'Updated successfully.',
  DELETE_SUCCESS: 'Deleted successfully.',
  CREATE_SUCCESS: 'Created successfully.',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
};

// Timeouts
export const TIMEOUTS = {
  DEBOUNCE: 300,
  TOAST: 5000,
  API_REQUEST: 30000,
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
};

// Status Colors
export const STATUS_COLORS = {
  [PENTEST_STATUS.SCHEDULED]: '#6a9aff',
  [PENTEST_STATUS.IN_PROGRESS]: '#00ff88',
  [PENTEST_STATUS.COMPLETED]: '#00cc6a',
  [PENTEST_STATUS.CANCELLED]: '#ff4444',
  [PENTEST_STATUS.ON_HOLD]: '#ffa500',
  
  [TASK_PRIORITY.CRITICAL]: '#ff4444',
  [TASK_PRIORITY.HIGH]: '#ff8844',
  [TASK_PRIORITY.MEDIUM]: '#ffa500',
  [TASK_PRIORITY.LOW]: '#44aa88',
  
  [SEVERITY_LEVELS.CRITICAL]: '#ff4444',
  [SEVERITY_LEVELS.HIGH]: '#ff8844',
  [SEVERITY_LEVELS.MEDIUM]: '#ffa500',
  [SEVERITY_LEVELS.LOW]: '#44aa88',
  [SEVERITY_LEVELS.INFO]: '#6a9aff',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PENTESTS: '/pentests',
  PENTEST_DETAIL: '/pentests/:id',
  TASKS: '/tasks',
  TASK_DETAIL: '/tasks/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  TEAM: '/team',
  REPORTS: '/reports',
};

export default {
  HTTP_STATUS,
  PENTEST_STATUS,
  TASK_STATUS,
  TASK_PRIORITY,
  SEVERITY_LEVELS,
  USER_ROLES,
  PENTEST_TYPES,
  FINDING_CATEGORIES,
  DATE_FORMATS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  FILE_UPLOAD,
  TIMEOUTS,
  VALIDATION,
  STATUS_COLORS,
  ROUTES,
};