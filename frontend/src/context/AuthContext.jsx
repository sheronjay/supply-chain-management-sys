import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const customerLogin = async (email, password) => {
    const data = await authService.customerLogin(email, password);
    setUser(data.user);
    return data;
  };

  const customerSignup = async (customerData) => {
    const data = await authService.customerSignup(customerData);
    setUser(data.user);
    return data;
  };

  const employeeLogin = async (userId, password) => {
    const data = await authService.employeeLogin(userId, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
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
