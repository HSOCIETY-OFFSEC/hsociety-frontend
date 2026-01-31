// src/services/task.service.js

/**
 * Task Service
 * Handles all task-related operations
 */

import { apiService } from './api.service.js';
import { API_ROUTES } from '../config/api.config.js';

class TaskService {
  /**
   * Get all tasks
   * @param {Object} filters - Optional filters (status, priority, assignedTo, etc.)
   * @returns {Promise<Array>} List of tasks
   */
  async getAllTasks(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams 
        ? `${API_ROUTES.TASKS.LIST}?${queryParams}`
        : API_ROUTES.TASKS.LIST;

      const response = await apiService.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  }

  /**
   * Get single task by ID
   * @param {string|number} id 
   * @returns {Promise<Object>} Task data
   */
  async getTaskById(id) {
    try {
      const response = await apiService.get(API_ROUTES.TASKS.GET(id));
      return response.data || response;
    } catch (error) {
      console.error(`Failed to fetch task ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get tasks by project
   * @param {string|number} projectId 
   * @returns {Promise<Array>} List of tasks
   */
  async getTasksByProject(projectId) {
    try {
      const response = await apiService.get(API_ROUTES.TASKS.BY_PROJECT(projectId));
      return response.data || response;
    } catch (error) {
      console.error(`Failed to fetch tasks for project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Create new task
   * @param {Object} taskData 
   * @returns {Promise<Object>} Created task
   */
  async createTask(taskData) {
    try {
      const response = await apiService.post(API_ROUTES.TASKS.CREATE, taskData);
      return response.data || response;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }

  /**
   * Update existing task
   * @param {string|number} id 
   * @param {Object} updates 
   * @returns {Promise<Object>} Updated task
   */
  async updateTask(id, updates) {
    try {
      const response = await apiService.put(API_ROUTES.TASKS.UPDATE(id), updates);
      return response.data || response;
    } catch (error) {
      console.error(`Failed to update task ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete task
   * @param {string|number} id 
   * @returns {Promise<void>}
   */
  async deleteTask(id) {
    try {
      await apiService.delete(API_ROUTES.TASKS.DELETE(id));
    } catch (error) {
      console.error(`Failed to delete task ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get pending tasks
   * @returns {Promise<Array>} Pending tasks
   */
  async getPendingTasks() {
    return this.getAllTasks({ status: 'pending' });
  }

  /**
   * Get in-progress tasks
   * @returns {Promise<Array>} In-progress tasks
   */
  async getInProgressTasks() {
    return this.getAllTasks({ status: 'in-progress' });
  }

  /**
   * Get completed tasks
   * @returns {Promise<Array>} Completed tasks
   */
  async getCompletedTasks() {
    return this.getAllTasks({ status: 'completed' });
  }

  /**
   * Get tasks by priority
   * @param {string} priority - critical, high, medium, low
   * @returns {Promise<Array>} Filtered tasks
   */
  async getTasksByPriority(priority) {
    return this.getAllTasks({ priority });
  }

  /**
   * Update task status
   * @param {string|number} id 
   * @param {string} status 
   * @returns {Promise<Object>} Updated task
   */
  async updateTaskStatus(id, status) {
    return this.updateTask(id, { status });
  }

  /**
   * Assign task to user
   * @param {string|number} id 
   * @param {string} userId 
   * @returns {Promise<Object>} Updated task
   */
  async assignTask(id, userId) {
    return this.updateTask(id, { assignedTo: userId });
  }

  /**
   * Update task priority
   * @param {string|number} id 
   * @param {string} priority 
   * @returns {Promise<Object>} Updated task
   */
  async updateTaskPriority(id, priority) {
    return this.updateTask(id, { priority });
  }
}

// Export singleton instance
export const taskService = new TaskService();
export default taskService;