import './TopBar.css'
import { useTheme } from '../../context/ThemeContext.jsx'

const TopBar = ({ title, subtitle = 'Dashboard', userName, onLogout, isCustomer, userDesignation }) => {
  // Get first letter for avatar
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : 'U';
  const displayName = userName || 'User';
  const userRole = isCustomer ? 'Customer' : (userDesignation || 'Employee');
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="topbar">
      <div className="topbar__title">
        <p className="topbar__subtitle">{subtitle}</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar__actions">
        <button
          type="button"
          className="topbar__icon-button topbar__theme"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden>
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          )}
        </button>
        <div className="topbar__profile">
          <div className="topbar__avatar">{avatarLetter}</div>
          <div>
            <p className="topbar__name">{displayName}</p>
            <span className="topbar__role">{userRole}</span>
          </div>
        </div>
        {isCustomer && onLogout && (
          <button 
            className="topbar__logout"
            onClick={onLogout}
            title="Logout"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar
