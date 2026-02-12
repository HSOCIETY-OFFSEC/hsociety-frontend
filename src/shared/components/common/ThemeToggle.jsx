import React from 'react';
import { useTheme } from '../../../app/providers';

/**
 * Theme Toggle
 * Location: src/shared/components/common/ThemeToggle.jsx
 * 
 * Features:
 * - Switches between light/dark themes
 * - Accessible button with clear label
 */

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="theme-toggle-label">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

export default ThemeToggle;
