/**
 * OTP (One-Time Password) Service
 * Location: src/core/auth/otp.service.js
 * 
 * Features:
 * - Request OTP for email/phone
 * - Verify OTP codes
 * - Rate limiting placeholders
 * - Expiry handling
 * 
 * Security:
 * - OTP expires after set time
 * - Limited verification attempts
 * - Backend integration required
 * 
 * TODO: Backend integration for actual OTP generation and delivery
 */

const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 3;

/**
 * Request OTP for authentication
 * @param {string} identifier - Email or phone number
 * @param {string} purpose - 'login' | 'register' | 'reset'
 * @returns {Promise<Object>} - { success, message, expiresAt }
 */
export const requestOTP = async (identifier, purpose = 'login') => {
  try {
    // Validate identifier
    if (!identifier || typeof identifier !== 'string') {
      throw new Error('Valid identifier required');
    }

    // TODO: Backend integration
    // const response = await apiClient.post('/auth/otp/request', {
    //   identifier,
    //   purpose
    // });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response
    const expiresAt = Date.now() + OTP_EXPIRY_TIME;

    console.log('[OTP] OTP requested for:', identifier);
    console.log('[OTP] Purpose:', purpose);
    console.log('[OTP] Expires at:', new Date(expiresAt).toLocaleString());

    return {
      success: true,
      message: 'OTP sent successfully',
      expiresAt,
      attemptsRemaining: MAX_ATTEMPTS
    };
  } catch (error) {
    console.error('[OTP] Request failed:', error);
    return {
      success: false,
      message: error.message || 'Failed to send OTP',
      expiresAt: null
    };
  }
};

/**
 * Verify OTP code
 * @param {string} identifier - Email or phone number
 * @param {string} otp - OTP code to verify
 * @param {string} purpose - 'login' | 'register' | 'reset'
 * @returns {Promise<Object>} - { success, message, token }
 */
export const verifyOTP = async (identifier, otp, purpose = 'login') => {
  try {
    // Validate inputs
    if (!identifier || !otp) {
      throw new Error('Identifier and OTP are required');
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      throw new Error('Invalid OTP format');
    }

    // TODO: Backend integration
    // const response = await apiClient.post('/auth/otp/verify', {
    //   identifier,
    //   otp,
    //   purpose
    // });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock verification (for development)
    // In production, backend will verify
    const isValid = true; // Placeholder

    if (!isValid) {
      throw new Error('Invalid or expired OTP');
    }

    console.log('[OTP] OTP verified for:', identifier);

    return {
      success: true,
      message: 'OTP verified successfully',
      token: `mock-token-${Date.now()}`, // Placeholder token
      requiresTwoFA: true // Mock: assume 2FA is enabled
    };
  } catch (error) {
    console.error('[OTP] Verification failed:', error);
    return {
      success: false,
      message: error.message || 'OTP verification failed',
      token: null,
      attemptsRemaining: MAX_ATTEMPTS - 1
    };
  }
};

/**
 * Resend OTP
 * @param {string} identifier - Email or phone number
 * @param {string} purpose - 'login' | 'register' | 'reset'
 * @returns {Promise<Object>} - { success, message }
 */
export const resendOTP = async (identifier, purpose = 'login') => {
  try {
    // Rate limiting check (placeholder)
    const lastRequest = sessionStorage.getItem(`otp_last_request_${identifier}`);
    const now = Date.now();

    if (lastRequest) {
      const timeSinceLastRequest = now - parseInt(lastRequest);
      const minInterval = 60 * 1000; // 1 minute minimum between requests

      if (timeSinceLastRequest < minInterval) {
        const waitTime = Math.ceil((minInterval - timeSinceLastRequest) / 1000);
        throw new Error(`Please wait ${waitTime} seconds before requesting again`);
      }
    }

    // Store current request time
    sessionStorage.setItem(`otp_last_request_${identifier}`, now.toString());

    // Request new OTP
    return await requestOTP(identifier, purpose);
  } catch (error) {
    console.error('[OTP] Resend failed:', error);
    return {
      success: false,
      message: error.message || 'Failed to resend OTP'
    };
  }
};

/**
 * Check if OTP has expired
 * @param {number} expiresAt - Expiry timestamp
 * @returns {boolean} - True if expired
 */
export const isOTPExpired = (expiresAt) => {
  if (!expiresAt) return true;
  return Date.now() > expiresAt;
};

/**
 * Get remaining OTP validity time
 * @param {number} expiresAt - Expiry timestamp
 * @returns {number} - Remaining time in milliseconds
 */
export const getRemainingTime = (expiresAt) => {
  if (!expiresAt) return 0;
  const remaining = expiresAt - Date.now();
  return remaining > 0 ? remaining : 0;
};

/**
 * Format remaining time for display
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} - Formatted time string
 */
export const formatRemainingTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Clear OTP session data
 * @param {string} identifier - Email or phone number
 */
export const clearOTPSession = (identifier) => {
  sessionStorage.removeItem(`otp_last_request_${identifier}`);
  console.log('[OTP] Session data cleared for:', identifier);
};

export default {
  requestOTP,
  verifyOTP,
  resendOTP,
  isOTPExpired,
  getRemainingTime,
  formatRemainingTime,
  clearOTPSession
};