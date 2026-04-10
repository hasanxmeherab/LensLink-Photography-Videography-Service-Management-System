import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/booking', label: 'Book Now' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(8, 8, 16, 0.95)'
          : 'rgba(8, 8, 16, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(196, 77, 240, 0.15)'
          : '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            id="nav-logo"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-all duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #c44df0, #8a20b0)' }}
            >
              LL
            </div>
            <div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #e8a9fd, #c44df0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                LensLink
              </span>
              <div className="text-xs text-gray-500 -mt-0.5 hidden sm:block">Photography & Videography</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                id={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={
                  isActive(link.to)
                    ? {
                        background: 'rgba(196, 77, 240, 0.15)',
                        color: '#d877f9',
                      }
                    : {}
                }
              >
                {link.label}
                {isActive(link.to) && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: '#c44df0' }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  id="nav-dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span>👤</span>
                  <span className="max-w-24 truncate">{user.name}</span>
                </Link>
                <button
                  id="nav-logout"
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 hover:bg-red-400/10 border border-transparent hover:border-red-400/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  id="nav-login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  id="nav-signup"
                  className="btn-primary text-sm px-5 py-2.5"
                >
                  Sign Up
                </Link>
                <Link
                  to="/admin"
                  id="nav-admin"
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                  style={{
                    background: 'rgba(138, 32, 176, 0.15)',
                    color: '#d877f9',
                    border: '1px solid rgba(196, 77, 240, 0.3)',
                  }}
                >
                  Admin
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="nav-mobile-toggle"
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  mobileOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  mobileOpen ? '-rotate-45 -translate-y-2.5' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          background: 'rgba(8, 8, 16, 0.98)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.to)
                  ? 'text-purple-300 bg-purple-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/5 space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                >
                  <span>👤</span> {user.name}'s Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex px-4 py-3 rounded-lg text-sm font-semibold text-white transition"
                  style={{ background: 'linear-gradient(135deg, #c44df0, #8a20b0)' }}
                >
                  Sign Up
                </Link>
                <Link
                  to="/admin"
                  className="flex px-4 py-3 rounded-lg text-sm text-purple-300 hover:bg-purple-900/20 transition"
                >
                  Admin Portal
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
