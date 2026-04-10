import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending: { label: 'Pending', badge: 'badge-pending', dot: '#fbbf24', icon: '⏳' },
  approved: { label: 'Approved', badge: 'badge-approved', dot: '#4ade80', icon: '✅' },
  rejected: { label: 'Rejected', badge: 'badge-rejected', dot: '#f87171', icon: '❌' },
  completed: { label: 'Completed', badge: 'badge-completed', dot: '#a5b4fc', icon: '🏁' },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchAllBookings = async () => {
    try {
      const response = await bookingAPI.getAll();
      setBookings(response.data.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings(user.id);
      setBookings(response.data.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchAllBookings();
    else if (user?.id) fetchUserBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingAPI.update(bookingId, { status: newStatus });
      setBookings(bookings.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b)));
    } catch (err) {
      setError('Failed to update booking');
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await bookingAPI.delete(bookingId);
      setBookings(bookings.filter((b) => b._id !== bookingId));
    } catch (err) {
      setError('Failed to delete booking');
    }
  };

  const filteredBookings =
    activeTab === 'all' ? bookings : bookings.filter((b) => b.status === activeTab);

  const tabs = user?.role === 'admin'
    ? ['all', 'pending', 'approved', 'rejected', 'completed']
    : ['all', 'pending', 'approved', 'completed'];

  const tabLabels = {
    all: `All (${bookings.length})`,
    pending: `Pending (${bookings.filter((b) => b.status === 'pending').length})`,
    approved: `Approved (${bookings.filter((b) => b.status === 'approved').length})`,
    rejected: `Rejected (${bookings.filter((b) => b.status === 'rejected').length})`,
    completed: `Completed (${bookings.filter((b) => b.status === 'completed').length})`,
  };

  const stats = [
    { label: 'Total', value: bookings.length, color: '#c44df0', icon: '📋' },
    { label: 'Pending', value: bookings.filter((b) => b.status === 'pending').length, color: '#fbbf24', icon: '⏳' },
    { label: 'Approved', value: bookings.filter((b) => b.status === 'approved').length, color: '#4ade80', icon: '✅' },
    { label: 'Completed', value: bookings.filter((b) => b.status === 'completed').length, color: '#a5b4fc', icon: '🏁' },
  ];

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-dark-mesh min-h-screen">
      {/* Header */}
      <div
        className="relative pt-32 pb-16 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0e0e1a 0%, #1a0a2e 100%)' }}
      >
        <div
          className="orb w-72 h-72 top-0 right-0 opacity-20"
          style={{ background: '#a62dd4' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="section-label mb-3">
            {user?.role === 'admin' ? 'Admin Panel' : 'My Account'}
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {user?.role === 'admin' ? 'Bookings Manager' : 'My Bookings'}
          </h1>
          <p className="text-gray-400">
            Welcome back, <span className="text-purple-300 font-semibold">{user?.name}</span>
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{ background: 'linear-gradient(to bottom, transparent, #080810)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* Error */}
        {error && (
          <div
            className="mb-6 px-5 py-4 rounded-xl text-sm"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-5 text-center"
              style={{ border: `1px solid rgba(255,255,255,0.06)` }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
              style={
                activeTab === tab
                  ? {
                      background: 'linear-gradient(135deg, #c44df0, #8a20b0)',
                      boxShadow: '0 4px 15px rgba(196, 77, 240, 0.3)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }
              }
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 glass-card">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-white mb-2">No bookings found</h3>
              <p className="text-gray-500 text-sm mb-6">
                {activeTab === 'all'
                  ? "You haven't made any bookings yet."
                  : `No ${activeTab} bookings to show.`}
              </p>
              {user?.role !== 'admin' && (
                <Link to="/booking" className="btn-primary">
                  Book a Service
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    {user?.role === 'admin' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    const cfg = statusConfig[booking.status] || statusConfig.pending;
                    return (
                      <tr key={booking._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                              style={{ background: 'linear-gradient(135deg, #c44df0, #8a20b0)' }}
                            >
                              {booking.clientName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-white text-sm">{booking.clientName}</div>
                              <div className="text-xs text-gray-500">{booking.clientEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-gray-300">{booking.serviceId?.title || 'N/A'}</span>
                        </td>
                        <td>
                          <span className="text-gray-400 text-sm">
                            {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </td>
                        <td>
                          <span className={cfg.badge}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </td>
                        {user?.role === 'admin' && (
                          <td>
                            <div className="flex items-center gap-2 flex-wrap">
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    id={`approve-${booking._id}`}
                                    onClick={() => updateBookingStatus(booking._id, 'approved')}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:scale-105"
                                    style={{
                                      background: 'rgba(34, 197, 94, 0.15)',
                                      border: '1px solid rgba(34, 197, 94, 0.3)',
                                      color: '#4ade80',
                                    }}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    id={`reject-${booking._id}`}
                                    onClick={() => updateBookingStatus(booking._id, 'rejected')}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
                                    style={{
                                      background: 'rgba(239, 68, 68, 0.15)',
                                      border: '1px solid rgba(239, 68, 68, 0.3)',
                                      color: '#f87171',
                                    }}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {booking.status === 'approved' && (
                                <button
                                  id={`complete-${booking._id}`}
                                  onClick={() => updateBookingStatus(booking._id, 'completed')}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
                                  style={{
                                    background: 'rgba(99, 102, 241, 0.15)',
                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                    color: '#a5b4fc',
                                  }}
                                >
                                  Complete
                                </button>
                              )}
                              <button
                                id={`delete-${booking._id}`}
                                onClick={() => deleteBooking(booking._id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
                                style={{
                                  background: 'rgba(107,114,128,0.15)',
                                  border: '1px solid rgba(107,114,128,0.3)',
                                  color: '#9ca3af',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
