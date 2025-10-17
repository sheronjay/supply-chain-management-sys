import { useMemo, useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import TopBar from './components/TopBar/TopBar'
import Dashboard from './pages/Dashboard/Dashboard'
import Orders from './pages/Orders/Orders'
import UserOrders from './pages/userOrders/UserOrders'
import MainStores from './pages/MainStores/MainStores'
import StoreManager from './pages/StoreManager/StoreManager'
import Drivers from './pages/Drivers/Drivers'
import TrainSchedule from './pages/TrainSchedule/TrainSchedule'
import ReportOverview from './pages/ReportOverview/ReportOverview'
import UserManagement from './pages/UserManagement/UserManagement'
import './App.css'

const createPlaceholder = (label) => (
  <div className="placeholder">
    <h2>{label}</h2>
    <p>The {label.toLowerCase()} module is under construction.</p>
  </div>
)

const pageConfig = {
  Dashboard: {
    title: 'Supply Chain Overview',
    subtitle: 'Dashboard',
    element: <Dashboard />,
  },
  Orders: {
    title: 'Orders',
    subtitle: 'Orders',
    element: <Orders />,
  },
  UserOrders: {
    title: 'My Orders',
    subtitle: 'User Orders',
    element: <UserOrders />,
  },
  MainStores: {
    title: 'Main Stores',
    subtitle: 'Order Processing',
    element: <MainStores />,
  },
  StoreManager: {
    title: 'Store Manager',
    subtitle: 'Store Order Acceptance',
    element: <StoreManager />,
  },
  Drivers: {
    title: 'Drivers',
    subtitle: 'Driver Deliveries',
    element: <Drivers />,
  },
  TrainSchedule: {
    title: 'Train Schedule',
    subtitle: 'Train Schedule',
    element: <TrainSchedule />,
  },
  // VehicleUtilization: {
  //   title: 'Vehicle Utilization',
  //   subtitle: 'Vehicle Utilization',
  //   element: createPlaceholder('Vehicle Utilization'),
  // },
  ReportOverview: {
    title: 'Report Overview',
    subtitle: 'Report Overview',
    element: <ReportOverview />,
  },
  UserManagement: {
    title: 'User Management',
    subtitle: 'User Management',
    element: <UserManagement />,
  },
  Settings: {
    title: 'Settings',
    subtitle: 'Settings',
    element: createPlaceholder('Settings'),
  },
  SignOut: {
    title: 'Sign Out',
    subtitle: 'Sign Out',
    element: (
      <div className="placeholder">
        <h2>Sign Out</h2>
        <p>Your session remains active in this preview build.</p>
      </div>
    ),
  },
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const { title, subtitle, element } = useMemo(() => {
    return pageConfig[activePage] ?? pageConfig.Dashboard
  }, [activePage])

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="app-main">
        <TopBar title={title} subtitle={subtitle} />
        <div className="app-content">{element}</div>
      </main>
    </div>
  )
}

export default App
