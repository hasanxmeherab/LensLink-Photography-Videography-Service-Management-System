import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const navItems = [
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/admin/manage-services', icon: '📦', label: 'Manage Services' },
  { path: '/admin/manage-portfolio', icon: '🖼️', label: 'Manage Portfolio' },
];

const AdminLayout = () => {
  const { adminUser, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex" style={{ background: '#080810' }}>
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'rgba(14, 14, 26, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          minHeight: '100vh',
        }}
      >
        {/* Logo */}
        <div
          className="p-6 flex items-center gap-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #c44df0, #8a20b0)' }}
          >
            LL
          </div>
          <div>
            <div
              className="font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, #e8a9fd, #c44df0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              LensLink
            </div>
            <div className="text-xs text-gray-600">Admin Portal</div>
          </div>
        </div>

        {/* Admin Badge */}
        <div className="px-4 pt-4">
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: 'rgba(196,77,240,0.08)',
              border: '1px solid rgba(196,77,240,0.15)',
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #c44df0, #8a20b0)' }}
            >
              {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {adminUser?.name || 'Admin'}
              </div>
              <div className="text-xs text-purple-400">Administrator</div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <div className="text-xs text-gray-600 uppercase tracking-wider px-3 mb-3">
            Management
          </div>

          {navItems.map((item) => (
            <button
              key={item.path}
              id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={
                isActive(item.path)
                  ? {
                      background: 'rgba(196, 77, 240, 0.15)',
                      border: '1px solid rgba(196, 77, 240, 0.25)',
                      color: '#d877f9',
                    }
                  : {
                      color: '#9ca3af',
                      border: '1px solid transparent',
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = '';
                  e.currentTarget.style.color = '#9ca3af';
                }
              }}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {isActive(item.path) && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: '#c44df0' }}
                />
              )}
            </button>
          ))}

          <div className="text-xs text-gray-600 uppercase tracking-wider px-3 mt-5 mb-3">
            Site
          </div>

          <Link
            to="/"
            id="sidebar-public-site"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ color: '#9ca3af', border: '1px solid transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            <span className="text-base">🌐</span>
            <span>View Public Site</span>
            <span className="ml-auto text-gray-700 text-xs">↗</span>
          </Link>
        </nav>

        {/* Logout */}
        <div
          className="p-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            id="sidebar-logout"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              color: '#f87171',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            }}
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar */}
        <div
          className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{
            background: 'rgba(8,8,16,0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Mobile hamburger */}
          <button
            id="sidebar-toggle"
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition mr-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className="block h-0.5 w-full bg-current" />
              <span className="block h-0.5 w-full bg-current" />
              <span className="block h-0.5 w-full bg-current" />
            </div>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
            <span className="text-gray-600">Admin</span>
            <span className="text-gray-700">/</span>
            <span className="text-gray-300 font-medium truncate">
              {navItems.find((n) => isActive(n.path))?.label || 'Dashboard'}
            </span>
          </div>

          {/* Date */}
          <div className="hidden sm:block text-xs text-gray-600 ml-auto">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
