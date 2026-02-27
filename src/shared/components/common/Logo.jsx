import React from 'react';
import { useTheme } from '../../../app/providers';
import '../../../styles/shared/components/common/Logo.css';

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
 */

const Logo = ({ 
  size = 'medium', 
  clickable = false, 
  className = '',
  onClick = null 
}) => {
  const { theme } = useTheme();
  
  // Select logo based on current theme
  const logoSrc = theme === 'light'
    ? '/hsociety-logo-black.png'
    : '/hsociety-logo-white.png';
  
  // Size configurations
 const sizeMap = {
  small: {
    height: '40px',
    width: 'auto'
  },
  medium: {
    height: '60px',
    width: 'auto'
  },
  large: {
    height: '90px',
    width: 'auto'
  },
  xlarge: {
    height: 'auto',
    width: '100%'
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
