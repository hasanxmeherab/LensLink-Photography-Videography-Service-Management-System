import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { adminUser, initialized } = useAdminAuth();

  // Wait until localStorage has been read before deciding
  if (!initialized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#080810' }}
      >
        <div className="spinner" />
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
