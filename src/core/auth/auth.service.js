/**
 * Authentication Service
 * Location: src/core/auth/auth.service.js
 */

import { API_ENDPOINTS } from '../../config/api/api.config';
import { apiClient } from '../../shared/services/api.client';
import { validateEmail, validatePassword } from '../validation/input.validator';

const getPublicAuthMessage = (action, responseOrError = null) => {
  const status = responseOrError?.status;
  if (status === 0) {
    return 'Connection error. Please try again.';
  }

  switch (action) {
    case 'login':
      return 'Login failed. Please try again.';
    case 'register':
      return 'Registration failed. Please try again.';
    case 'logout':
      return 'Logout failed. Please try again.';
    case 'request_reset':
      return 'Password reset request failed. Please try again.';
    case 'reset_password':
      return 'Password reset failed. Please try again.';
    case 'change_password':
      return 'Password change failed. Please try again.';
    case 'refresh':
      return 'Session refresh failed. Please try again.';
    case 'verify':
      return 'Session verification failed. Please try again.';
    case 'profile':
      return 'Profile update failed. Please try again.';
    default:
      return 'Request failed. Please try again.';
  }
};

/**
 * Login with email and password.
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - { success, user, token, refreshToken, twoFactorRequired, twoFactorToken, mustChangePassword, passwordChangeToken, message }
 */
export const login = async (identity, password) => {
  try {
    if (!identity || String(identity).trim().length < 2) {
      return { success: false, message: getPublicAuthMessage('login') };
    }

    if (!password || password.length < 6) {
      return { success: false, message: getPublicAuthMessage('login') };
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email: String(identity).trim(),
      password,
    });

    if (!response.success) {
      return {
        success: false,
        message: getPublicAuthMessage('login', response)
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
      expiresIn: data.expiresIn,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('[AUTH] Login failed:', error);
    return {
      success: false,
      message: getPublicAuthMessage('login', error)
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
      return { success: false, message: getPublicAuthMessage('register') };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, message: getPublicAuthMessage('register') };
    }

    if (!name || name.trim().length < 2) {
      return { success: false, message: getPublicAuthMessage('register') };
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      name: name.trim()
    });

    if (!response.success) {
      return {
        success: false,
        message: getPublicAuthMessage('register', response)
      };
    }

    const data = response.data || {};

    return {
      success: true,
      user: data.user,
      token: data.token,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      message: 'Registration successful'
    };
  } catch (error) {
    console.error('[AUTH] Registration failed:', error);
    return {
      success: false,
      message: getPublicAuthMessage('register', error)
    };
  }
};

/**
 * Check if an email already exists in the system.
 * @param {string} email
 * @returns {Promise<Object>} - { success, exists, message }
 */
export const checkEmailExists = async (email) => {
  try {
    if (!validateEmail(email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.CHECK_EMAIL, { email });

    if (!response.success) {
      return {
        success: false,
        message: getPublicAuthMessage('register', response)
      };
    }

    return { success: true, exists: Boolean(response.data?.exists) };
  } catch (error) {
    console.error('[AUTH] Email check failed:', error);
    return {
      success: false,
      message: getPublicAuthMessage('register', error)
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
      return { success: false, message: getPublicAuthMessage('logout') };
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});

    if (!response.success) {
      return {
        success: false,
        message: getPublicAuthMessage('logout', response)
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
      message: getPublicAuthMessage('logout', error)
    };
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email) => {
  try {
    if (!validateEmail(email)) {
      return { success: false, message: getPublicAuthMessage('request_reset') };
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST, { email });

    if (!response.success) {
      return { success: false, message: getPublicAuthMessage('request_reset', response) };
    }

    return { success: true, message: 'Password reset instructions sent to your email' };
  } catch (error) {
    console.error('[AUTH] Password reset request failed:', error);
    return { success: false, message: getPublicAuthMessage('request_reset', error) };
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
  try {
    if (!token) {
      return { success: false, message: getPublicAuthMessage('reset_password') };
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return { success: false, message: getPublicAuthMessage('reset_password') };
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
      token,
      password: newPassword
    });

    if (!response.success) {
      return { success: false, message: getPublicAuthMessage('reset_password', response) };
    }

    return { success: true, message: 'Password reset successful' };
  } catch (error) {
    console.error('[AUTH] Password reset failed:', error);
    return { success: false, message: getPublicAuthMessage('reset_password', error) };
  }
};

/**
 * Change password (authenticated user)
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    if (!currentPassword || !newPassword) {
      return { success: false, message: getPublicAuthMessage('change_password') };
    }

    if (currentPassword === newPassword) {
      return { success: false, message: getPublicAuthMessage('change_password') };
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return { success: false, message: getPublicAuthMessage('change_password') };
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    });

    if (!response.success) {
      return { success: false, message: getPublicAuthMessage('change_password', response) };
    }

    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    console.error('[AUTH] Password change failed:', error);
    return { success: false, message: getPublicAuthMessage('change_password', error) };
  }
};

/**
 * Refresh authentication token
 * @param {string} refreshToken - Refresh token
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, refreshToken ? { refreshToken } : {});

    if (!response.success) {
      return { success: false, message: getPublicAuthMessage('refresh', response) };
    }

    const data = response.data || {};

    return {
      success: true,
      token: data.token,
      refreshToken: data.refreshToken,
      user: data.user,
      expiresIn: data.expiresIn,
      message: 'Token refreshed successfully'
    };
  } catch (error) {
    console.error('[AUTH] Token refresh failed:', error);
    return { success: false, message: getPublicAuthMessage('refresh', error) };
  }
};

/**
 * Verify authentication token
 */
export const verifyToken = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.VERIFY);

    if (!response.success) {
      return { success: false, message: getPublicAuthMessage('verify', response) };
    }

    return { success: true, user: response.data?.user, message: 'Token is valid' };
  } catch (error) {
    console.error('[AUTH] Token verification failed:', error);
    return { success: false, message: getPublicAuthMessage('verify', error) };
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);

    if (!response.success) {
      return { success: false, message: getPublicAuthMessage('verify', response) };
    }

    return { success: true, user: response.data, message: 'Profile retrieved successfully' };
  } catch (error) {
    console.error('[AUTH] Failed to get user profile:', error);
    return { success: false, message: getPublicAuthMessage('verify', error) };
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (updates) => {
  try {
    if (updates.email && !validateEmail(updates.email)) {
      return { success: false, message: getPublicAuthMessage('profile') };
    }

    const response = await apiClient.put(API_ENDPOINTS.PROFILE.UPDATE, updates);

    if (!response.success) {
      return { success: false, message: getPublicAuthMessage('profile', response) };
    }

    return { success: true, user: response.data, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('[AUTH] Profile update failed:', error);
    return { success: false, message: getPublicAuthMessage('profile', error) };
  }
};

export default {
  login,
  register,
  checkEmailExists,
  logout,
  requestPasswordReset,
  resetPassword,
  changePassword,
  refreshToken,
  verifyToken,
  getCurrentUser,
  updateProfile
};
