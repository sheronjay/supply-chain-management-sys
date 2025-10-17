import { useNavigate, useLocation } from 'react-router-dom';
import './MainStoreNav.css';

const MainStoreNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/main-stores', label: 'Main Stores', icon: 'mainstores' },
    { path: '/train-schedule', label: 'Train Schedule', icon: 'train' }
  ];

  const Icon = ({ type }) => {
    switch (type) {
      case 'mainstores':
        return (
          <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M9 22V12h6v10" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'train':
        return (
          <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden>
            <rect x="6" y="5" width="12" height="10" rx="2" />
            <path d="M6 13h12" />
            <path d="M9 5V3h6v2" />
            <path d="M9 19l-2 2" />
            <path d="M15 19l2 2" />
            <circle cx="10" cy="16.5" r="1.5" />
            <circle cx="14" cy="16.5" r="1.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="main-store-nav">
      <div className="main-store-nav__container">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`main-store-nav__item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <Icon type={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MainStoreNav;
