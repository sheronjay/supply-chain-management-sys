// src/services/authService.js
import api from './api';

/**
 * Customer Login
 */
export async function customerLogin(email, password) {
  try {
    const response = await api.post('/auth/customer/login', { email, password });

    // Store token and user
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    // Handle backend or network errors
    const message =
      error.response?.data?.error || error.message || 'Login failed. Please try again.';
    throw new Error(message);
  }
}

/**
 * Customer Signup
 */
export async function customerSignup(data) {
  try {
    const response = await api.post('/auth/customer/signup', data);

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Signup failed. Please try again.';
    throw new Error(message);
  }
}

/**
 * Employee Login
 */
export async function employeeLogin(userId, password) {
  try {
    const response = await api.post('/auth/employee/login', { userId, password });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Login failed. Please try again.';
    throw new Error(message);
  }
}

/**
 * Logout
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Get Current User
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}
