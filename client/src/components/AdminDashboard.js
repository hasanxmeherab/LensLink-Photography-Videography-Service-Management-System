import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';

const statusConfig = {
  pending:   { label: 'Pending',   badge: 'badge-pending',   icon: '⏳' },
  approved:  { label: 'Approved',  badge: 'badge-approved',  icon: '✅' },
  rejected:  { label: 'Rejected',  badge: 'badge-rejected',  icon: '❌' },
  completed: { label: 'Completed', badge: 'badge-completed', icon: '🏁' },
};

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await bookingAPI.getAll();
      setBookings(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingAPI.update(bookingId, { status: newStatus });
      setBookings(bookings.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b)));
    } catch (err) {
      setError('Failed to update booking');
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    try {
      await bookingAPI.delete(bookingId);
      setBookings(bookings.filter((b) => b._id !== bookingId));
    } catch (err) {
      setError('Failed to delete booking');
    }
  };

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter((b) => b.status === 'pending').length,
    approved:  bookings.filter((b) => b.status === 'approved').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    rejected:  bookings.filter((b) => b.status === 'rejected').length,
  };

  const filteredBookings =
    activeTab === 'all' ? bookings : bookings.filter((b) => b.status === activeTab);

  const statCards = [
    { key: 'total',     label: 'Total',     color: '#c44df0', icon: '📋' },
    { key: 'pending',   label: 'Pending',   color: '#fbbf24', icon: '⏳' },
    { key: 'approved',  label: 'Approved',  color: '#4ade80', icon: '✅' },
    { key: 'completed', label: 'Completed', color: '#a5b4fc', icon: '🏁' },
    { key: 'rejected',  label: 'Rejected',  color: '#f87171', icon: '❌' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-dark-mesh min-h-full">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Bookings Dashboard</h1>
        <p className="text-gray-500 text-sm">Manage and track all customer booking requests</p>
      </div>

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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.key}
            id={`stat-${stat.key}`}
            className="glass-card rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
              {stats[stat.key]}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h2 className="text-lg font-bold text-white">All Bookings</h2>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'completed', 'rejected'].map((tab) => (
            <button
              key={tab}
              id={`admin-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium capitalize transition-all duration-200 ${
                activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
              style={
                activeTab === tab
                  ? {
                      background: 'linear-gradient(135deg, #c44df0, #8a20b0)',
                      boxShadow: '0 4px 15px rgba(196,77,240,0.3)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }
              }
            >
              {tab === 'all' ? `All (${stats.total})` : `${tab} (${stats[tab] ?? 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-xl font-bold text-white mb-2">No bookings</p>
            <p className="text-gray-600 text-sm">
              No {activeTab !== 'all' ? activeTab : ''} bookings found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                            <div className="text-white text-sm font-medium">{booking.clientName}</div>
                            <div className="text-xs text-gray-500">{booking.clientEmail}</div>
                            <div className="text-xs text-gray-400">{booking.clientPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-300 text-sm">
                        {booking.serviceId?.title || 'N/A'}
                      </td>
                      <td className="text-gray-400 text-sm">
                        {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td className="text-gray-500 text-xs max-w-32 truncate">
                        {booking.message || '—'}
                      </td>
                      <td>
                        <span className={cfg.badge}>{cfg.icon} {cfg.label}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 flex-wrap">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                id={`approve-${booking._id}`}
                                onClick={() => updateBookingStatus(booking._id, 'approved')}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}
                              >
                                Approve
                              </button>
                              <button
                                id={`reject-${booking._id}`}
                                onClick={() => updateBookingStatus(booking._id, 'rejected')}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {booking.status === 'approved' && (
                            <button
                              id={`complete-${booking._id}`}
                              onClick={() => updateBookingStatus(booking._id, 'completed')}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}
                            >
                              Complete
                            </button>
                          )}
                          <button
                            id={`delete-${booking._id}`}
                            onClick={() => deleteBooking(booking._id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                            style={{ background: 'rgba(107,114,128,0.15)', border: '1px solid rgba(107,114,128,0.3)', color: '#9ca3af' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
