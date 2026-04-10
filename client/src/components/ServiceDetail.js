import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceAPI } from '../services/api';

const categoryIcons = {
  photography: '📸',
  videography: '🎥',
  editing: '✂️',
  package: '📦',
};

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeMedia, setActiveMedia] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await serviceAPI.getById(id);
        setService(res.data.data);
      } catch {
        setError('Service not found');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleBookNow = () => {
    navigate('/booking', { state: { serviceId: id } });
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading service...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center glass-card rounded-2xl p-12">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-red-400 mb-6 text-lg">{error || 'Service not found'}</p>
          <button onClick={() => navigate('/services')} className="btn-primary">← Back to Services</button>
        </div>
      </div>
    );
  }

  const media = service.media || [];
  const currentMedia = media[activeMedia];

  return (
    <div className="page-container bg-dark-mesh min-h-screen pt-24">
      {/* Lightbox */}
      {lightbox && currentMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-5 right-6 text-white text-3xl font-bold hover:text-purple-400 transition-colors"
            onClick={() => setLightbox(false)}
          >✕</button>
          {/* Prev */}
          {media.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all"
              style={{ background: 'rgba(196,77,240,0.3)', border: '1px solid rgba(196,77,240,0.5)' }}
              onClick={(e) => { e.stopPropagation(); setActiveMedia((p) => (p - 1 + media.length) % media.length); }}
            >‹</button>
          )}
          {/* Media */}
          <div onClick={(e) => e.stopPropagation()} className="max-w-5xl max-h-[85vh] w-full overflow-hidden rounded-2xl">
            {currentMedia.type === 'video' ? (
              <video src={currentMedia.url} controls className="w-full max-h-[85vh] rounded-2xl" autoPlay />
            ) : (
              <img src={currentMedia.url} alt={service.title} className="w-full max-h-[85vh] object-contain rounded-2xl" />
            )}
          </div>
          {/* Next */}
          {media.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all"
              style={{ background: 'rgba(196,77,240,0.3)', border: '1px solid rgba(196,77,240,0.5)' }}
              onClick={(e) => { e.stopPropagation(); setActiveMedia((p) => (p + 1) % media.length); }}
            >›</button>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
            {activeMedia + 1} / {media.length}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm"
        >
          ← Back to Services
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── Left: Media Gallery ── */}
          <div>
            {/* Main media viewer */}
            <div
              className="relative rounded-2xl overflow-hidden mb-4 cursor-zoom-in"
              style={{ aspectRatio: '16/9', background: '#0e0e1a', border: '1px solid rgba(196,77,240,0.2)' }}
              onClick={() => media.length > 0 && setLightbox(true)}
            >
              {currentMedia ? (
                currentMedia.type === 'video' ? (
                  <video
                    src={currentMedia.url}
                    controls
                    className="w-full h-full object-cover"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <img src={currentMedia.url} alt={service.title} className="w-full h-full object-cover" />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
                  {categoryIcons[service.category?.toLowerCase()] || '📸'}
                </div>
              )}
              {/* Expand hint */}
              {currentMedia?.type === 'image' && (
                <div
                  className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs text-gray-300"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
                >
                  🔍 Click to expand
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {media.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {media.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMedia(i)}
                    className="flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden transition-all duration-200"
                    style={{
                      border: i === activeMedia
                        ? '2px solid #c44df0'
                        : '2px solid rgba(255,255,255,0.08)',
                      opacity: i === activeMedia ? 1 : 0.6,
                    }}
                  >
                    {m.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center text-xl" style={{ background: 'rgba(196,77,240,0.15)' }}>🎬</div>
                    ) : (
                      <img src={m.url} alt={`Media ${i + 1}`} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* No media placeholder */}
            {media.length === 0 && (
              <div
                className="rounded-2xl flex items-center justify-center text-6xl opacity-20"
                style={{ aspectRatio: '16/9', background: 'rgba(196,77,240,0.05)', border: '1px solid rgba(196,77,240,0.1)' }}
              >
                {categoryIcons[service.category?.toLowerCase()] || '📸'}
              </div>
            )}
          </div>

          {/* ── Right: Service Info ── */}
          <div className="flex flex-col">
            {/* Category badge */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(196,77,240,0.15)', border: '1px solid rgba(196,77,240,0.3)', color: '#d877f9' }}
              >
                {categoryIcons[service.category?.toLowerCase()]} {service.category}
              </span>
              {media.length > 0 && (
                <span className="text-xs text-gray-500">{media.length} photo{media.length > 1 ? 's/videos' : '/video'}</span>
              )}
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {service.title}
            </h1>

            <p className="text-gray-400 leading-relaxed mb-6 text-base">{service.description}</p>

            {/* Details */}
            <div
              className="rounded-xl p-5 mb-6 space-y-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm flex items-center gap-2">⏱️ Duration</span>
                <span className="text-white text-sm font-semibold">{service.duration || 'Flexible'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm flex items-center gap-2">📁 Category</span>
                <span className="text-white text-sm font-semibold capitalize">{service.category}</span>
              </div>
              {media.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm flex items-center gap-2">🖼️ Portfolio Media</span>
                  <span className="text-white text-sm font-semibold">{media.length} file{media.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{ background: 'rgba(196,77,240,0.06)', border: '1px solid rgba(196,77,240,0.2)' }}
            >
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Starting at</p>
              <p
                className="text-4xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #d877f9, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ৳{service.price.toLocaleString()}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                id={`book-service-detail-${service._id}`}
                onClick={handleBookNow}
                className="btn-primary flex-1 py-3 text-base font-bold"
              >
                📅 Book This Service
              </button>
              <button
                onClick={() => navigate('/services')}
                className="flex-1 py-3 rounded-xl font-semibold text-gray-400 hover:text-white transition-all text-sm"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                ← Browse All Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
