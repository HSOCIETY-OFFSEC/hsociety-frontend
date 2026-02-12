/**
 * Input Validation Service
 * Location: src/core/validation/input.validator.js
 * 
 * Features:
 * - Sanitize user inputs to prevent injections
 * - Validate common input types
 * - XSS prevention
 * - SQL injection prevention
 * - Email, URL, phone validation
 * 
 * Security:
 * - All user inputs should be validated before processing
 * - Sanitization removes potentially harmful characters
 */

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - Raw input string
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags and script content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<[^>]+>/g, '');
  
  // Encode special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized.trim();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Additional checks
  const isValidFormat = emailRegex.test(email);
  const isReasonableLength = email.length >= 5 && email.length <= 254;
  const hasValidTLD = /\.[a-z]{2,}$/i.test(email);

  return isValidFormat && isReasonableLength && hasValidTLD;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid, errors, strength }
 */
export const validatePassword = (password) => {
  const errors = [];
  let strength = 0;

  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'], strength: 0 };
  }

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    strength += 20;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    strength += 20;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    strength += 20;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    strength += 20;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    strength += 20;
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

/**
 * Validate phone number (international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // Check if contains only digits and optional + prefix
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;
  
  return phoneRegex.test(cleaned);
};

/**
 * Sanitize filename to prevent path traversal
 * @param {string} filename - Filename to sanitize
 * @returns {string} - Sanitized filename
 */
export const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  // Remove path traversal patterns
  let sanitized = filename.replace(/\.\.+/g, '');
  sanitized = sanitized.replace(/[\/\\]/g, '');
  
  // Remove special characters except dots, dashes, underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '');
  
  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }

  return sanitized;
};

/**
 * Validate OTP code (6 digits)
 * @param {string} otp - OTP to validate
 * @returns {boolean} - True if valid OTP format
 */
export const validateOTP = (otp) => {
  if (!otp) return false;
  
  const otpString = otp.toString();
  const otpRegex = /^\d{6}$/;
  
  return otpRegex.test(otpString);
};

/**
 * Validate 2FA code (6 digits)
 * @param {string} code - 2FA code to validate
 * @returns {boolean} - True if valid 2FA format
 */
export const validate2FACode = (code) => {
  return validateOTP(code); // Same format as OTP
};

/**
 * Check for SQL injection patterns
 * @param {string} input - Input to check
 * @returns {boolean} - True if suspicious patterns found
 */
export const detectSQLInjection = (input) => {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const sqlPatterns = [
    /(\bOR\b|\bAND\b).*[=<>]/i,
    /UNION.*SELECT/i,
    /DROP.*TABLE/i,
    /INSERT.*INTO/i,
    /DELETE.*FROM/i,
    /UPDATE.*SET/i,
    /--/,
    /;.*--/,
    /\/\*.*\*\//,
    /xp_cmdshell/i,
    /exec(\s|\+)+(s|x)p\w+/i
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Check for XSS patterns
 * @param {string} input - Input to check
 * @returns {boolean} - True if suspicious patterns found
 */
export const detectXSS = (input) => {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onload, etc.
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\(/gi,
    /expression\(/gi
  ];

  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Validate and sanitize form data object
 * @param {Object} formData - Form data object
 * @param {Object} rules - Validation rules for each field
 * @returns {Object} - { isValid, sanitizedData, errors }
 */
export const validateForm = (formData, rules = {}) => {
  const errors = {};
  const sanitizedData = {};
  let isValid = true;

  Object.keys(formData).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field] || {};

    // Required check
    if (fieldRules.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      isValid = false;
      return;
    }

    // Skip validation if field is optional and empty
    if (!fieldRules.required && (!value || value.trim() === '')) {
      sanitizedData[field] = '';
      return;
    }

    // Type-specific validation
    switch (fieldRules.type) {
      case 'email':
        if (!validateEmail(value)) {
          errors[field] = 'Invalid email format';
          isValid = false;
        }
        break;
      
      case 'url':
        if (!validateURL(value)) {
          errors[field] = 'Invalid URL format';
          isValid = false;
        }
        break;
      
      case 'phone':
        if (!validatePhone(value)) {
          errors[field] = 'Invalid phone number';
          isValid = false;
        }
        break;
      
      case 'password':
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          errors[field] = passwordValidation.errors.join(', ');
          isValid = false;
        }
        break;
    }

    // Min/Max length
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = `Minimum length is ${fieldRules.minLength}`;
      isValid = false;
    }

    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = `Maximum length is ${fieldRules.maxLength}`;
      isValid = false;
    }

    // Sanitize the value
    sanitizedData[field] = sanitizeString(value);
  });

  return { isValid, sanitizedData, errors };
};

/**
 * Escape HTML entities
 * @param {string} html - HTML string to escape
 * @returns {string} - Escaped HTML
 */
export const escapeHTML = (html) => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Validate file upload
 * @param {File} file - File object to validate
 * @param {Object} options - { maxSize, allowedTypes }
 * @returns {Object} - { isValid, error }
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  } = options;

  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return { isValid: false, error: `File size exceeds ${maxSizeMB}MB` };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type ${file.type} is not allowed` };
  }

  // Validate filename
  const sanitizedName = sanitizeFilename(file.name);
  if (!sanitizedName || sanitizedName !== file.name) {
    return { isValid: false, error: 'Invalid filename' };
  }

  return { isValid: true, error: null };
};

export default {
  sanitizeString,
  validateEmail,
  validatePassword,
  validateURL,
  validatePhone,
  sanitizeFilename,
  validateOTP,
  validate2FACode,
  detectSQLInjection,
  detectXSS,
  validateForm,
  escapeHTML,
  validateFile
};