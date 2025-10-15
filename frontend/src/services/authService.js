const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

/**
 * Signup new customer
 */
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed')
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    }
  } catch (error) {
    console.error('Signup service error:', error)
    throw error
  }
}

/**
 * Login user with username and password
 */
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    }
  } catch (error) {
    console.error('Auth service error:', error)
    throw error
  }
}

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('userId')
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  return !!token
}

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * Get authentication token
 */
export const getToken = () => {
  return localStorage.getItem('token')
}

/**
 * Verify token is still valid
 */
export const verifyToken = async () => {
  const token = getToken()
  
  if (!token) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error('Token verification error:', error)
    return false
  }
}
