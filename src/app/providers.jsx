import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Provider
 * Location: src/app/providers.jsx
 * 
 * Features:
 * - Light/Dark theme management
 * - Persists theme preference in localStorage
 * - Applies theme to document root
 * - Provides theme context to entire app
 * 
 * Theme Colors:
 * - Light: White background + Green accents (#10b981)
 * - Dark: Black background + Green accents (#10b981)
 */

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('hsociety-theme');
      return savedTheme || 'light';
    }
    return 'light';
  });

  // Apply theme to document root on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove old theme
    root.removeAttribute('data-theme');
    
    // Set new theme
    root.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('hsociety-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    }
    
    // Update favicon based on theme
    updateFavicon(theme);
  }, [theme]);

  // Update favicon based on theme
  const updateFavicon = (currentTheme) => {
    const favicon = document.querySelector('link[rel="icon"]');
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    
    const faviconPath = currentTheme === 'dark' 
      ? '/FAVICON_HSOCIETY_WHITE/favicon.ico'
      : '/FAVICON_HSOCIETY_BLACK/favicon.ico';
    
    const appleTouchPath = currentTheme === 'dark'
      ? '/FAVICON_HSOCIETY_WHITE/apple-touch-icon.png'
      : '/FAVICON_HSOCIETY_BLACK/apple-touch-icon.png';
    
    if (favicon) {
      favicon.href = faviconPath;
    }
    
    if (appleTouchIcon) {
      appleTouchIcon.href = appleTouchPath;
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Set specific theme
  const setThemeMode = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setTheme(mode);
    }
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light'
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

/**
 * Auth Provider Wrapper
 * Combines all providers needed for the app
 */
export const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

export default AppProviders;