const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="topbar__icon">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.2-3.2" />
  </svg>
)

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="topbar__icon">
    <path d="m8 10 4 4 4-4" />
  </svg>
)

const BellIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="topbar__icon">
    <path d="M12 20a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z" />
    <path d="M18 16H6l1-1.5V11a5 5 0 0 1 10 0v3.5Z" />
    <path d="M5 16h14" />
  </svg>
)

const TopBar = ({ title, subtitle = 'Dashboard' }) => (
  <header className="topbar">
    <div className="topbar__title">
      <p className="topbar__subtitle">{subtitle}</p>
      <h1>{title}</h1>
    </div>
    <div className="topbar__actions">
      <div className="topbar__search">
        <SearchIcon />
        <input type="text" placeholder="Search here..." />
      </div>
      <button type="button" className="topbar__pill">
        Eng (US)
        <ChevronIcon />
      </button>
      <button type="button" className="topbar__icon-button">
        <BellIcon />
        <span className="topbar__indicator" />
      </button>
      <div className="topbar__profile">
        <div className="topbar__avatar">M</div>
        <div>
          <p className="topbar__name">Muffin</p>
          <span className="topbar__role">Admin</span>
        </div>
      </div>
    </div>
  </header>
)

export default TopBar
