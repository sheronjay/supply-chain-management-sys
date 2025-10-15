import './Sidebar.css'

const navItems = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'Orders', label: 'Orders', icon: 'orders' },
  { key: 'TrainSchedule', label: 'Train Schedule', icon: 'train' },
  /*{ key: 'VehicleUtilization', label: 'Vehicle Utilization', icon: 'vehicle' },*/
  { key: 'ReportOverview', label: 'Report Overview', icon: 'report' },
  { key: 'UserManagement', label: 'User Management', icon: 'users' },
]

const bottomItems = [
  { key: 'Settings', label: 'Settings', icon: 'settings' },
  { key: 'SignOut', label: 'Sign Out', icon: 'signout' },
]

const Icon = ({ type }) => {
  switch (type) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" className="sidebar__icon" aria-hidden>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="8" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
          <rect x="13" y="13" width="8" height="8" rx="2" />
        </svg>
      )
    case 'orders':
      return (
        <svg viewBox="0 0 24 24" className="sidebar__icon" aria-hidden>
          <path d="M6 7h12l.8 10.4A2 2 0 0 1 16.82 19H7.18A2 2 0 0 1 5.2 17.4Z" />
          <path d="M9 7V5a3 3 0 0 1 6 0v2" />
        </svg>
      )
    case 'userorders':
      return (
        <svg viewBox="0 0 24 24" className="sidebar__icon" aria-hidden>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <path d="M8 13h8M8 17h5" />
          <path d="M17 21v-8h-5" />
        </svg>
      )
    case 'train':
      return (
        <svg viewBox="0 0 24 24" className="sidebar__icon" aria-hidden>
          <rect x="6" y="5" width="12" height="10" rx="2" />
          <path d="M6 13h12" />
          <path d="M9 5V3h6v2" />
          <path d="M9 19l-2 2" />
          <path d="M15 19l2 2" />
          <circle cx="10" cy="16.5" r="1.5" />
          <circle cx="14" cy="16.5" r="1.5" />
        </svg>
      )
    // case 'vehicle':
    //   return (
    //     <svg viewBox="0 0 24 24" className="sidebar__icon" aria-hidden>
    //       <path d="M3 8h9v7H3z" />
    //       <path d="M12 11h4l3 4v3h-2.2" />
    //       <circle cx="7.5" cy="18" r="1.8" />
    //       <circle cx="16.5" cy="18" r="1.8" />
    //     </svg>
    //   )
    case 'report':
      return (
        <svg viewBox="0 0 24 24" className="sidebar__icon" aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 12V4a8 8 0 0 1 8 8h-8" />
        </svg>
      )
    case 'users':
      return (
        <svg viewBox="0 0 24 24" className="sidebar__icon" aria-hidden>
          <circle cx="9" cy="9" r="3" />
          <circle cx="17" cy="10" r="2.5" />
          <path d="M5 19a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4" />
          <path d="M15 18.5a4.5 4.5 0 0 1 4-2.5h.5" />
        </svg>
      )
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" className="sidebar__icon" aria-hidden>
          <path d="m12 15 0 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          <path d="m19.4 13.5-.7 1.2.3 1.4-1.2.7-1.4-.3-1.2.7-.7 1.2-1.4-.3-.7-1.2h-1.4l-.7 1.2-1.4.3-.7-1.2-1.2-.7-1.4.3-1.2-.7.3-1.4-.7-1.2L3 12l.7-1.2-.3-1.4 1.2-.7 1.4.3 1.2-.7.7-1.2 1.4.3.7 1.2h1.4l.7-1.2 1.4-.3.7 1.2 1.2.7 1.4-.3 1.2.7-.3 1.4.7 1.2Z" />
        </svg>
      )
    case 'signout':
      return (
        <svg viewBox="0 0 24 24" className="sidebar__icon" aria-hidden>
          <path d="M15 5h-6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6" />
          <path d="m12 16 4-4-4-4" />
          <path d="M16 12H5" />
        </svg>
      )
    default:
      return null
  }
}

const Sidebar = ({ activePage, onNavigate }) => (
  <aside className="sidebar">
    <div className="sidebar__brand">
      <div className="sidebar__brand-logo">K</div>
      <div className="sidebar__brand-text">
        <h2>Kandypack</h2>
        <span>Dashboard</span>
      </div>
    </div>

    <nav className="sidebar__nav">
      {navItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`sidebar__nav-item ${
            activePage === item.key ? 'sidebar__nav-item--active' : ''
          }`}
          onClick={() => onNavigate(item.key)}
        >
          <Icon type={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="sidebar__bottom">
      {bottomItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className="sidebar__nav-item sidebar__nav-item--secondary"
          onClick={() => onNavigate(item.key)}
        >
          <Icon type={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  </aside>
)

export default Sidebar
