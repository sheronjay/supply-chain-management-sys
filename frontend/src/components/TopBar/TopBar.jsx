import './TopBar.css'

const TopBar = ({ title, subtitle = 'Dashboard', userName, onSignOut }) => (
  <header className="topbar">
    <div className="topbar__title">
      <p className="topbar__subtitle">{subtitle}</p>
      <h1>{title}</h1>
    </div>
    <div className="topbar__actions">
      {userName && onSignOut ? (
        <div className="topbar__customer-section">
          <div className="topbar__profile">
            <div className="topbar__avatar">{userName.charAt(0).toUpperCase()}</div>
            <div>
              <p className="topbar__name">{userName}</p>
              <span className="topbar__role">Customer</span>
            </div>
          </div>
          <button className="topbar__signout-btn" onClick={onSignOut} title="Sign Out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      ) : (
        <div className="topbar__profile">
          <div className="topbar__avatar">M</div>
          <div>
            <p className="topbar__name">Muffin</p>
            <span className="topbar__role">Admin</span>
          </div>
        </div>
      )}
    </div>
  </header>
)

export default TopBar
