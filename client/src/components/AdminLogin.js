import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminUser, adminLogin } = useAdminAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (adminUser) navigate('/admin/dashboard', { replace: true });
  }, [adminUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(formData.email, formData.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #080810 0%, #0e0e1a 50%, #141426 100%)' }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(196,77,240,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(196,77,240,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Subtle orbs */}
      <div
        className="orb w-72 h-72 top-0 right-0 opacity-10"
        style={{ background: '#6b21a8', animationDelay: '2s' }}
      />
      <div
        className="orb w-60 h-60 bottom-0 left-0 opacity-10"
        style={{ background: '#c44df0', animationDelay: '0s' }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Icon */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
            style={{
              background: 'linear-gradient(135deg, #c44df0, #8a20b0)',
              boxShadow: '0 8px 30px rgba(196, 77, 240, 0.4)',
            }}
          >
            🛡️
          </div>
          <h1
            className="text-3xl font-bold text-white mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Admin Portal
          </h1>
          <p className="text-gray-500 text-sm">LensLink Management System</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(14, 14, 26, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          }}
        >
          {/* Security Badge */}
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-xs"
            style={{
              background: 'rgba(196, 77, 240, 0.08)',
              border: '1px solid rgba(196, 77, 240, 0.2)',
              color: '#d877f9',
            }}
          >
            <span>🔒</span>
            <span>Secure access required. Authorized personnel only.</span>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="admin-login-form">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@lenslink.com"
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
                  id="admin-password"
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
                  id="admin-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300"
              style={{
                background: loading
                  ? 'rgba(100,100,120,0.5)'
                  : 'linear-gradient(135deg, #c44df0, #8a20b0)',
                boxShadow: loading ? 'none' : '0 8px 25px rgba(196, 77, 240, 0.4)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    style={{ animation: 'spin 0.8s linear infinite' }}
                  />
                  Authenticating...
                </span>
              ) : (
                'Sign In to Admin'
              )}
            </button>
          </form>

          <div
            className="mt-6 pt-5 text-center text-sm text-gray-600"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            Not an admin?{' '}
            <Link
              to="/"
              id="admin-back-home"
              className="transition-colors font-medium"
              style={{ color: '#9ca3af' }}
              onMouseEnter={(e) => (e.target.style.color = '#e5e7eb')}
              onMouseLeave={(e) => (e.target.style.color = '#9ca3af')}
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
