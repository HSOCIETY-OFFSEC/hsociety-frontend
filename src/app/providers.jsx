import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Provider
 * Location: src/app/providers.jsx
 * 
 * Features:
 * - Light/Dark/Black theme management
 * - Persists theme preference in localStorage
 * - Applies theme to document root
 * - Provides theme context to entire app
 * 
 * Theme Colors:
 * - Light: White background + Green accents (#10b981)
 * - Dark: Charcoal background + Green accents (#10b981)
 * - Black: True black background + Green accents (#10b981)
 */

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const themeOrder = ['light', 'dark', 'black'];

  // Initialize theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('hsociety-theme');
      return themeOrder.includes(savedTheme) ? savedTheme : 'dark';
    }
    return 'dark';
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
      const themeColorMap = {
        light: '#ffffff',
        dark: '#0a0f14',
        black: '#000000'
      };
      metaThemeColor.setAttribute('content', themeColorMap[theme] || '#0a0f14');
    }
    
    // Update favicon based on theme
    updateFavicon(theme);
  }, [theme]);

  // Update favicon based on theme
  const updateFavicon = (currentTheme) => {
    const favicon = document.querySelector('link[rel="icon"]');
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    
    const faviconPath = currentTheme === 'light' 
      ? '/FAVICON_HSOCIETY_BLACK/favicon.ico'
      : '/FAVICON_HSOCIETY_WHITE/favicon.ico';
    
    const appleTouchPath = currentTheme === 'light'
      ? '/FAVICON_HSOCIETY_BLACK/apple-touch-icon.png'
      : '/FAVICON_HSOCIETY_WHITE/apple-touch-icon.png';
    
    if (favicon) {
      favicon.href = faviconPath;
    }
    
    if (appleTouchIcon) {
      appleTouchIcon.href = appleTouchPath;
    }
  };

  // Toggle between light, dark, and black
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const currentIndex = themeOrder.indexOf(prevTheme);
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeOrder.length;
      return themeOrder[nextIndex];
    });
  };

  // Set specific theme
  const setThemeMode = (mode) => {
    if (themeOrder.includes(mode)) {
      setTheme(mode);
    }
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isBlack: theme === 'black'
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
