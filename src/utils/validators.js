// src/utils/validators.js

/**
 * Form validation utilities
 * Reusable validation functions for forms
 */

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password 
 * @returns {Object} { isValid, errors }
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate name (non-empty, reasonable length)
 * @param {string} name 
 * @returns {Object} { isValid, error }
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.length > 100) {
    return { isValid: false, error: 'Name must be less than 100 characters' };
  }

  return { isValid: true, error: null };
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input 
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate form data
 * @param {Object} data 
 * @param {Object} rules 
 * @returns {Object} { isValid, errors }
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];

    // Required field check
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      isValid = false;
      return;
    }

    // Email validation
    if (rule.email && value && !validateEmail(value)) {
      errors[field] = 'Invalid email format';
      isValid = false;
      return;
    }

    // Min length
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
      isValid = false;
      return;
    }

    // Max length
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${field} must be less than ${rule.maxLength} characters`;
      isValid = false;
      return;
    }

    // Custom validation function
    if (rule.custom && value) {
      const customResult = rule.custom(value);
      if (!customResult.isValid) {
        errors[field] = customResult.error;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  sanitizeInput,
  validateForm,
};