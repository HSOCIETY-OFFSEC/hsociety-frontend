/**
 * Authentication Service
 * Location: src/core/auth/auth.service.js
 */

import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';
import { validateEmail, validatePassword } from '../validation/input.validator';

/**
 * Login with email and password.
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - { success, user, token, refreshToken, twoFactorRequired, twoFactorToken, mustChangePassword, passwordChangeToken, message }
 */
export const login = async (email, password) => {
  try {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });

    if (!response.success) {
      return {
        success: false,
        message: response.error || 'Login failed'
      };
    }

    const data = response.data || {};

    if (data.twoFactorRequired) {
      return {
        success: true,
        twoFactorRequired: true,
        twoFactorToken: data.twoFactorToken,
        user: data.user,
        message: 'Two-factor verification required'
      };
    }
    // SECURITY UPDATE IMPLEMENTED: Force password change for weak passwords
    if (data.mustChangePassword && data.passwordChangeToken) {
      return {
        success: true,
        mustChangePassword: true,
        passwordChangeToken: data.passwordChangeToken,
        user: data.user,
        message: 'Password update required'
      };
    }

    return {
      success: true,
      user: data.user,
      token: data.token,
      refreshToken: data.refreshToken,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('[AUTH] Login failed:', error);
    return {
      success: false,
      message: error.message || 'Login failed'
    };
  }
};

/**
 * Register new user
 * @param {Object} userData - { email, password, name }
 * @returns {Promise<Object>} - { success, user, token, refreshToken, message }
 */
export const register = async (userData) => {
  try {
    const { email, password, name } = userData;

    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }

    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      name: name.trim()
    });

    if (!response.success) {
      return {
        success: false,
        message: response.error || 'Registration failed'
      };
    }

    const data = response.data || {};

    return {
      success: true,
      user: data.user,
      token: data.token,
      refreshToken: data.refreshToken,
      message: 'Registration successful'
    };
  } catch (error) {
    console.error('[AUTH] Registration failed:', error);
    return {
      success: false,
      message: error.message || 'Registration failed'
    };
  }
};

/**
 * Logout user
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - { success, message }
 */
export const logout = async (token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});

    if (!response.success) {
      return {
        success: false,
        message: response.error || 'Logout failed'
      };
    }

    return {
      success: true,
      message: 'Logout successful'
    };
  } catch (error) {
    console.error('[AUTH] Logout failed:', error);
    return {
      success: false,
      message: error.message || 'Logout failed'
    };
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email) => {
  try {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST, { email });

    if (!response.success) {
      return { success: false, message: response.error || 'Failed to request password reset' };
    }

    return { success: true, message: 'Password reset instructions sent to your email' };
  } catch (error) {
    console.error('[AUTH] Password reset request failed:', error);
    return { success: false, message: error.message || 'Failed to request password reset' };
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
  try {
    if (!token) {
      throw new Error('Reset token is required');
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
      token,
      password: newPassword
    });

    if (!response.success) {
      return { success: false, message: response.error || 'Password reset failed' };
    }

    return { success: true, message: 'Password reset successful' };
  } catch (error) {
    console.error('[AUTH] Password reset failed:', error);
    return { success: false, message: error.message || 'Password reset failed' };
  }
};

/**
 * Change password (authenticated user)
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    if (!currentPassword || !newPassword) {
      throw new Error('Both current and new passwords are required');
    }

    if (currentPassword === newPassword) {
      throw new Error('New password must be different from current password');
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    });

    if (!response.success) {
      return { success: false, message: response.error || 'Password change failed' };
    }

    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    console.error('[AUTH] Password change failed:', error);
    return { success: false, message: error.message || 'Password change failed' };
  }
};

/**
 * Refresh authentication token
 * @param {string} refreshToken - Refresh token
 */
export const refreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });

    if (!response.success) {
      return { success: false, message: response.error || 'Token refresh failed' };
    }

    const data = response.data || {};

    return {
      success: true,
      token: data.token,
      refreshToken: data.refreshToken,
      user: data.user,
      message: 'Token refreshed successfully'
    };
  } catch (error) {
    console.error('[AUTH] Token refresh failed:', error);
    return { success: false, message: error.message || 'Token refresh failed' };
  }
};

/**
 * Verify authentication token
 */
export const verifyToken = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.VERIFY);

    if (!response.success) {
      return { success: false, message: response.error || 'Invalid token' };
    }

    return { success: true, user: response.data?.user, message: 'Token is valid' };
  } catch (error) {
    console.error('[AUTH] Token verification failed:', error);
    return { success: false, message: error.message || 'Invalid token' };
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);

    if (!response.success) {
      return { success: false, message: response.error || 'Failed to get user profile' };
    }

    return { success: true, user: response.data, message: 'Profile retrieved successfully' };
  } catch (error) {
    console.error('[AUTH] Failed to get user profile:', error);
    return { success: false, message: error.message || 'Failed to get user profile' };
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (updates) => {
  try {
    if (updates.email && !validateEmail(updates.email)) {
      throw new Error('Invalid email format');
    }

    const response = await apiClient.put(API_ENDPOINTS.PROFILE.UPDATE, updates);

    if (!response.success) {
      return { success: false, message: response.error || 'Profile update failed' };
    }

    return { success: true, user: response.data, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('[AUTH] Profile update failed:', error);
    return { success: false, message: error.message || 'Profile update failed' };
  }
};

export default {
  login,
  register,
  logout,
  requestPasswordReset,
  resetPassword,
  changePassword,
  refreshToken,
  verifyToken,
  getCurrentUser,
  updateProfile
};
