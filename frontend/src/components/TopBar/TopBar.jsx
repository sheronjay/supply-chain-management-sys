import './TopBar.css'

const TopBar = ({ title, subtitle = 'Dashboard', userName, onLogout, isCustomer, userDesignation }) => {
  // Get first letter for avatar
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : 'U';
  const displayName = userName || 'User';
  const userRole = isCustomer ? 'Customer' : (userDesignation || 'Employee');

  return (
    <header className="topbar">
      <div className="topbar__title">
        <p className="topbar__subtitle">{subtitle}</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar__actions">
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
