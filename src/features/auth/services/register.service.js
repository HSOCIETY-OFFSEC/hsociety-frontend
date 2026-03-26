/**
 * Register Service
 * Location: src/features/auth/register.service.js
 */

import { API_ENDPOINTS } from '../../../config/api/api.config';
import { apiClient } from '../../../shared/services/api.client';

export const registerUser = async (payload) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    if (response.success) {
      return {
        success: true,
        data: response.data
      };
    }

    const conflictMessage = response.data?.message || response.data?.error || '';
    if (response.status === 409 || conflictMessage.toLowerCase?.().includes('already')) {
      return {
        success: false,
        error: conflictMessage || 'Account already exists. Log in instead.',
        errorCode: 'USER_EXISTS'
      };
    }

    return {
      success: false,
      error: response.status === 0
        ? 'Connection error. Please try again.'
        : 'Registration failed. Please try again.'
    };
  } catch (error) {
    console.error('[REGISTER] Failed:', error);
    return {
      success: false,
      error: 'Registration failed. Please try again.'
    };
  }
};

export default {
  registerUser
};
