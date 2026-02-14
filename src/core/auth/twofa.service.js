/**
 * Two-Factor Authentication (2FA) Service
 * Location: src/core/auth/twofa.service.js
 */

import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';

/**
 * Setup 2FA for current user
 * @returns {Promise<Object>} - { success, secret, otpauthUrl, qrDataUrl }
 */
export const setup2FA = async () => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.SETUP, {});
    if (!response.success) {
      return { success: false, message: response.error || 'Failed to setup 2FA' };
    }

    return {
      success: true,
      ...response.data,
      message: 'Scan the QR code with your authenticator app'
    };
  } catch (error) {
    console.error('[2FA] Setup failed:', error);
    return { success: false, message: error.message || 'Failed to setup 2FA' };
  }
};

/**
 * Verify 2FA code during login
 * @param {string} twoFactorToken
 * @param {string} code
 */
export const verify2FA = async (twoFactorToken, code) => {
  try {
    if (!twoFactorToken || !code) {
      throw new Error('2FA token and code are required');
    }

    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.VERIFY, {
      twoFactorToken,
      code
    });

    if (!response.success) {
      return { success: false, message: response.error || '2FA verification failed' };
    }

    return { success: true, ...response.data, message: '2FA verification successful' };
  } catch (error) {
    console.error('[2FA] Verification failed:', error);
    return { success: false, message: error.message || '2FA verification failed' };
  }
};

/**
 * Enable 2FA for current user
 * @param {string} code
 */
export const enable2FA = async (code) => {
  try {
    if (!code) {
      throw new Error('2FA code is required');
    }

    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.ENABLE, { code });
    if (!response.success) {
      return { success: false, message: response.error || 'Failed to enable 2FA' };
    }

    return { success: true, ...response.data, message: '2FA enabled successfully' };
  } catch (error) {
    console.error('[2FA] Enable failed:', error);
    return { success: false, message: error.message || 'Failed to enable 2FA' };
  }
};

/**
 * Disable 2FA for current user
 * @param {string} code
 */
export const disable2FA = async (code) => {
  try {
    if (!code) {
      throw new Error('2FA code is required');
    }

    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.DISABLE, { code });
    if (!response.success) {
      return { success: false, message: response.error || 'Failed to disable 2FA' };
    }

    return { success: true, message: '2FA disabled' };
  } catch (error) {
    console.error('[2FA] Disable failed:', error);
    return { success: false, message: error.message || 'Failed to disable 2FA' };
  }
};

/**
 * Verify backup code during login
 */
export const verifyBackupCode = async (twoFactorToken, backupCode) => {
  try {
    if (!twoFactorToken || !backupCode) {
      throw new Error('2FA token and backup code are required');
    }

    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.VERIFY_BACKUP, {
      twoFactorToken,
      backupCode
    });

    if (!response.success) {
      return { success: false, message: response.error || 'Invalid backup code' };
    }

    return { success: true, ...response.data, message: 'Backup code verified' };
  } catch (error) {
    console.error('[2FA] Backup code verification failed:', error);
    return { success: false, message: error.message || 'Invalid backup code' };
  }
};

/**
 * Regenerate backup codes for current user
 */
export const regenerateBackupCodes = async () => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.REGENERATE_BACKUP, {});
    if (!response.success) {
      return { success: false, message: response.error || 'Failed to regenerate backup codes' };
    }

    return {
      success: true,
      backupCodes: response.data?.backupCodes,
      message: 'New backup codes generated. Store them safely.'
    };
  } catch (error) {
    console.error('[2FA] Backup code regeneration failed:', error);
    return { success: false, message: error.message || 'Failed to regenerate backup codes' };
  }
};

/**
 * Check 2FA status for current user
 */
export const is2FAEnabled = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TWO_FA.STATUS);
    if (!response.success) return false;
    return !!response.data?.enabled;
  } catch (error) {
    console.error('[2FA] Status check failed:', error);
    return false;
  }
};

export default {
  setup2FA,
  verify2FA,
  enable2FA,
  disable2FA,
  verifyBackupCode,
  regenerateBackupCodes,
  is2FAEnabled
};
