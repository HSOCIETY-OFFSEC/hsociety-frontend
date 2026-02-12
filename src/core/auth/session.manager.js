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

const SESSION_KEY = 'hsociety_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

class SessionManager {
  constructor() {
    this.storage = typeof window !== 'undefined' ? window.sessionStorage : null;
  }

  /**
   * Store session data
   * @param {Object} sessionData - { user, token, timestamp }
   */
  setSession(sessionData) {
    if (!this.storage) return false;

    try {
      const session = {
        ...sessionData,
        timestamp: sessionData.timestamp || Date.now(),
        expiresAt: Date.now() + SESSION_DURATION
      };

      // TODO: Encrypt sensitive data before storing
      // const encryptedSession = encrypt(JSON.stringify(session));
      // this.storage.setItem(SESSION_KEY, encryptedSession);

      // For now, store as JSON (placeholder)
      this.storage.setItem(SESSION_KEY, JSON.stringify(session));

      return true;
    } catch (error) {
      console.error('Failed to set session:', error);
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
      console.error('Failed to get session:', error);
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
    } catch (error) {
      console.error('Failed to clear session:', error);
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
    if (!session.user || !session.token) return false;
    
    // Check if session has expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      console.log('Session expired');
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
    const session = this.getSession();
    return session ? session.token : null;
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