// src/modules/auth/context/AuthContext.jsx

/**
 * Authentication Context
 * Manages global authentication state and user session
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state on mount
   * Verify existing session with backend
   */
  useEffect(() => {
    initializeAuth();
    setupAuthListener();
  }, []);

  /**
   * Verify session on app load
   */
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const userData = await authService.verifySession();
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (err) {
      // Session invalid or expired
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Listen for unauthorized events
   */
  const setupAuthListener = () => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.login(email, password);
      
      setUser(response.user);
      setIsAuthenticated(true);

      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signup new user
   */
  const signup = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.signup(userData);
      
      setUser(response.user);
      setIsAuthenticated(true);

      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  /**
   * Update user data
   */
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData,
    }));
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;