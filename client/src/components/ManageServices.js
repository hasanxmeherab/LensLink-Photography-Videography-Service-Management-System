import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../services/api';

const emptyForm = {
  title: '',
  description: '',
  category: '',
  price: '',
  duration: '',
  image: '',
};

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getAll();
      setServices(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editingId) {
        await serviceAPI.update(editingId, formData);
        setServices(services.map((s) => (s._id === editingId ? { ...s, ...formData } : s)));
      } else {
        const response = await serviceAPI.create(formData);
        setServices([...services, response.data.data]);
      }
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setFormData(service);
    setEditingId(service._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service permanently?')) return;
    try {
      await serviceAPI.delete(id);
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      setError('Failed to delete service');
    }
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-96"
      >
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-dark-mesh min-h-full">
      {/* Page heading */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Manage Services</h1>
          <p className="text-gray-500 text-sm">{services.length} services total</p>
        </div>
        {!showForm && (
          <button
            id="add-service-btn"
            onClick={() => setShowForm(true)}
            className="btn-primary text-sm px-5 py-2.5"
          >
            + Add Service
          </button>
        )}
      </div>

      <div>
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

        {/* Form */}
        {showForm && (
          <div
            className="rounded-2xl p-8 mb-8"
            style={{
              background: 'rgba(14,14,26,0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(196,77,240,0.2)',
              boxShadow: '0 0 30px rgba(196,77,240,0.08)',
            }}
          >
            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? '✏️ Edit Service' : '➕ Add New Service'}
            </h2>

            <form onSubmit={handleSubmit} id="service-form" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Service Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="service-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Wedding Photography"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  id="service-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field cursor-pointer"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                >
                  <option value="" style={{ background: '#141426' }}>Select Category</option>
                  <option value="Photography" style={{ background: '#141426' }}>📸 Photography</option>
                  <option value="Videography" style={{ background: '#141426' }}>🎥 Videography</option>
                  <option value="Editing" style={{ background: '#141426' }}>✂️ Editing</option>
                  <option value="Package" style={{ background: '#141426' }}>📦 Package</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Price (৳) <span className="text-red-400">*</span>
                </label>
                <input
                  id="service-price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="5000"
                  min="0"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Duration
                </label>
                <input
                  id="service-duration"
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 4 Hours"
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="service-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the service..."
                  rows={4}
                  className="input-field resize-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Image URL
                </label>
                <input
                  id="service-image"
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-4 max-h-48 rounded-xl object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  id="service-submit"
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl font-bold text-white transition-all duration-300"
                  style={{
                    background: submitting
                      ? 'rgba(100,100,120,0.5)'
                      : 'linear-gradient(135deg, #c44df0, #8a20b0)',
                    boxShadow: submitting ? 'none' : '0 8px 25px rgba(196,77,240,0.3)',
                  }}
                >
                  {submitting ? 'Saving...' : editingId ? '💾 Update Service' : '➕ Create Service'}
                </button>
                <button
                  id="service-cancel"
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-3 rounded-xl font-semibold text-gray-400 hover:text-white transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">
            Services{' '}
            <span className="text-sm font-normal text-gray-500">({services.length})</span>
          </h2>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-xl font-bold text-white mb-2">No services yet</p>
            <p className="text-gray-500 mb-6">Add your first service to get started</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Add First Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                id={`service-item-${service._id}`}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {service.image && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(8,8,16,0.6) 0%, transparent 60%)' }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg font-bold text-white leading-snug">{service.title}</h3>
                    <span
                      className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                      style={{
                        background: 'rgba(196,77,240,0.15)',
                        border: '1px solid rgba(196,77,240,0.3)',
                        color: '#d877f9',
                      }}
                    >
                      {service.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span
                      className="text-xl font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #d877f9, #f59e0b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      ৳{Number(service.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">⏱️ {service.duration}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      id={`edit-service-${service._id}`}
                      onClick={() => handleEdit(service)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                      style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: '#a5b4fc',
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      id={`delete-service-${service._id}`}
                      onClick={() => handleDelete(service._id)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServices;
