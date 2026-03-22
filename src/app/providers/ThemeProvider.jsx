import React, { createContext, useContext, useEffect } from 'react';

/**
 * Theme Provider
 * Location: src/app/providers.jsx
 * 
 * Features:
 * - Dark-only theme
 * - Applies theme to document root
 * - Provides theme context to entire app
 */

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const theme = 'black';
  const themeMode = 'black';

  // Apply theme to document root on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Set new theme if needed (avoid reflow on initial load)
    if (root.getAttribute('data-theme') !== 'black') {
      root.setAttribute('data-theme', 'black');
    }
    root.style.colorScheme = 'dark';
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#000000');
    }
    
    // Keep a single favicon set across themes.
    updateFavicon();
  }, []);

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

  const value = {
    theme,
    themeMode,
    isDark: true,
    isLight: false,
    isBlack: true,
    isSystem: false,
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
