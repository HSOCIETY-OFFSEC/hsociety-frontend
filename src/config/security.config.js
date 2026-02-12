/**
 * Security Configuration
 * Location: src/config/security.config.js
 * 
 * Features:
 * - Security settings and policies
 * - Content Security Policy (CSP)
 * - Rate limiting configurations
 * - CORS settings
 * - Security headers
 * 
 * Security Best Practices:
 * - Strong password requirements
 * - Session timeout controls
 * - Input validation rules
 * - File upload restrictions
 */

import { envConfig } from './env.config';

/**
 * Password Security Configuration
 */
export const PASSWORD_CONFIG = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  
  // Password strength levels
  strength: {
    weak: 0,
    fair: 25,
    good: 50,
    strong: 75,
    veryStrong: 100
  },

  // Disallowed passwords (common weak passwords)
  blacklist: [
    'password',
    '12345678',
    'qwerty',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    '1234567890'
  ]
};

/**
 * Session Security Configuration
 */
export const SESSION_CONFIG = {
  // Session duration (24 hours)
  duration: envConfig.auth.sessionDuration,
  
  // Inactivity timeout (15 minutes)
  inactivityTimeout: envConfig.auth.inactivityTimeout,
  
  // Session refresh interval (50 minutes)
  refreshInterval: 50 * 60 * 1000,
  
  // Remember me duration (30 days)
  rememberMeDuration: 30 * 24 * 60 * 60 * 1000,
  
  // Single session only (kick out other sessions)
  singleSessionOnly: false,
  
  // Secure cookies settings
  cookie: {
    httpOnly: true,
    secure: envConfig.mode === 'production',
    sameSite: 'strict'
  }
};

/**
 * OTP Security Configuration
 */
export const OTP_CONFIG = {
  length: 6,
  expiryTime: 10 * 60 * 1000, // 10 minutes
  maxAttempts: 3,
  resendDelay: 60 * 1000, // 1 minute
  
  // Rate limiting for OTP requests
  rateLimit: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000 // 15 minutes
  }
};

/**
 * Two-Factor Authentication Configuration
 */
export const TWO_FA_CONFIG = {
  enabled: envConfig.auth.enableTwoFA,
  codeLength: 6,
  issuer: 'HSOCIETY',
  algorithm: 'SHA1',
  digits: 6,
  period: 30, // seconds
  
  // Backup codes
  backupCodes: {
    count: 10,
    length: 8
  }
};

/**
 * Rate Limiting Configuration
 */
export const RATE_LIMIT_CONFIG = {
  enabled: envConfig.security.enableRateLimiting,
  
  // Global rate limit
  global: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  
  // Authentication endpoints
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  
  // API endpoints
  api: {
    maxRequests: 60,
    windowMs: 60 * 1000 // 1 minute
  },
  
  // File uploads
  upload: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000 // 1 hour
  }
};

/**
 * CSRF Protection Configuration
 */
export const CSRF_CONFIG = {
  enabled: envConfig.security.enableCSRF,
  tokenLength: 32,
  headerName: 'X-CSRF-Token',
  cookieName: 'csrf-token',
  
  // Endpoints exempt from CSRF
  exemptPaths: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/feedback'
  ]
};

/**
 * File Upload Security Configuration
 */
export const FILE_UPLOAD_CONFIG = {
  maxFileSize: envConfig.upload.maxFileSize, // 5MB
  
  allowedMimeTypes: envConfig.upload.allowedTypes,
  
  allowedExtensions: [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', // Images
    '.pdf', // Documents
    '.doc', '.docx' // Word documents
  ],
  
  // Disallowed extensions (executable files)
  disallowedExtensions: [
    '.exe', '.bat', '.cmd', '.sh', '.ps1',
    '.dll', '.so', '.dylib',
    '.js', '.vbs', '.jar'
  ],
  
  // Scan for malware (placeholder)
  scanEnabled: true,
  
  // Storage path
  uploadPath: '/uploads',
  
  // File naming
  sanitizeFilename: true,
  useRandomFilenames: true
};

/**
 * Input Validation Configuration
 */
export const INPUT_VALIDATION_CONFIG = {
  // SQL injection patterns
  sqlInjectionPatterns: [
    /(\bOR\b|\bAND\b).*[=<>]/i,
    /UNION.*SELECT/i,
    /DROP.*TABLE/i,
    /INSERT.*INTO/i,
    /DELETE.*FROM/i,
    /UPDATE.*SET/i,
    /--/,
    /;.*--/,
    /\/\*.*\*\//
  ],
  
  // XSS patterns
  xssPatterns: [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\(/gi
  ],
  
  // Path traversal patterns
  pathTraversalPatterns: [
    /\.\.\//g,
    /\.\.\\/g,
    /%2e%2e%2f/gi,
    /%2e%2e\\/gi
  ],
  
  // Maximum input lengths
  maxLengths: {
    email: 254,
    name: 100,
    message: 5000,
    url: 2048,
    phone: 20
  }
};

/**
 * Encryption Configuration
 */
export const ENCRYPTION_CONFIG = {
  enabled: envConfig.security.enableEncryption,
  
  // Encryption algorithm
  algorithm: 'AES-256-GCM',
  
  // Key derivation
  keyDerivation: {
    algorithm: 'PBKDF2',
    iterations: 100000,
    keyLength: 32,
    digest: 'SHA-256'
  },
  
  // Fields to encrypt
  sensitiveFields: [
    'password',
    'ssn',
    'creditCard',
    'apiKey',
    'token'
  ]
};

/**
 * Content Security Policy (CSP)
 */
export const CSP_CONFIG = {
  enabled: true,
  
  directives: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"], // TODO: Remove unsafe-inline in production
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'", envConfig.api.baseURL],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  }
};

/**
 * Security Headers Configuration
 */
export const SECURITY_HEADERS_CONFIG = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS Protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  
  // Strict Transport Security (HTTPS only)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

/**
 * CORS Configuration
 */
export const CORS_CONFIG = {
  enabled: true,
  
  // Allowed origins
  allowedOrigins: [
    'http://localhost:5173',
    'http://localhost:3000',
    // Add production domains here
  ],
  
  // Allowed methods
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With'
  ],
  
  // Credentials support
  credentials: true,
  
  // Preflight cache duration
  maxAge: 86400 // 24 hours
};

/**
 * API Key Configuration (for future use)
 */
export const API_KEY_CONFIG = {
  enabled: false,
  headerName: 'X-API-Key',
  keyLength: 32,
  
  // Rate limiting per API key
  rateLimit: {
    maxRequests: 1000,
    windowMs: 60 * 60 * 1000 // 1 hour
  }
};

/**
 * Audit Log Configuration
 */
export const AUDIT_CONFIG = {
  enabled: true,
  
  // Events to log
  logEvents: [
    'login',
    'logout',
    'failed_login',
    'password_change',
    'profile_update',
    '2fa_enable',
    '2fa_disable',
    'file_upload',
    'file_download',
    'data_export'
  ],
  
  // Retention period (90 days)
  retentionPeriod: 90 * 24 * 60 * 60 * 1000
};

/**
 * Security validation helper
 */
export const validateSecurityConfig = () => {
  const warnings = [];

  // Check if encryption is enabled in production
  if (envConfig.mode === 'production' && !ENCRYPTION_CONFIG.enabled) {
    warnings.push('Encryption is disabled in production mode');
  }

  // Check if HTTPS is enforced in production
  if (envConfig.mode === 'production' && !SESSION_CONFIG.cookie.secure) {
    warnings.push('Secure cookies not enforced in production mode');
  }

  // Check if CSP is enabled
  if (!CSP_CONFIG.enabled) {
    warnings.push('Content Security Policy is disabled');
  }

  if (warnings.length > 0) {
    console.warn('[SECURITY] Configuration warnings:', warnings);
  }

  console.log('[SECURITY] Security configuration loaded');
};

// Validate on import
if (envConfig.mode === 'production') {
  validateSecurityConfig();
}

export default {
  PASSWORD_CONFIG,
  SESSION_CONFIG,
  OTP_CONFIG,
  TWO_FA_CONFIG,
  RATE_LIMIT_CONFIG,
  CSRF_CONFIG,
  FILE_UPLOAD_CONFIG,
  INPUT_VALIDATION_CONFIG,
  ENCRYPTION_CONFIG,
  CSP_CONFIG,
  SECURITY_HEADERS_CONFIG,
  CORS_CONFIG,
  API_KEY_CONFIG,
  AUDIT_CONFIG,
  validateSecurityConfig
};