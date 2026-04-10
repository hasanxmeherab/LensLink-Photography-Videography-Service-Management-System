import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Booking from './components/Booking';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import ManageServices from './components/ManageServices';
import ManagePortfolio from './components/ManagePortfolio';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import './App.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AdminAuthProvider>
          <Routes>
            {/* Admin Login — standalone, no layout */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Admin Panel — shared sidebar layout */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="manage-services" element={<ManageServices />} />
              <Route path="manage-portfolio" element={<ManagePortfolio />} />
            </Route>

            {/* Customer Routes — with navbar */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/login" element={<Auth isSignup={false} />} />
                    <Route path="/signup" element={<Auth isSignup={true} />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </>
              }
            />
          </Routes>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
