import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

export default function DashboardLayout({ children, pageName }) {
  const [activePage, setActivePage] = useState(pageName || 'Dashboard');
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Route mapping for navigation
  const routeMap = {
    Dashboard: '/dashboard',
    Orders: '/orders',
    UserOrders: '/customer/orders',
    MainStores: '/main-stores',
    StoreManager: '/store-manager',
    Drivers: '/drivers',
    TrainSchedule: '/train-schedule',
    ReportOverview: '/reports',
    UserManagement: '/users',
    Settings: '/settings',
  };

  const handleNavigate = (page) => {
    if (page === 'SignOut') {
      logout();
      navigate('/');
      return;
    }
    
    setActivePage(page);
    const route = routeMap[page];
    if (route) {
      navigate(route);
    }
  };

  const pageConfig = {
    Dashboard: { title: 'Supply Chain Overview', subtitle: 'Dashboard' },
    Orders: { title: 'Orders', subtitle: 'Orders' },
    UserOrders: { title: 'My Orders', subtitle: 'User Orders' },
    MainStores: { title: 'Main Stores', subtitle: 'Order Processing' },
    StoreManager: { title: 'Store Manager', subtitle: 'Store Order Acceptance' },
    Drivers: { title: 'Drivers', subtitle: 'Driver Deliveries' },
    TrainSchedule: { title: 'Train Schedule', subtitle: 'Train Schedule' },
    ReportOverview: { title: 'Report Overview', subtitle: 'Report Overview' },
    UserManagement: { title: 'User Management', subtitle: 'User Management' },
    Settings: { title: 'Settings', subtitle: 'Settings' },
  };

  const { title, subtitle } = useMemo(() => {
    return pageConfig[activePage] ?? pageConfig.Dashboard;
  }, [activePage]);

  // Check if user is a customer (only customers get restricted view without sidebar)
  const isCustomer = user?.userType === 'customer';
  const showSidebar = !isCustomer;

  return (
    <div className="app-shell">
      {/* Show sidebar for all employees including Main Store Manager */}
      {showSidebar && (
        <Sidebar 
          activePage={activePage} 
          onNavigate={handleNavigate} 
          userDesignation={user?.designation}
        />
      )}
      <main className="app-main">
        <TopBar 
          title={title} 
          subtitle={subtitle} 
          userName={user?.name}
          userDesignation={user?.designation}
          onLogout={() => {
            logout();
            navigate('/');
          }}
          isCustomer={isCustomer}
        />
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
