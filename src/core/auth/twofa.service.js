/**
 * Two-Factor Authentication (2FA) Service
 * Location: src/core/auth/twofa.service.js
 */

import { API_ENDPOINTS } from '../../config/api/api.config';
import { apiClient } from '../../shared/services/api.client';
import { logger } from '../logging/logger';

/**
 * Setup 2FA for current user
 * @returns {Promise<Object>} - { success, secret, otpauthUrl, qrDataUrl }
 */
export const setup2FA = async () => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.SETUP, {});
    if (!response.success) {
      return { success: false, message: 'Request failed. Please try again.' };
    }

    return {
      success: true,
      ...response.data,
      message: 'Scan the QR code with your authenticator app'
    };
  } catch (error) {
    logger.error('[2FA] Setup failed:', error);
    return { success: false, message: 'Request failed. Please try again.' };
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
      return { success: false, message: 'Verification failed. Please try again.' };
    }

    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.VERIFY, {
      twoFactorToken,
      code
    });

    if (!response.success) {
      return { success: false, message: 'Verification failed. Please try again.' };
    }

    return { success: true, ...response.data, message: '2FA verification successful' };
  } catch (error) {
    logger.error('[2FA] Verification failed:', error);
    return { success: false, message: 'Verification failed. Please try again.' };
  }
};

/**
 * Enable 2FA for current user
 * @param {string} code
 */
export const enable2FA = async (code) => {
  try {
    if (!code) {
      return { success: false, message: 'Request failed. Please try again.' };
    }

    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.ENABLE, { code });
    if (!response.success) {
      return { success: false, message: 'Request failed. Please try again.' };
    }

    return { success: true, ...response.data, message: '2FA enabled successfully' };
  } catch (error) {
    logger.error('[2FA] Enable failed:', error);
    return { success: false, message: 'Request failed. Please try again.' };
  }
};

/**
 * Disable 2FA for current user
 * @param {string} code
 */
export const disable2FA = async (code) => {
  try {
    if (!code) {
      return { success: false, message: 'Request failed. Please try again.' };
    }

    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.DISABLE, { code });
    if (!response.success) {
      return { success: false, message: 'Request failed. Please try again.' };
    }

    return { success: true, message: '2FA disabled' };
  } catch (error) {
    logger.error('[2FA] Disable failed:', error);
    return { success: false, message: 'Request failed. Please try again.' };
  }
};

/**
 * Verify backup code during login
 */
export const verifyBackupCode = async (twoFactorToken, backupCode) => {
  try {
    if (!twoFactorToken || !backupCode) {
      return { success: false, message: 'Verification failed. Please try again.' };
    }

    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.VERIFY_BACKUP, {
      twoFactorToken,
      backupCode
    });

    if (!response.success) {
      return { success: false, message: 'Verification failed. Please try again.' };
    }

    return { success: true, ...response.data, message: 'Backup code verified' };
  } catch (error) {
    logger.error('[2FA] Backup code verification failed:', error);
    return { success: false, message: 'Verification failed. Please try again.' };
  }
};

/**
 * Regenerate backup codes for current user
 */
export const regenerateBackupCodes = async () => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.TWO_FA.REGENERATE_BACKUP, {});
    if (!response.success) {
      return { success: false, message: 'Request failed. Please try again.' };
    }

    return {
      success: true,
      backupCodes: response.data?.backupCodes,
      message: 'New backup codes generated. Store them safely.'
    };
  } catch (error) {
    logger.error('[2FA] Backup code regeneration failed:', error);
    return { success: false, message: 'Request failed. Please try again.' };
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
    logger.error('[2FA] Status check failed:', error);
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
