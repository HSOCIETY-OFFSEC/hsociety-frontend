import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Theme Provider
 * Location: src/app/providers.jsx
 * 
 * Features:
 * - Light/Black theme management
 * - Persists theme preference in localStorage
 * - Applies theme to document root
 * - Provides theme context to entire app
 * 
 * Theme Colors:
 * - Light: White background + Green accents (#10b981)
 * - Black: True black background + Green accents (#10b981)
 */

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const getPreferredTheme = useCallback(() => {
    if (typeof window === 'undefined') return 'black';
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'black';
  }, []);

  const getStoredMode = () => {
    if (typeof window === 'undefined') return 'system';
    return window.localStorage.getItem('themeMode') || 'system';
  };

  const resolveTheme = useCallback(
    (mode) => (mode === 'system' ? getPreferredTheme() : mode),
    [getPreferredTheme]
  );

  const [themeMode, setThemeMode] = useState(getStoredMode);
  const [theme, setTheme] = useState(() => resolveTheme(getStoredMode()));

  // Apply theme to document root on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Set new theme if needed (avoid reflow on initial load)
    if (root.getAttribute('data-theme') !== theme) {
      root.setAttribute('data-theme', theme);
    }
    root.style.colorScheme = theme === 'light' ? 'light' : 'dark';
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const themeColorMap = {
        light: '#ffffff',
        black: '#000000'
      };
      metaThemeColor.setAttribute('content', themeColorMap[theme] || '#000000');
    }
    
    // Keep a single favicon set across themes.
    updateFavicon();
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('themeMode', themeMode);
    }
    setTheme(resolveTheme(themeMode));
  }, [themeMode, resolveTheme]);

  // Sync with browser preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      if (themeMode === 'system') {
        setTheme(getPreferredTheme());
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [getPreferredTheme, themeMode]);

  // Keep favicon assets on a single canonical path.
  const updateFavicon = () => {
    const favicon = document.querySelector('link[rel="icon"]');
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    const faviconPath = '/FAVICON_HSOCIETY_BLACK/favicon.ico';
    const appleTouchPath = '/FAVICON_HSOCIETY_BLACK/apple-touch-icon.png';
    
    if (favicon) {
      favicon.href = faviconPath;
    }
    
    if (appleTouchIcon) {
      appleTouchIcon.href = appleTouchPath;
    }
  };

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === 'light' ? 'black' : 'light';
      return next;
    });
  };

  const setSystemTheme = () => {
    setThemeMode('system');
  };

  const value = {
    theme,
    themeMode,
    toggleTheme,
    setSystemTheme,
    isDark: theme === 'black',
    isLight: theme === 'light',
    isBlack: theme === 'black',
    isSystem: themeMode === 'system',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Default export
export default ThemeProvider;
