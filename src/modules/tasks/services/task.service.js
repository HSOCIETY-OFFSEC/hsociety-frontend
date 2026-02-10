// src/modules/tasks/services/task.service.js

/**
 * Task Service
 * Handles all task-related API calls
 */

import { apiClient } from '../../../shared/services/api.client';

class TaskService {
  /**
   * Get all tasks
   * @returns {Promise<Array>}
   */
  async getAllTasks() {
    try {
      const response = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get task by ID
   * @param {string} id 
   * @returns {Promise<object>}
   */
  async getTaskById(id) {
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new task
   * @param {object} taskData 
   * @returns {Promise<object>}
   */
  async createTask(taskData) {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update existing task
   * @param {string} id 
   * @param {object} taskData 
   * @returns {Promise<object>}
   */
  async updateTask(id, taskData) {
    try {
      const response = await apiClient.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete task
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async deleteTask(id) {
    try {
      await apiClient.delete(`/tasks/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update task status
   * @param {string} id 
   * @param {string} status - 'pending', 'in-progress', 'completed', 'blocked'
   * @returns {Promise<object>}
   */
  async updateStatus(id, status) {
    try {
      const response = await apiClient.patch(`/tasks/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update task priority
   * @param {string} id 
   * @param {string} priority - 'critical', 'high', 'medium', 'low'
   * @returns {Promise<object>}
   */
  async updatePriority(id, priority) {
    try {
      const response = await apiClient.patch(`/tasks/${id}/priority`, {
        priority,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tasks by status
   * @param {string} status 
   * @returns {Promise<Array>}
   */
  async getTasksByStatus(status) {
    try {
      const response = await apiClient.get('/tasks', {
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tasks by priority
   * @param {string} priority 
   * @returns {Promise<Array>}
   */
  async getTasksByPriority(priority) {
    try {
      const response = await apiClient.get('/tasks', {
        params: { priority },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tasks assigned to user
   * @param {string} userId 
   * @returns {Promise<Array>}
   */
  async getTasksByUser(userId) {
    try {
      const response = await apiClient.get('/tasks', {
        params: { assignedTo: userId },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tasks for specific pentest project
   * @param {string} projectId 
   * @returns {Promise<Array>}
   */
  async getTasksByProject(projectId) {
    try {
      const response = await apiClient.get('/tasks', {
        params: { project: projectId },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Assign task to user
   * @param {string} taskId 
   * @param {string} userId 
   * @returns {Promise<object>}
   */
  async assignTask(taskId, userId) {
    try {
      const response = await apiClient.patch(`/tasks/${taskId}/assign`, {
        assignedTo: userId,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Add comment to task
   * @param {string} taskId 
   * @param {string} comment 
   * @returns {Promise<object>}
   */
  async addComment(taskId, comment) {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/comments`, {
        comment,
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
      const message = error.response.data?.message || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const taskService = new TaskService();