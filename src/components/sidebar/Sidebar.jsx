import { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    // Add/remove class to body to control main content layout
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [isCollapsed]);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <span className={`hamburger ${isCollapsed ? 'collapsed' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        {!isCollapsed && <h2 className="sidebar-title">Menu</h2>}
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="#" className="nav-item">
              <span className="nav-icon">🏠</span>
              {!isCollapsed && <span className="nav-text">Dashboard</span>}
            </a>
          </li>
          <li>
            <a href="#" className="nav-item">
              <span className="nav-icon">📦</span>
              {!isCollapsed && <span className="nav-text">Inventory</span>}
            </a>
          </li>
          <li>
            <a href="#" className="nav-item">
              <span className="nav-icon">📋</span>
              {!isCollapsed && <span className="nav-text">Orders</span>}
            </a>
          </li>
          <li>
            <a href="#" className="nav-item">
              <span className="nav-icon">🚚</span>
              {!isCollapsed && <span className="nav-text">Suppliers</span>}
            </a>
          </li>
          <li>
            <a href="#" className="nav-item">
              <span className="nav-icon">📊</span>
              {!isCollapsed && <span className="nav-text">Analytics</span>}
            </a>
          </li>
          <li>
            <a href="#" className="nav-item">
              <span className="nav-icon">⚙️</span>
              {!isCollapsed && <span className="nav-text">Settings</span>}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
