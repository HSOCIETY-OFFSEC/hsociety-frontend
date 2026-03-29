import React from 'react';
import { logger } from '../../../core/logging/logger';

/**
 * Logo Component
 * Location: src/shared/components/common/Logo.jsx
 * 
 * Features:
 * - Automatic theme-aware logo switching
 * - Black logo for light theme
 * - White logo for dark/black themes
 * - Configurable sizes
 * - Clickable (navigates to home)
 * 
 * Props:
 * - size: 'small' | 'medium' | 'large' | 'xlarge'
 * - clickable: boolean (default: false)
 * - className: additional CSS classes
 * - src: optional direct logo path (overrides theme-based selection)
 */

const Logo = ({
  size = 'medium',
  clickable = false,
  className = '',
  onClick = null,
  src = null,
}) => {
  // Dark-only theme: default to the white logo unless overridden.
  const logoSrc = src || '/hsociety-logo-white.png';
  
  const sizeClassMap = {
    small: 'h-8 w-auto',
    medium: 'h-10 w-auto',
    large: 'h-12 w-auto',
    xlarge: 'h-auto w-full',
  };
  const sizeClass = sizeClassMap[size] || sizeClassMap.medium;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (clickable) {
      window.location.href = '/';
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`.trim()}
      onClick={handleClick}
    >
      <img
        src={logoSrc}
        alt="HSOCIETY OFFSEC Logo"
        className={`block max-h-full object-contain transition-all duration-200 ${sizeClass} ${
          clickable || onClick ? 'cursor-pointer' : 'cursor-default'
        }`.trim()}
        onError={(e) => {
          logger.error('Logo failed to load:', logoSrc);
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default Logo;
