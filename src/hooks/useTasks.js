// src/hooks/useTasks.js

/**
 * Custom hook for task operations
 * Provides easy access to task data and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/task.service';

export const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all tasks
   */
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await taskService.getAllTasks(filters);
      setTasks(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch tasks';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Create new task
   */
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);

      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update existing task
   */
  const updateTask = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);

      const updatedTask = await taskService.updateTask(id, updates);
      setTasks(prev =>
        prev.map(t => (t.id === id ? updatedTask : t))
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete task
   */
  const deleteTask = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update task status
   */
  const updateTaskStatus = useCallback(async (id, status) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(id, status);
      setTasks(prev =>
        prev.map(t => (t.id === id ? updatedTask : t))
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update task status';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Update task priority
   */
  const updateTaskPriority = useCallback(async (id, priority) => {
    try {
      const updatedTask = await taskService.updateTaskPriority(id, priority);
      setTasks(prev =>
        prev.map(t => (t.id === id ? updatedTask : t))
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update task priority';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Assign task to user
   */
  const assignTask = useCallback(async (id, userId) => {
    try {
      const updatedTask = await taskService.assignTask(id, userId);
      setTasks(prev =>
        prev.map(t => (t.id === id ? updatedTask : t))
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err.message || 'Failed to assign task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Get task by ID
   */
  const getTaskById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const task = await taskService.getTaskById(id);
      return task;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get tasks by project
   */
  const getTasksByProject = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await taskService.getTasksByProject(projectId);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch project tasks';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh tasks data
   */
  const refresh = useCallback(() => {
    return fetchTasks();
  }, [fetchTasks]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskPriority,
    assignTask,
    getTaskById,
    getTasksByProject,
    refresh,
    clearError,
  };
};

export default useTasks;