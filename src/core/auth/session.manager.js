/**
 * Session Manager
 * Location: src/core/auth/session.manager.js
 * 
 * Features:
 * - Secure session storage
 * - Session validation
 * - Encryption-ready (placeholder)
 * - No long-term storage (session-based only)
 * 
 * Security:
 * - Uses sessionStorage (cleared on tab close)
 * - Token encryption placeholders
 * - Session expiry validation
 */

import { encrypt } from '../encryption/encrypt';
import { decrypt } from '../encryption/decrypt';
import { envConfig } from '../../config/app/env.config';
import { logger } from '../logging/logger';

const SESSION_KEY = 'hsociety_session';
const DEFAULT_SESSION_FALLBACK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days fallback if no exp

const parseJwtExpiry = (token) => {
  if (!token) return null;
  const parts = String(token).split('.');
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(atob(parts[1]));
    if (payload?.exp) return Number(payload.exp) * 1000;
    return null;
  } catch {
    return null;
  }
};

class SessionManager {
  constructor() {
    this.storage = typeof window !== 'undefined' ? window.sessionStorage : null;
    this.inMemoryToken = null;
  }

  /**
   * Store session data
   * @param {Object} sessionData - { user, token, timestamp }
   */
  setSession(sessionData) {
    if (!this.storage) return false;

    try {
      const shouldPersistTokens =
        envConfig.security.storeAccessTokenInStorage || sessionData?.user?.role === 'student';
      const tokenExpiry = parseJwtExpiry(sessionData.token);
      const derivedExpiry =
        sessionData.expiresAt
        || tokenExpiry
        || (sessionData.token ? Date.now() + DEFAULT_SESSION_FALLBACK_MS : null);
      if (sessionData.token) {
        this.inMemoryToken = sessionData.token;
      }
      const session = {
        ...sessionData,
        token: shouldPersistTokens ? sessionData.token : undefined,
        refreshToken: shouldPersistTokens ? sessionData.refreshToken : undefined,
        timestamp: sessionData.timestamp || Date.now(),
        expiresAt: derivedExpiry
      };

      // TODO: Encrypt sensitive data before storing
      // const encryptedSession = encrypt(JSON.stringify(session));
      // this.storage.setItem(SESSION_KEY, encryptedSession);

      // For now, store as JSON (placeholder)
      this.storage.setItem(SESSION_KEY, JSON.stringify(session));

      return true;
    } catch (error) {
      logger.error('Failed to set session:', error);
      return false;
    }
  }

  /**
   * Retrieve session data
   * @returns {Object|null} - Session data or null
   */
  getSession() {
    if (!this.storage) return null;

    try {
      const sessionData = this.storage.getItem(SESSION_KEY);
      
      if (!sessionData) return null;

      // TODO: Decrypt session data
      // const decryptedSession = decrypt(sessionData);
      // return JSON.parse(decryptedSession);

      // For now, parse JSON directly (placeholder)
      return JSON.parse(sessionData);
    } catch (error) {
      logger.error('Failed to get session:', error);
      return null;
    }
  }

  /**
   * Update existing session
   * @param {Object} updates - Partial session data to update
   */
  updateSession(updates) {
    const currentSession = this.getSession();
    
    if (!currentSession) return false;

    const updatedSession = {
      ...currentSession,
      ...updates,
      timestamp: Date.now()
    };

    return this.setSession(updatedSession);
  }

  /**
   * Clear session data
   */
  clearSession() {
    if (!this.storage) return;

    try {
      this.storage.removeItem(SESSION_KEY);
      
      // Clear any other session-related items
      this.storage.removeItem('logout-reason');
      this.inMemoryToken = null;
    } catch (error) {
      logger.error('Failed to clear session:', error);
    }
  }

  /**
   * Check if session is valid
   * @returns {boolean}
   */
  isSessionValid() {
    const session = this.getSession();
    
    if (!session) return false;
    
    // Check if session has required fields
    if (!session.user) return false;
    
    // Check if session has expired
    if (!session.expiresAt || Date.now() > session.expiresAt) {
      logger.info('Session expired');
      this.clearSession();
      return false;
    }
    
    return true;
  }

  /**
   * Get session token
   * @returns {string|null}
   */
  getToken() {
    if (this.inMemoryToken) return this.inMemoryToken;
    const session = this.getSession();
    return session ? session.token : null;
  }

  /**
   * Get refresh token
   * @returns {string|null}
   */
  getRefreshToken() {
    const session = this.getSession();
    return session ? session.refreshToken : null;
  }

  /**
   * Get session user
   * @returns {Object|null}
   */
  getUser() {
    const session = this.getSession();
    return session ? session.user : null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.isSessionValid();
  }

  /**
   * Get session age in milliseconds
   * @returns {number|null}
   */
  getSessionAge() {
    const session = this.getSession();
    
    if (!session || !session.timestamp) return null;
    
    return Date.now() - session.timestamp;
  }

  /**
   * Get time until session expires
   * @returns {number|null} - Milliseconds until expiry
   */
  getTimeUntilExpiry() {
    const session = this.getSession();
    
    if (!session || !session.expiresAt) return null;
    
    const remaining = session.expiresAt - Date.now();
    return remaining > 0 ? remaining : 0;
  }
}

// Export singleton instance - THIS IS THE KEY LINE!
export const sessionManager = new SessionManager();

// Also export the class as default
export default SessionManager;
