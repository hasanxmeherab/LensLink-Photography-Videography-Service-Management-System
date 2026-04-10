import React, { useState, useEffect, useRef } from 'react';
import { portfolioAPI } from '../services/api';

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'other',
  featured: false,
};

const ManagePortfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Media state
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchPortfolio(); }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await portfolioAPI.getAll();
      setPortfolioItems(res.data.data || []);
      setError('');
    } catch {
      setError('Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files);
    const totalAllowed = 10 - existingMedia.length - newFiles.length;
    const selected = picked.slice(0, totalAllowed);
    setNewFiles((p) => [...p, ...selected]);
    const previews = selected.map((f) => ({
      url: URL.createObjectURL(f),
      type: f.type.startsWith('video/') ? 'video' : 'image',
      name: f.name,
    }));
    setNewPreviews((p) => [...p, ...previews]);
    e.target.value = '';
  };

  const removeNewFile = (idx) => {
    URL.revokeObjectURL(newPreviews[idx].url);
    setNewFiles((p) => p.filter((_, i) => i !== idx));
    setNewPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const removeExistingMedia = (idx) =>
    setExistingMedia((p) => p.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('featured', formData.featured);
      if (editingId) fd.append('existingMedia', JSON.stringify(existingMedia));
      newFiles.forEach((f) => fd.append('media', f));

      if (editingId) {
        const res = await portfolioAPI.update(editingId, fd);
        setPortfolioItems((p) => p.map((item) => (item._id === editingId ? res.data.data : item)));
      } else {
        const res = await portfolioAPI.create(fd);
        setPortfolioItems((p) => [res.data.data, ...p]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save portfolio item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category || 'other',
      featured: item.featured || false,
    });
    setExistingMedia(item.media || []);
    setNewFiles([]);
    setNewPreviews([]);
    setEditingId(item._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this portfolio item permanently?')) return;
    try {
      await portfolioAPI.delete(id);
      setPortfolioItems((p) => p.filter((item) => item._id !== id));
    } catch {
      setError('Failed to delete portfolio item');
    }
  };

  const resetForm = () => {
    newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    setFormData(EMPTY_FORM);
    setNewFiles([]);
    setNewPreviews([]);
    setExistingMedia([]);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-dark-mesh min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Manage Portfolio</h1>
          <p className="text-gray-500 text-sm">{portfolioItems.length} items total</p>
        </div>
        {!showForm && (
          <button
            id="add-portfolio-btn"
            onClick={() => setShowForm(true)}
            className="btn-primary text-sm px-5 py-2.5"
          >
            + Add Item
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-6 px-5 py-4 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div
          className="rounded-2xl p-8 mb-8"
          style={{
            background: 'rgba(14,14,26,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(196,77,240,0.2)',
            boxShadow: '0 0 40px rgba(196,77,240,0.08)',
          }}
        >
          <h2 className="text-xl font-bold text-white mb-6">
            {editingId ? '✏️ Edit Portfolio Item' : '➕ Add Portfolio Item'}
          </h2>

          <form onSubmit={handleSubmit} id="portfolio-form" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="portfolio-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Sunset Wedding Ceremony"
                  className="input-field"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  id="portfolio-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field cursor-pointer"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                >
                  <option value="wedding" style={{ background: '#141426' }}>💒 Wedding</option>
                  <option value="event" style={{ background: '#141426' }}>🎉 Event</option>
                  <option value="portrait" style={{ background: '#141426' }}>🧑‍🎨 Portrait</option>
                  <option value="commercial" style={{ background: '#141426' }}>🏢 Commercial</option>
                  <option value="other" style={{ background: '#141426' }}>📁 Other</option>
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  id="portfolio-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe this portfolio item..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      id="portfolio-featured"
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className="w-12 h-6 rounded-full transition-all duration-200"
                      style={{
                        background: formData.featured ? 'linear-gradient(135deg, #c44df0, #8a20b0)' : 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-200"
                        style={{ left: formData.featured ? '26px' : '4px' }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-300">⭐ Mark as Featured</span>
                </label>
              </div>
            </div>

            {/* ── Media Upload Section ── */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Media (Images / Videos) — up to 10 files
              </label>

              {/* Existing media thumbnails */}
              {existingMedia.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Saved media (click ✕ to remove)</p>
                  <div className="flex flex-wrap gap-3">
                    {existingMedia.map((m, i) => (
                      <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(196,77,240,0.25)' }}>
                        {m.type === 'video' ? (
                          <video src={m.url} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={m.url} alt="" className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeExistingMedia(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: 'rgba(239,68,68,0.9)', color: '#fff' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New file previews */}
              {newPreviews.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">New files to upload (click ✕ to remove)</p>
                  <div className="flex flex-wrap gap-3">
                    {newPreviews.map((p, i) => (
                      <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99,102,241,0.4)' }}>
                        {p.type === 'video' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-2xl" style={{ background: 'rgba(99,102,241,0.1)' }}>
                            🎬
                            <span className="text-xs text-gray-400 px-1 text-center line-clamp-1">{p.name}</span>
                          </div>
                        ) : (
                          <img src={p.url} alt="" className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeNewFile(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: 'rgba(239,68,68,0.9)', color: '#fff' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drop zone */}
              {existingMedia.length + newFiles.length < 10 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-xl flex flex-col items-center justify-center gap-2 py-8 transition-all duration-200"
                  style={{ border: '2px dashed rgba(196,77,240,0.3)', background: 'rgba(196,77,240,0.04)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(196,77,240,0.6)'; e.currentTarget.style.background = 'rgba(196,77,240,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(196,77,240,0.3)'; e.currentTarget.style.background = 'rgba(196,77,240,0.04)'; }}
                >
                  <span className="text-3xl">📁</span>
                  <p className="text-sm text-gray-400 font-medium">Click to browse or drag files here</p>
                  <p className="text-xs text-gray-600">JPG, PNG, WEBP, GIF, MP4, WEBM, MOV — max 100MB each</p>
                  <p className="text-xs text-purple-400">{10 - existingMedia.length - newFiles.length} slots remaining</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                onChange={handleFileChange}
                className="hidden"
                id="portfolio-file-input"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                id="portfolio-submit"
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-xl font-bold text-white transition-all duration-300"
                style={{
                  background: submitting ? 'rgba(100,100,120,0.5)' : 'linear-gradient(135deg, #c44df0, #8a20b0)',
                  boxShadow: submitting ? 'none' : '0 8px 25px rgba(196,77,240,0.3)',
                }}
              >
                {submitting ? 'Uploading & Saving...' : editingId ? '💾 Update Item' : '➕ Add Item'}
              </button>
              <button
                id="portfolio-cancel"
                type="button"
                onClick={resetForm}
                className="px-8 py-3 rounded-xl font-semibold text-gray-400 hover:text-white transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Portfolio Items <span className="text-sm font-normal text-gray-500">({portfolioItems.length})</span>
        </h2>
      </div>

      {portfolioItems.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-2xl">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-xl font-bold text-white mb-2">No portfolio items yet</p>
          <p className="text-gray-500 mb-6">Add your first portfolio piece to showcase your work</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add First Item</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {portfolioItems.map((item) => {
            const firstMedia = (item.media || [])[0];
            return (
              <div
                key={item._id}
                id={`portfolio-item-${item._id}`}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden bg-gray-900">
                  {firstMedia ? (
                    firstMedia.type === 'video' ? (
                      <video src={firstMedia.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={firstMedia.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🖼️</div>
                  )}
                  {item.featured && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(245,158,11,0.9)', color: '#080810' }}>
                      ⭐
                    </div>
                  )}
                  {/* media count badge */}
                  {(item.media || []).length > 1 && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(0,0,0,0.7)', color: '#d877f9', border: '1px solid rgba(196,77,240,0.4)' }}>
                      {item.media.length} files
                    </div>
                  )}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(8,8,16,0.4)' }} />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
                  {item.category && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full inline-block mb-2"
                      style={{ background: 'rgba(196,77,240,0.15)', border: '1px solid rgba(196,77,240,0.3)', color: '#d877f9' }}
                    >
                      {item.category}
                    </span>
                  )}
                  {item.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      id={`edit-portfolio-${item._id}`}
                      onClick={() => handleEdit(item)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      id={`delete-portfolio-${item._id}`}
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManagePortfolio;
