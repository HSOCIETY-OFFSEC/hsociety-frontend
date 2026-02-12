/**
 * Environment Configuration
 * Location: src/config/env.config.js
 * 
 * Features:
 * - Environment variable management
 * - API endpoint configuration
 * - Feature flags
 * - Build-specific settings
 * 
 * Usage:
 * - Reads from .env files
 * - Provides defaults for missing values
 * - Validates required variables
 */

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} - Environment variable value
 */
const getEnvVar = (key, defaultValue = '') => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  return defaultValue;
};

/**
 * Check if running in production
 */
export const isProduction = () => {
  return getEnvVar('MODE') === 'production' || getEnvVar('VITE_MODE') === 'production';
};

/**
 * Check if running in development
 */
export const isDevelopment = () => {
  return getEnvVar('MODE') === 'development' || getEnvVar('VITE_MODE') === 'development';
};

/**
 * Check if running in test
 */
export const isTest = () => {
  return getEnvVar('MODE') === 'test' || getEnvVar('VITE_MODE') === 'test';
};

/**
 * Application Environment Configuration
 */
export const envConfig = {
  // Application Mode
  mode: getEnvVar('MODE', 'development'),
  
  // API Configuration
  api: {
    baseURL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),
    timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '30000')),
    version: getEnvVar('VITE_API_VERSION', 'v1')
  },

  // Authentication
  auth: {
    tokenKey: getEnvVar('VITE_AUTH_TOKEN_KEY', 'hsociety_token'),
    sessionDuration: parseInt(getEnvVar('VITE_SESSION_DURATION', '86400000')), // 24 hours
    inactivityTimeout: parseInt(getEnvVar('VITE_INACTIVITY_TIMEOUT', '900000')), // 15 minutes
    enableTwoFA: getEnvVar('VITE_ENABLE_2FA', 'true') === 'true'
  },

  // Security
  security: {
    enableEncryption: getEnvVar('VITE_ENABLE_ENCRYPTION', 'false') === 'true',
    encryptionKey: getEnvVar('VITE_ENCRYPTION_KEY', ''),
    enableCSRF: getEnvVar('VITE_ENABLE_CSRF', 'true') === 'true',
    enableRateLimiting: getEnvVar('VITE_ENABLE_RATE_LIMITING', 'true') === 'true'
  },

  // Feature Flags
  features: {
    enablePentest: getEnvVar('VITE_FEATURE_PENTEST', 'true') === 'true',
    enableAudits: getEnvVar('VITE_FEATURE_AUDITS', 'true') === 'true',
    enableFeedback: getEnvVar('VITE_FEATURE_FEEDBACK', 'true') === 'true',
    enableNotifications: getEnvVar('VITE_FEATURE_NOTIFICATIONS', 'true') === 'true',
    enableFileUpload: getEnvVar('VITE_FEATURE_FILE_UPLOAD', 'true') === 'true'
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(getEnvVar('VITE_MAX_FILE_SIZE', '5242880')), // 5MB
    allowedTypes: getEnvVar('VITE_ALLOWED_FILE_TYPES', 'image/jpeg,image/png,application/pdf').split(',')
  },

  // Analytics (placeholder)
  analytics: {
    enabled: getEnvVar('VITE_ANALYTICS_ENABLED', 'false') === 'true',
    trackingId: getEnvVar('VITE_ANALYTICS_TRACKING_ID', '')
  },

  // Logging
  logging: {
    level: getEnvVar('VITE_LOG_LEVEL', 'info'), // debug, info, warn, error
    enableConsole: getEnvVar('VITE_LOG_CONSOLE', 'true') === 'true',
    enableRemote: getEnvVar('VITE_LOG_REMOTE', 'false') === 'true'
  },

  // App Info
  app: {
    name: getEnvVar('VITE_APP_NAME', 'HSOCIETY'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    description: getEnvVar('VITE_APP_DESCRIPTION', 'Offensive Security Platform')
  }
};

/**
 * Validate required environment variables
 */
export const validateEnvConfig = () => {
  const required = [
    'VITE_API_BASE_URL'
  ];

  const missing = required.filter(key => !getEnvVar(key));

  if (missing.length > 0) {
    console.warn('[ENV] Missing required environment variables:', missing);
    
    if (isProduction()) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  console.log('[ENV] Environment configuration loaded:', {
    mode: envConfig.mode,
    apiBaseURL: envConfig.api.baseURL,
    features: envConfig.features
  });
};

/**
 * Get full API endpoint URL
 * @param {string} path - API path
 * @returns {string} - Full URL
 */
export const getApiUrl = (path) => {
  const baseURL = envConfig.api.baseURL;
  const version = envConfig.api.version;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseURL}/${version}${cleanPath}`;
};

/**
 * Check if feature is enabled
 * @param {string} featureName - Feature name
 * @returns {boolean} - True if enabled
 */
export const isFeatureEnabled = (featureName) => {
  return envConfig.features[featureName] === true;
};

/**
 * Get configuration value
 * @param {string} path - Dot-separated path (e.g., 'api.baseURL')
 * @param {*} defaultValue - Default value if not found
 * @returns {*} - Configuration value
 */
export const getConfig = (path, defaultValue = null) => {
  const keys = path.split('.');
  let value = envConfig;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return value;
};

// Validate on import
if (isDevelopment()) {
  validateEnvConfig();
}

export default envConfig;