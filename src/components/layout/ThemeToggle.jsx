import { useTheme } from '../../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <HiSun className="icon-transition" size={20} />
      ) : (
        <HiMoon className="icon-transition" size={20} />
      )}
    </button>
  );
};

export default ThemeToggle;