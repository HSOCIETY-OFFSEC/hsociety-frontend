import React from 'react';
import { useTheme } from '../../../app/providers';

/**
 * Logo Component
 * Location: src/shared/components/common/Logo.jsx
 * 
 * Features:
 * - Automatic theme-aware logo switching
 * - Black logo for light theme
 * - White logo for dark theme
 * - Configurable sizes
 * - Clickable (navigates to home)
 * 
 * Props:
 * - size: 'small' | 'medium' | 'large' | 'xlarge'
 * - clickable: boolean (default: false)
 * - className: additional CSS classes
 */

const Logo = ({ 
  size = 'medium', 
  clickable = false, 
  className = '',
  onClick = null 
}) => {
  const { theme } = useTheme();
  
  // Select logo based on current theme
  const logoSrc = theme === 'dark' 
    ? '/hsociety-logo-white.png'
    : '/hsociety-logo-black.png';
  
  // Size configurations
  const sizeMap = {
    small: {
      height: '32px',
      width: 'auto'
    },
    medium: {
      height: '48px',
      width: 'auto'
    },
    large: {
      height: '64px',
      width: 'auto'
    },
    xlarge: {
      height: '96px',
      width: 'auto'
    }
  };

  const logoStyle = {
    ...sizeMap[size],
    display: 'block',
    objectFit: 'contain',
    transition: 'all 0.3s ease',
    cursor: clickable || onClick ? 'pointer' : 'default'
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (clickable) {
      window.location.href = '/';
    }
  };

  return (
    <div 
      className={`logo-container ${className}`}
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img
        src={logoSrc}
        alt="HSOCIETY Logo"
        style={logoStyle}
        className="logo-image"
        onError={(e) => {
          console.error('Logo failed to load:', logoSrc);
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default Logo;