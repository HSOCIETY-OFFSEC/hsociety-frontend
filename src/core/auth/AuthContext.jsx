import React, { createContext, useContext, useState, useEffect } from 'react';
import { sessionManager } from './session.manager';
import { setupAutoLogout } from '../inactivity/autoLogout';
import { refreshToken as refreshAuthToken, logout as logoutRequest } from './auth.service';
import { envConfig } from '../../config/app/env.config';
import { trackSecurityEvent } from '../security/security-events.service';
import { setPendingToast } from '../../shared/utils/toastStorage';
import { buildAuthModalUrl } from '../../shared/utils/auth/authModal';

/**
 * Authentication Context
 * Location: src/core/auth/AuthContext.jsx
 * 
 * Features:
 * - User authentication state management
 * - Secure session handling
 * - Auto logout on inactivity
 * - Token management
 * - Protected route support
 * 
 * Flow:
 * - Login → Store user & token → Start inactivity monitor
 * - Logout → Clear session → Redirect to login
 * - Auto logout → Clear session → Show timeout message
 */

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoLogoutCleanup, setAutoLogoutCleanup] = useState(null);
  const requireEmailVerification = envConfig.auth.requireEmailVerification;

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication from stored session
  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // Check for existing session
      const session = sessionManager.getSession();
      
      if (session && session.user) {
        // SECURITY UPDATE IMPLEMENTED: Block access until password meets strength (mustChangePassword)
        if (session.user?.mustChangePassword) {
          sessionManager.clearSession();
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
          if (typeof window !== 'undefined') {
            window.location.href = buildAuthModalUrl('login', { reason: 'password_required' });
          }
          return;
        }
        if (requireEmailVerification && session.user?.emailVerified === false) {
          sessionManager.clearSession();
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
          if (typeof window !== 'undefined') {
            window.location.href = '/verify-email';
          }
          return;
        }

        // Verify session is still valid
        const isValid = sessionManager.isSessionValid();
        
        if (isValid) {
          setUser(session.user);
          setToken(session.token || null);
          setIsAuthenticated(true);

          if (!session.token) {
            const refreshed = await refreshToken();
            if (refreshed?.success) {
              setToken(refreshed.token);
            }
          }
          
          // Setup auto logout monitoring
          setupInactivityMonitor();
        } else {
          // Try refresh before forcing logout
          const refreshed = await refreshToken();
          if (!refreshed?.success) {
            await logout(false);
          } else {
            const nextSession = sessionManager.getSession();
            if (nextSession?.user && nextSession?.token) {
              setUser(nextSession.user);
              setToken(nextSession.token);
              setIsAuthenticated(true);
              setupInactivityMonitor();
            }
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await logout(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Setup auto logout on inactivity
  const setupInactivityMonitor = () => {
    // Clear existing cleanup if any
    if (autoLogoutCleanup) {
      autoLogoutCleanup();
    }

    // Setup new auto logout monitor
    const cleanup = setupAutoLogout({
      timeout: envConfig.auth.inactivityTimeout,
      onTimeout: async () => {
        console.log('Session timed out due to inactivity');
        trackSecurityEvent(
          {
            eventType: 'session_timeout',
            action: 'auto_logout',
          },
          { forceSend: true }
        );
        await logout(true);
      },
      events: ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'mousemove']
    });

    setAutoLogoutCleanup(() => cleanup);
  };

  // Login function
  const login = async (userData, authToken, refreshToken = null, expiresIn = null) => {
    try {
      // Validate input
      if (!userData || !authToken) {
        throw new Error('Invalid login credentials');
      }

      const expiresAt = expiresIn ? Date.now() + Number(expiresIn) * 1000 : undefined;

      // Store session
      sessionManager.setSession({
        user: userData,
        token: authToken,
        refreshToken,
        expiresAt,
        timestamp: Date.now()
      });

      // Update state
      setUser(userData);
      setToken(authToken);
      setIsAuthenticated(true);

      // Setup auto logout monitoring
      setupInactivityMonitor();
      if (typeof window !== 'undefined' && envConfig.community?.whatsappUrl) {
        sessionStorage.setItem('hsociety.whatsappPopup', '1');
      }
      trackSecurityEvent(
        {
          eventType: 'auth_activity',
          action: 'login_success',
          path: typeof window !== 'undefined' ? window.location.pathname : '',
        },
        { forceSend: true }
      );

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Logout function
  const logout = async (isAutoLogout = false) => {
    try {
      // Clear auto logout monitor
      if (autoLogoutCleanup) {
        autoLogoutCleanup();
        setAutoLogoutCleanup(null);
      }

      if (token) {
        await logoutRequest(token);
      }

      // Clear local session
      sessionManager.clearSession();

      // Update state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      // Show message if auto logout
      if (isAutoLogout) {
        // Store message for login page to display
        sessionStorage.setItem('logout-reason', 'inactivity');
      } else {
        setPendingToast({
          variant: 'success',
          title: 'Signed out',
          message: 'You have safely logged out.',
          duration: 3600,
        });
      }

      trackSecurityEvent(
        {
          eventType: 'auth_activity',
          action: isAutoLogout ? 'logout_inactivity' : 'logout_manual',
          path: typeof window !== 'undefined' ? window.location.pathname : '',
        },
        { forceSend: true }
      );

      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/posts?auth=login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      
      // Force clear session anyway
      sessionManager.clearSession();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    if (!isAuthenticated) return;

    const updatedUser = { ...user, ...userData };
    
    // Update session
    sessionManager.updateSession({ user: updatedUser });
    
    // Update state
    setUser(updatedUser);
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const session = sessionManager.getSession();
      const currentRefreshToken = session?.refreshToken;
      if (!currentRefreshToken) {
        throw new Error('Refresh token is required');
      }

      const response = await refreshAuthToken(currentRefreshToken);
      if (!response.success) {
        throw new Error(response.message || 'Token refresh failed');
      }

      const newToken = response.token;
      const newRefreshToken = response.refreshToken;
      const expiresAt = response.expiresIn ? Date.now() + Number(response.expiresIn) * 1000 : undefined;

      // Update session
      sessionManager.updateSession({ token: newToken, refreshToken: newRefreshToken, expiresAt });
      
      // Update state
      setToken(newToken);

      return { success: true, token: newToken };
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return { success: false, error: 'Session refresh failed. Please try again.' };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user || !user.role) return false;
    return user.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  const value = {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    logout,
    updateUser,
    refreshToken,
    
    // Utilities
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
