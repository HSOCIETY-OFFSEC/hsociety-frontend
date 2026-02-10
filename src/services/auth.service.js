// src/modules/auth/services/auth.service.js

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient } from '../../../shared/services/api.client';

class AuthService {
  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{user: object, token: string}>}
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Signup new user
   * @param {object} userData - {name, email, password}
   * @returns {Promise<{user: object, token: string}>}
   */
  async signup(userData) {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on backend, clear client state
      console.error('Logout error:', error);
    }
  }

  /**
   * Verify current session
   * @returns {Promise<object|null>} User data or null
   */
  async verifySession() {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.data.user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Request password reset
   * @param {string} email 
   * @returns {Promise<{message: string}>}
   */
  async requestPasswordReset(email) {
    try {
      const response = await apiClient.post('/auth/password-reset/request', {
        email,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reset password with token
   * @param {string} token 
   * @param {string} newPassword 
   * @returns {Promise<{message: string}>}
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post('/auth/password-reset/confirm', {
        token,
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error 
   * @returns {Error}
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const authService = new AuthService();