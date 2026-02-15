import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../../app/providers';

/**
 * Theme Toggle
 * Location: src/shared/components/common/ThemeToggle.jsx
 * 
 * Features:
 * - Switches between light/dark/black themes
 * - Accessible button with clear label
 */

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  const themeLabels = {
    light: 'White',
    dark: 'Dark',
    black: 'Black'
  };

  const themeOrder = ['light', 'dark', 'black'];
  const currentIndex = themeOrder.indexOf(theme);
  const nextTheme = themeOrder[currentIndex === -1 ? 0 : (currentIndex + 1) % themeOrder.length];

  return (
    <button
      type="button"
      aria-label={`Switch to ${themeLabels[nextTheme] || 'Dark'} mode`}
      title={`Switch to ${themeLabels[nextTheme] || 'Dark'} mode`}
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === 'light' ? <FiSun /> : <FiMoon />}
      </span>
      <span className="theme-toggle-label">
        {themeLabels[theme] || 'Dark'}
      </span>
    </button>
  );
};

export default ThemeToggle;
