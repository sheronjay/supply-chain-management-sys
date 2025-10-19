import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 // Load user from JWT on initial render
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          ...decoded
        });
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const customerLogin = async (email, password) => {
    const data = await authService.customerLogin(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const customerSignup = async (customerData) => {
    const data = await authService.customerSignup(customerData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const employeeLogin = async (userId, password) => {
    const data = await authService.employeeLogin(userId, password);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };


  const value = {
    user,
    loading,
    customerLogin,
    customerSignup,
    employeeLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}