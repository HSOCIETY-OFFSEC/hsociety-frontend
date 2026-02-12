/**
 * Register Service
 * Location: src/features/auth/register.service.js
 */

import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';

export const registerUser = async (payload) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    if (response.success) {
      return {
        success: true,
        data: response.data
      };
    }

    // Dev fallback keeps local flow usable before backend is connected.
    if (import.meta.env.DEV) {
      return {
        success: true,
        data: {
          id: `mock-${Date.now()}`,
          email: payload.credentials.email,
          role: payload.role
        },
        isMock: true
      };
    }

    return {
      success: false,
      error: response.error || 'Registration request failed'
    };
  } catch (error) {
    console.error('[REGISTER] Failed:', error);
    return {
      success: false,
      error: error.message || 'Registration request failed'
    };
  }
};

export default {
  registerUser
};
