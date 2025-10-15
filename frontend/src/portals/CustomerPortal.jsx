import { useState, useEffect } from 'react'
import TopBar from '../components/TopBar/TopBar'
import UserOrders from '../pages/userOrders/UserOrders'
import Login from '../pages/Login/Login'
import Signup from '../pages/Signup/Signup'
import { isAuthenticated, logout, getCurrentUser } from '../services/authService'
import '../App.css'

function CustomerPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [showSignup, setShowSignup] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)
      
      if (authenticated) {
        const user = getCurrentUser()
        // Only allow customer role
        if (user && user.role === 'customer') {
          setCurrentUser(user)
        } else {
          // Redirect non-customers to organization portal
          window.location.href = '/org'
        }
      }
    }

    checkAuth()
  }, [])

  const handleLoginSuccess = (user) => {
    // Check if user is not a customer
    if (user?.role !== 'customer') {
      // Redirect to organization portal
      window.location.href = '/org'
      return
    }
    
    setIsLoggedIn(true)
    setCurrentUser(user)
    setShowSignup(false)
  }

  const handleSignupSuccess = (user) => {
    setIsLoggedIn(true)
    setCurrentUser(user)
    setShowSignup(false)
  }

  const handleSignOut = () => {
    logout()
    setIsLoggedIn(false)
    setCurrentUser(null)
    setShowSignup(false)
  }

  // Show signup page if requested
  if (!isLoggedIn && showSignup) {
    return (
      <Signup
        onSignupSuccess={handleSignupSuccess}
        onSwitchToLogin={() => setShowSignup(false)}
      />
    )
  }

  // Show login page if not authenticated
  if (!isLoggedIn) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    )
  }

  // Customer view - no sidebar, just UserOrders page
  return (
    <div className="app-shell">
      <main className="app-main app-main-customer">
        <TopBar
          title="My Orders"
          subtitle="Customer Portal"
          userName={currentUser?.username}
          onSignOut={handleSignOut}
        />
        <div className="app-content">
          <UserOrders />
        </div>
      </main>
    </div>
  )
}

export default CustomerPortal
