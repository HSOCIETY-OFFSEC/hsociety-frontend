// src/services/api.service.js

/**
 * API Service Layer
 * Handles all HTTP requests with error handling, retries, and interceptors
 */

import { API_CONFIG, API_ROUTES } from '../config/api.config.js';

class APIService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  /**
   * Core request method with retry logic
   */
  async request(endpoint, options = {}) {
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Send cookies for httpOnly auth tokens
      ...options,
    };

    // Add body for non-GET requests
    if (config.method !== 'GET' && options.body) {
      config.body = JSON.stringify(options.body);
    }

    const url = `${this.baseURL}${endpoint}`;

    let lastError;
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle HTTP errors
        if (!response.ok) {
          const error = await this.handleErrorResponse(response);
          throw error;
        }

        // Parse response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }

        return response;

      } catch (error) {
        lastError = error;

        // Don't retry on auth errors or client errors (4xx)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.retryAttempts - 1) {
          await this.delay(this.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError;
  }

  /**
   * Handle error responses
   */
  async handleErrorResponse(response) {
    let errorMessage = 'An error occurred';
    let errorData = null;

    try {
      errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData;

    // Handle specific status codes
    if (response.status === 401) {
      // Trigger auth refresh or logout
      this.handleUnauthorized();
    }

    return error;
  }

  /**
   * Handle unauthorized access
   */
  handleUnauthorized() {
    // Emit event for auth context to handle
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  /**
   * Delay helper for retries
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiService = new APIService();
export default apiService;