import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bookingAPI, serviceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: location.state?.serviceId || '',
    bookingDate: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    message: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getAll();
      setServices(response.data.data);
    } catch (err) {
      setError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await bookingAPI.create({ ...formData, userId: user?.id });
      setSuccess('Your booking has been submitted! We\'ll review and confirm it shortly.');
      setFormData({
        serviceId: '',
        bookingDate: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        message: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find((s) => s._id === formData.serviceId);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-dark-mesh min-h-screen">
      {/* Page Header */}
      <div
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0e0e1a 0%, #1a0a2e 100%)' }}
      >
        <div
          className="orb w-80 h-80 top-0 right-0 opacity-20"
          style={{ background: '#f59e0b' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="section-label mb-4">Let's Work Together</div>
          <h1
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Book a Session
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Fill in the details below and we'll get back to you to confirm your booking.
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to bottom, transparent, #080810)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-8">
              {/* Alerts */}
              {error && (
                <div
                  className="mb-6 px-5 py-4 rounded-xl text-sm font-medium"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                  }}
                >
                  ⚠️ {error}
                </div>
              )}
              {success && (
                <div
                  className="mb-6 px-5 py-4 rounded-xl text-sm font-medium"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#4ade80',
                  }}
                >
                  ✅ {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" id="booking-form">
                {/* Service Select */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Select Service <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="booking-service"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    className="input-field cursor-pointer"
                    style={{ WebkitAppearance: 'none', appearance: 'none' }}
                    required
                  >
                    <option value="" style={{ background: '#141426' }}>Choose a service...</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id} style={{ background: '#141426' }}>
                        {service.title} — ৳{service.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Preferred Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Name & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    placeholder="+880 ..."
                    className="input-field"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="booking-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your event, special requirements..."
                    className="input-field resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  id="booking-submit"
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                    submitting ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                  style={{
                    background: submitting
                      ? 'rgba(100,100,120,0.5)'
                      : 'linear-gradient(135deg, #c44df0, #8a20b0)',
                    color: 'white',
                    boxShadow: submitting ? 'none' : '0 8px 30px rgba(196, 77, 240, 0.4)',
                  }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        style={{ animation: 'spin 0.8s linear infinite' }}
                      />
                      Submitting...
                    </span>
                  ) : (
                    'Submit Booking Request'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Service Preview */}
            {selectedService ? (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(196, 77, 240, 0.1), rgba(138, 32, 176, 0.05))',
                  border: '1px solid rgba(196, 77, 240, 0.2)',
                }}
              >
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Selected Service
                </h3>
                <div className="text-xl font-bold text-white mb-2">{selectedService.title}</div>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{selectedService.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-gray-500 text-sm">Price</span>
                  <span
                    className="text-2xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #d877f9, #f59e0b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    ৳{selectedService.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">📷</div>
                <p className="text-gray-500 text-sm">Select a service to see details</p>
              </div>
            )}

            {/* Info Cards */}
            {[
              { icon: '✅', title: 'Quick Confirmation', desc: 'We respond within 24 hours to confirm your booking.' },
              { icon: '🔒', title: 'Secure & Trusted', desc: 'Your information is safe and handled with care.' },
              { icon: '🤝', title: 'Flexible Scheduling', desc: 'We work around your schedule for maximum convenience.' },
            ].map((info) => (
              <div
                key={info.title}
                className="flex gap-4 glass-card rounded-xl p-5"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'rgba(196, 77, 240, 0.1)' }}
                >
                  {info.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white mb-1">{info.title}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{info.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
