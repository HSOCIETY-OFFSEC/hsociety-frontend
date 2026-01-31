// src/services/user.service.js

/**
 * User Service
 * Handles user-related operations
 */

import { apiService } from './api.service.js';
import { API_ROUTES } from '../config/api.config.js';

class UserService {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const response = await apiService.get(API_ROUTES.USER.PROFILE);
      return response.data || response;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(updates) {
    try {
      const response = await apiService.put(API_ROUTES.USER.UPDATE, updates);
      return response.data || response;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  /**
   * Update user settings
   * @param {Object} settings - User settings
   * @returns {Promise<Object>} Updated settings
   */
  async updateSettings(settings) {
    try {
      const response = await apiService.put(API_ROUTES.USER.SETTINGS, settings);
      return response.data || response;
    } catch (error) {
      console.error('Failed to update user settings:', error);
      throw error;
    }
  }

  /**
   * Delete user account
   * @returns {Promise<void>}
   */
  async deleteAccount() {
    try {
      await apiService.delete(API_ROUTES.USER.DELETE);
    } catch (error) {
      console.error('Failed to delete user account:', error);
      throw error;
    }
  }

  /**
   * Change password
   * @param {string} currentPassword 
   * @param {string} newPassword 
   * @returns {Promise<Object>}
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.post('/user/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data || response;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  /**
   * Upload profile picture
   * @param {File} file 
   * @returns {Promise<Object>}
   */
  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiService.post('/user/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data || response;
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;