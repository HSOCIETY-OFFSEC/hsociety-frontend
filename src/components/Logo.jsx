import { useTheme } from '../context/ThemeContext';

const Logo = ({ className = '' }) => {
  const { isDark } = useTheme();

  const logoSrc = isDark 
    ? '/hsociety-logo-white.png' 
    : '/hsociety-logo-black.png';

  return (
    <img 
      src={logoSrc} 
      alt="Hsociety Logo" 
      className={className}
    />
  );
};

export default Logo;