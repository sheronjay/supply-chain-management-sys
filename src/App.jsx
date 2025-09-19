import { useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
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
    element: createPlaceholder('Orders'),
  },
  TrainSchedule: {
    title: 'Train Schedule',
    subtitle: 'Train Schedule',
    element: createPlaceholder('Train Schedule'),
  },
  VehicleUtilization: {
    title: 'Vehicle Utilization',
    subtitle: 'Vehicle Utilization',
    element: createPlaceholder('Vehicle Utilization'),
  },
  ReportOverview: {
    title: 'Report Overview',
    subtitle: 'Report Overview',
    element: createPlaceholder('Report Overview'),
  },
  UserManagement: {
    title: 'User Management',
    subtitle: 'User Management',
    element: createPlaceholder('User Management'),
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
