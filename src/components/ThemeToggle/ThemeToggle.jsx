import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext.jsx';
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={`theme-toggle__icon ${theme === 'light' ? 'theme-toggle__icon--active' : ''}`}>
        <FiSun size={17} />
      </span>
      <span className={`theme-toggle__icon ${theme === 'dark' ? 'theme-toggle__icon--active' : ''}`}>
        <FiMoon size={17} />
      </span>
    </button>
  );
}

export default ThemeToggle;
