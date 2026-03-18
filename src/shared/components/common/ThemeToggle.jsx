import React from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { useTheme } from '../../../app/providers';
import '../../../styles/components/common/ThemeToggle.css';

/**
 * Theme Toggle
 * Location: src/shared/components/common/ThemeToggle.jsx
 * 
 * Features:
 * - Switches between light/black themes
 * - Accessible button with clear label
 */

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  const themeLabels = {
    light: 'White',
    black: 'Black'
  };

  const themeOrder = ['light', 'black'];
  const currentIndex = themeOrder.indexOf(theme);
  const nextTheme = themeOrder[currentIndex === -1 ? 0 : (currentIndex + 1) % themeOrder.length];

  return (
    <button
      type="button"
      aria-label={`Switch to ${themeLabels[nextTheme] || 'Black'} mode`}
      title={`Switch to ${themeLabels[nextTheme] || 'Black'} mode`}
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === 'light' ? <LuSun /> : <LuMoon />}
      </span>
    </button>
  );
};

export default ThemeToggle;
