import { useMemo, useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import TopBar from '../components/TopBar/TopBar'
import Dashboard from '../pages/Dashboard/Dashboard'
import Orders from '../pages/Orders/Orders'
import TrainSchedule from '../pages/TrainSchedule/TrainSchedule'
import ReportOverview from '../pages/ReportOverview/ReportOverview'
import UserManagement from '../pages/UserManagement/UserManagement'
import DeliverySchedule from '../pages/DeliverySchedule/DeliverySchedule'
import Login from '../pages/Login/Login'
import { isAuthenticated, logout, getCurrentUser } from '../services/authService'

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
    allowedRoles: ['admin', 'store_manager'],
  },
  Orders: {
    title: 'Orders',
    subtitle: 'Orders',
    element: <Orders />,
    allowedRoles: ['admin', 'store_manager'],
  },
  TrainSchedule: {
    title: 'Train Schedule',
    subtitle: 'Train Schedule',
    element: <TrainSchedule />,
    allowedRoles: ['admin', 'store_manager'],
  },
  ReportOverview: {
    title: 'Report Overview',
    subtitle: 'Report Overview',
    element: <ReportOverview />,
    allowedRoles: ['admin', 'store_manager'],
  },
  UserManagement: {
    title: 'User Management',
    subtitle: 'User Management',
    element: <UserManagement />,
    allowedRoles: ['admin'],
  },
  DeliverySchedule: {
    title: 'My Delivery Schedule',
    subtitle: 'Delivery Schedule',
    element: <DeliverySchedule />,
    allowedRoles: ['delivery_employee'],
  },
  Settings: {
    title: 'Settings',
    subtitle: 'Settings',
    element: createPlaceholder('Settings'),
    allowedRoles: ['admin', 'store_manager', 'delivery_employee'],
  },
  SignOut: {
    title: 'Sign Out',
    subtitle: 'Sign Out',
    element: (
      <div className="placeholder">
        <h2>Signing out...</h2>
        <p>You are being logged out.</p>
      </div>
    ),
    allowedRoles: ['admin', 'store_manager', 'delivery_employee'],
  },
}

function OrganizationPortal() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)
      
      if (authenticated) {
        const user = getCurrentUser()
        // Only allow non-customer roles
        if (user && user.role !== 'customer') {
          setCurrentUser(user)
          // Set default page based on role
          if (user.role === 'delivery_employee') {
            setActivePage('DeliverySchedule')
          } else {
            setActivePage('Dashboard')
          }
        } else {
          // Redirect customers to customer portal
          window.location.href = '/customer'
        }
      }
    }

    checkAuth()
  }, [])

  const handleLoginSuccess = (user) => {
    // Check if user is a customer
    if (user?.role === 'customer') {
      // Redirect to customer portal
      window.location.href = '/customer'
      return
    }
    
    setIsLoggedIn(true)
    setCurrentUser(user)
    // Set default page based on role
    if (user.role === 'delivery_employee') {
      setActivePage('DeliverySchedule')
    } else {
      setActivePage('Dashboard')
    }
  }

  const handleSignOut = () => {
    logout()
    setIsLoggedIn(false)
    setCurrentUser(null)
    setActivePage('Dashboard')
  }

  // Handle navigation - special case for SignOut
  const handleNavigate = (page) => {
    if (page === 'SignOut') {
      handleSignOut()
    } else {
      setActivePage(page)
    }
  }

  // Calculate page config
  const { title, subtitle, element } = useMemo(() => {
    return pageConfig[activePage] ?? pageConfig.Dashboard
  }, [activePage])

  // Show login page if not authenticated
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} currentUser={currentUser} />
      <main className="app-main">
        <TopBar title={title} subtitle={subtitle} />
        <div className="app-content">{element}</div>
      </main>
    </div>
  )
}

export default OrganizationPortal
