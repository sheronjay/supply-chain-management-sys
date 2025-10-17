const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Customer Login
 */
export async function customerLogin(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/customer/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  
  // Store user data in localStorage
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

/**
 * Customer Signup
 */
export async function customerSignup(customerData) {
  const response = await fetch(`${API_BASE_URL}/auth/customer/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }

  const data = await response.json();
  
  // Store user data in localStorage
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

/**
 * Employee Login
 */
export async function employeeLogin(userId, password) {
  const response = await fetch(`${API_BASE_URL}/auth/employee/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  
  // Store user data in localStorage
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

/**
 * Logout
 */
export function logout() {
  localStorage.removeItem('user');
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}
