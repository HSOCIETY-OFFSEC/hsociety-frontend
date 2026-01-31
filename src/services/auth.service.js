// src/services/auth.service.js

/**
 * Authentication Service
 * Handles all authentication operations
 * Uses httpOnly cookies for token storage (secure)
 */

import { apiService } from './api.service.js';
import { API_ROUTES } from '../config/api.config.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} User data
   */
  async login(email, password) {
    try {
      const response = await apiService.post(API_ROUTES.AUTH.LOGIN, {
        email,
        password,
      });

      // Response contains user data, tokens are in httpOnly cookies
      this.currentUser = response.user;
      this.isAuthenticated = true;

      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Register new user
   * @param {Object} userData 
   * @returns {Promise<Object>} User data
   */
  async signup(userData) {
    try {
      const response = await apiService.post(API_ROUTES.AUTH.SIGNUP, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      this.currentUser = response.user;
      this.isAuthenticated = true;

      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiService.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API response
      this.currentUser = null;
      this.isAuthenticated = false;
    }
  }

  /**
   * Verify current session
   * Called on app initialization
   */
  async verifySession() {
    try {
      const response = await apiService.get(API_ROUTES.AUTH.VERIFY);
      
      this.currentUser = response.user;
      this.isAuthenticated = true;

      return response.user;
    } catch (error) {
      this.currentUser = null;
      this.isAuthenticated = false;
      return null;
    }
  }

  /**
   * Refresh access token
   * Automatically called when token expires
   */
  async refreshToken() {
    try {
      const response = await apiService.post(API_ROUTES.AUTH.REFRESH);
      return response;
    } catch (error) {
      // Refresh failed, logout user
      await this.logout();
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email 
   */
  async forgotPassword(email) {
    try {
      const response = await apiService.post(API_ROUTES.AUTH.FORGOT_PASSWORD, {
        email,
      });
      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {string} token 
   * @param {string} newPassword 
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post(API_ROUTES.AUTH.RESET_PASSWORD, {
        token,
        password: newPassword,
      });
      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  /**
   * Handle authentication errors
   */
  handleAuthError(error) {
    // Log for debugging (remove in production or use proper logging service)
    console.error('Auth error:', error);

    // Handle specific error cases
    if (error.status === 429) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    if (error.status === 401) {
      throw new Error('Invalid credentials. Please try again.');
    }

    if (error.status === 403) {
      throw new Error('Account is locked or suspended.');
    }

    // Generic error
    throw new Error(error.message || 'Authentication failed. Please try again.');
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;