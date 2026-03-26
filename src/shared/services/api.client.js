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
import { envConfig } from '../../config/app/env.config';
import { getPublicErrorMessage } from '../utils/errors/publicError';
import { buildAuthModalUrl } from '../utils/auth/authModal';
import { logger } from '../../core/logging/logger';

const REFRESH_ENDPOINT = '/auth/refresh';

const API_BASE_URL = envConfig.api.baseURL;

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

  getCookie(name) {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : '';
  }

  /**
   * Handle API errors
   */
  handleError(error, endpoint) {
    logger.error(`[API] Error on ${endpoint}:`, error);

    // Network error
    if (!error.response) {
      return {
        success: false,
        error: getPublicErrorMessage({ response: { status: 0 } }),
        status: 0
      };
    }

    // HTTP error
    const { status, data } = error.response;

    // Unauthorized (handled in request flow for refresh)
    if (status === 401) {
      return {
        success: false,
        error: 'Session expired. Please login again.',
        status: 401
      };
    }

    // Other errors
    return {
      success: false,
      error: getPublicErrorMessage({ response: { status } }),
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
    if (endpoint === REFRESH_ENDPOINT) {
      const csrfToken = this.getCookie('csrf_token');
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      }
    }
    const controller = new AbortController();
    const timeoutMs = Number(envConfig.api.timeout || 30000);
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    // SECURITY UPDATE IMPLEMENTED: Send cookies (e.g. refresh_token) for same-origin/configured API
    const config = {
      method,
      headers,
      credentials: 'include',
      signal: controller.signal,
      ...options
    };

    // Add body for POST, PUT, PATCH
    if (data && [HTTP_METHODS.POST, HTTP_METHODS.PUT, HTTP_METHODS.PATCH].includes(method)) {
      config.body = JSON.stringify(data);
    }

    try {
      if (import.meta.env.DEV) {
        logger.info(`[API] ${method} ${endpoint}`);
      }

      const response = await fetch(url, config);
      window.clearTimeout(timeoutId);
      
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

      if (import.meta.env.DEV) {
        logger.info(`[API] ${method} ${endpoint} - Success`);
      }

      return {
        success: true,
        data: responseData,
        status: response.status
      };
    } catch (error) {
      window.clearTimeout(timeoutId);
      if (error?.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out. Please try again.',
          status: 0
        };
      }
      const status = error?.response?.status;
      if (status === 401 && !options._retry) {
        const refreshed = await this.refreshSession();
        if (refreshed) {
          return this.request(method, endpoint, data, { ...options, _retry: true });
        }
        sessionManager.clearSession();
        if (typeof window !== 'undefined') {
          window.location.href = buildAuthModalUrl('login', { reason: 'session_expired' });
        }
      }
      return this.handleError(error, endpoint);
    }
  }

  /**
   * Attempt refresh using cookie or stored refresh token.
   */
  async refreshSession() {
    try {
      const refreshToken = sessionManager.getRefreshToken?.() || null;
      const csrfToken = this.getCookie('csrf_token');
      const headers = { ...this.defaultHeaders };
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      }
      const response = await fetch(this.buildURL(REFRESH_ENDPOINT), {
        method: 'POST',
        headers,
        credentials: 'include',
        body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
      });
      const data = response.headers.get('content-type')?.includes('application/json')
        ? await response.json()
        : null;
      if (!response.ok || !data?.token || !data?.user) return false;
      sessionManager.setSession({
        user: data.user,
        token: data.token,
        refreshToken: data.refreshToken || refreshToken || null,
        expiresAt: data.expiresIn ? Date.now() + Number(data.expiresIn) * 1000 : undefined,
        timestamp: Date.now(),
      });
      return true;
    } catch {
      return false;
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
      if (import.meta.env.DEV) {
        logger.info(`[API] Upload to ${endpoint}`);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include'
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await this.refreshSession();
          if (refreshed) {
            return this.upload(endpoint, file, fieldName, additionalData);
          }
        }
        throw {
          response: {
            status: response.status,
            data: responseData
          }
        };
      }

      if (import.meta.env.DEV) {
        logger.info(`[API] Upload to ${endpoint} - Success`);
      }

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
      if (import.meta.env.DEV) {
        logger.info(`[API] Download from ${endpoint}`);
      }

      const response = await fetch(url, { headers, credentials: 'include' });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await this.refreshSession();
          if (refreshed) {
            return this.download(endpoint, filename);
          }
        }
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

      if (import.meta.env.DEV) {
        logger.info(`[API] Download from ${endpoint} - Success`);
      }

      return {
        success: true,
        message: 'File downloaded successfully'
      };
    } catch (error) {
      logger.error(`[API] Download failed:`, error);
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
