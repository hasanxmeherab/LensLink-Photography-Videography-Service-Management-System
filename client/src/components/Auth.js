import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = ({ isSignup = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        await signup(formData.name, formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #080810 0%, #1a0a2e 60%, #0e0e1a 100%)' }}
    >
      {/* Orbs */}
      <div
        className="orb w-80 h-80 top-10 -left-20 opacity-25"
        style={{ background: '#6b21a8', animationDelay: '0s' }}
      />
      <div
        className="orb w-60 h-60 bottom-10 -right-10 opacity-20"
        style={{ background: '#f59e0b', animationDelay: '3s' }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(196,77,240,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(196,77,240,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #c44df0, #8a20b0)' }}
            >
              LL
            </div>
            <span
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #e8a9fd, #c44df0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              LensLink
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(14, 14, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isSignup
                ? 'Join LensLink to book and track your sessions'
                : 'Sign in to manage your bookings'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-xl text-sm"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="auth-form">
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="input-field"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  required
                />
                <button
                  type="button"
                  id="auth-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 mt-2"
              style={{
                background: loading
                  ? 'rgba(100,100,120,0.5)'
                  : 'linear-gradient(135deg, #c44df0, #8a20b0)',
                boxShadow: loading ? 'none' : '0 8px 25px rgba(196, 77, 240, 0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    style={{ animation: 'spin 0.8s linear infinite' }}
                  />
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div
            className="mt-6 pt-6 text-center text-sm text-gray-500"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {isSignup ? (
              <>
                Already have an account?{' '}
                <Link
                  to="/login"
                  id="auth-switch-login"
                  className="font-semibold transition-colors"
                  style={{ color: '#d877f9' }}
                  onMouseEnter={(e) => (e.target.style.color = '#e8a9fd')}
                  onMouseLeave={(e) => (e.target.style.color = '#d877f9')}
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  id="auth-switch-signup"
                  className="font-semibold transition-colors"
                  style={{ color: '#d877f9' }}
                  onMouseEnter={(e) => (e.target.style.color = '#e8a9fd')}
                  onMouseLeave={(e) => (e.target.style.color = '#d877f9')}
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>

          {/* Admin link */}
          <div className="mt-4 text-center">
            <Link
              to="/admin"
              id="auth-admin-link"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Admin Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
