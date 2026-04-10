import React, { useState, useContext, createContext } from 'react';
import { authAPI } from '../services/api';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Restore admin session from localStorage on mount
  React.useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUserData = localStorage.getItem('adminUser');
    if (adminToken && adminUserData) {
      try {
        const userData = JSON.parse(adminUserData);
        if (userData.role === 'admin') {
          setAdminUser(userData);
        }
      } catch {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setInitialized(true);
  }, []);

  const adminLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      
      // Check if user is admin
      if (response.data.user.role !== 'admin') {
        throw new Error('Access denied. Admin credentials required.');
      }

      // Store with separate admin keys
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      setAdminUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, error, initialized, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
