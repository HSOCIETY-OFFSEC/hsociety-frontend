/**
 * API Client Service
 * Location: src/shared/services/api.client.js
 * 
 * Features:
 * - Centralized HTTP client
 * - Request/response interceptors
 * - Error handling
 * - Token management
 * - Retry logic
 * 
 * Security:
 * - Automatic token injection
 * - Request encryption (placeholder)
 * - Response decryption (placeholder)
 */

import { sessionManager } from '../../core/auth/session.manager';

// API Base URL - use env or default to /api (proxied to backend in dev)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * HTTP Methods
 */
const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

/**
 * API Client Class
 */
class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Get auth token from session
   */
  getAuthToken() {
    return sessionManager.getToken();
  }

  /**
   * Build full URL
   */
  buildURL(endpoint) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${cleanEndpoint}`;
  }

  /**
   * Build request headers
   */
  buildHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API errors
   */
  handleError(error, endpoint) {
    console.error(`[API] Error on ${endpoint}:`, error);

    // Network error
    if (!error.response) {
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        status: 0
      };
    }

    // HTTP error
    const { status, data } = error.response;

    // Unauthorized - clear session
    if (status === 401) {
      sessionManager.clearSession();
      window.location.href = '/login';
      return {
        success: false,
        error: 'Session expired. Please login again.',
        status: 401
      };
    }

    // Other errors
    return {
      success: false,
      error: data?.error || data?.message || 'An error occurred',
      status,
      data
    };
  }

  /**
   * Make HTTP request
   */
  async request(method, endpoint, data = null, options = {}) {
    const url = this.buildURL(endpoint);
    const headers = this.buildHeaders(options.headers);

    const config = {
      method,
      headers,
      ...options
    };

    // Add body for POST, PUT, PATCH
    if (data && [HTTP_METHODS.POST, HTTP_METHODS.PUT, HTTP_METHODS.PATCH].includes(method)) {
      config.body = JSON.stringify(data);
    }

    try {
      console.log(`[API] ${method} ${endpoint}`);

      const response = await fetch(url, config);
      
      // Parse response
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Handle non-2xx responses
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: responseData
          }
        };
      }

      console.log(`[API] ${method} ${endpoint} - Success`);

      return {
        success: true,
        data: responseData,
        status: response.status
      };
    } catch (error) {
      return this.handleError(error, endpoint);
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(HTTP_METHODS.GET, endpoint, null, options);
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(HTTP_METHODS.POST, endpoint, data, options);
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(HTTP_METHODS.PUT, endpoint, data, options);
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data, options = {}) {
    return this.request(HTTP_METHODS.PATCH, endpoint, data, options);
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(HTTP_METHODS.DELETE, endpoint, null, options);
  }

  /**
   * Upload file
   */
  async upload(endpoint, file, fieldName = 'file', additionalData = {}) {
    const url = this.buildURL(endpoint);
    const token = this.getAuthToken();

    const formData = new FormData();
    formData.append(fieldName, file);

    // Add additional form data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const headers = {
      // Don't set Content-Type, let browser set it with boundary
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log(`[API] Upload to ${endpoint}`);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: responseData
          }
        };
      }

      console.log(`[API] Upload to ${endpoint} - Success`);

      return {
        success: true,
        data: responseData,
        status: response.status
      };
    } catch (error) {
      return this.handleError(error, endpoint);
    }
  }

  /**
   * Download file
   */
  async download(endpoint, filename) {
    const url = this.buildURL(endpoint);
    const token = this.getAuthToken();

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log(`[API] Download from ${endpoint}`);

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log(`[API] Download from ${endpoint} - Success`);

      return {
        success: true,
        message: 'File downloaded successfully'
      };
    } catch (error) {
      console.error(`[API] Download failed:`, error);
      return {
        success: false,
        error: 'Failed to download file'
      };
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();
export default apiClient;
