// src/shared/components/common/Logo.jsx

/**
 * Logo Component
 * Displays the Hsociety logo with theme adaptation
 */

import { useTheme } from '../../context/ThemeContext';

const Logo = ({ className = '', style = {} }) => {
  const { isDark } = useTheme();

  const logoSrc = isDark 
    ? '/hsociety-logo-white.png' 
    : '/hsociety-logo-black.png';

  return (
    <img 
      src={logoSrc} 
      alt="Hsociety Logo" 
      className={`logo ${className}`}
      style={style}
    />
  );
};

export default Logo;