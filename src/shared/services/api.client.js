// src/shared/services/api.client.js

/**
 * API Client
 * Centralized HTTP client for all API requests
 * Handles authentication, error handling, and request/response interceptors
 */

import axios from 'axios';

// Base API URL - adjust based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Create axios instance with default config
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based authentication
});

/**
 * Request Interceptor
 * Add authentication token to requests if available
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if exists
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle common response scenarios
 */
apiClient.interceptors.response.use(
  (response) => {
    // If response contains a token, store it
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear stored token
      localStorage.removeItem('auth_token');
      
      // Dispatch custom event for auth context to handle
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data?.message);
    }
    
    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data?.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Helper function to clear authentication
 */
export const clearAuth = () => {
  localStorage.removeItem('auth_token');
};

/**
 * Helper function to check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

export { apiClient };