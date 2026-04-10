import React, { useState, useEffect } from 'react';
import { portfolioAPI } from '../services/api';

const categories = ['all', 'wedding', 'event', 'birthday', 'fashion', 'baby', 'portrait', 'commercial'];
const categoryLabels = {
  all: 'All Work',
  wedding: '💍 Wedding',
  event: '🎉 Events',
  birthday: '🎂 Birthday',
  fashion: '👗 Fashion',
  baby: '👶 Baby',
  portrait: '🖼️ Portraits',
  commercial: '🏢 Commercial',
};

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [lightboxMediaIndex, setLightboxMediaIndex] = useState(0);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getAll();
      setPortfolio(response.data.data);
    } catch (err) {
      setError('Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolio =
    filter === 'all' ? portfolio : portfolio.filter((item) => item.category === filter);

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center glass-card rounded-2xl p-12">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-red-400 mb-6">{error}</p>
          <button onClick={fetchPortfolio} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-dark-mesh">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.media && lightbox.media.length > 0 && (
              <>
                {lightbox.media[lightboxMediaIndex].type === 'image' ? (
                  <img
                    src={lightbox.media[lightboxMediaIndex].url}
                    alt={lightbox.title}
                    className="w-full max-h-[80vh] object-contain"
                  />
                ) : (
                  <video
                    src={lightbox.media[lightboxMediaIndex].url}
                    className="w-full max-h-[80vh]"
                    controls
                    autoPlay
                  />
                )}
                
                {/* Media Navigation */}
                {lightbox.media.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl transition-all hover:scale-110"
                      style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onClick={() => setLightboxMediaIndex((prev) => (prev - 1 + lightbox.media.length) % lightbox.media.length)}
                    >
                      ‹
                    </button>
                    <button
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl transition-all hover:scale-110"
                      style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onClick={() => setLightboxMediaIndex((prev) => (prev + 1) % lightbox.media.length)}
                    >
                      ›
                    </button>
                    
                    {/* Media Counter */}
                    <div
                      className="absolute bottom-4 left-4 px-3 py-2 rounded-lg text-xs text-white"
                      style={{ background: 'rgba(0,0,0,0.8)' }}
                    >
                      {lightboxMediaIndex + 1} / {lightbox.media.length}
                    </div>
                  </>
                )}
              </>
            )}
            
            <div
              className="p-6"
              style={{ background: 'rgba(14, 14, 26, 0.95)' }}
            >
              <h3 className="text-xl font-bold text-white mb-1">{lightbox.title}</h3>
              <p className="text-gray-400 text-sm">{lightbox.description}</p>
            </div>
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={() => {
                setLightbox(null);
                setLightboxMediaIndex(0);
              }}
              aria-label="Close lightbox"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0e0e1a 0%, #1a0a2e 100%)' }}
      >
        <div
          className="orb w-72 h-72 top-0 left-0 opacity-20"
          style={{ background: '#f59e0b' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="section-label mb-4">Our Work</div>
          <h1
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Portfolio
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            A curated collection of our finest photography and videography work.
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to bottom, transparent, #080810)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`portfolio-filter-${cat}`}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === cat ? 'text-white scale-105' : 'text-gray-400 hover:text-white'
              }`}
              style={
                filter === cat
                  ? {
                      background: 'linear-gradient(135deg, #c44df0, #8a20b0)',
                      boxShadow: '0 4px 20px rgba(196, 77, 240, 0.4)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }
              }
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {filteredPortfolio.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl">
            <div className="text-6xl mb-5">🖼️</div>
            <h3 className="text-2xl font-bold text-white mb-3">No items found</h3>
            <p className="text-gray-500">No portfolio items in this category yet</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filteredPortfolio.map((item, i) => {
              // Get the first media item for display
              const firstMedia = item.media && item.media.length > 0 ? item.media[0] : null;
              
              if (!firstMedia) return null; // Skip items with no media
              
              return (
                <div
                  key={item._id}
                  id={`portfolio-item-${item._id}`}
                  className="break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer relative"
                  style={{
                    border: '1px solid rgba(255,255,255,0.06)',
                    marginBottom: '1rem',
                  }}
                  onClick={() => setLightbox(item)}
                >
                  {firstMedia.type === 'image' ? (
                    <img
                      src={firstMedia.url}
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ display: 'block' }}
                    />
                  ) : (
                    <div className="relative">
                      <video
                        src={firstMedia.url}
                        className="w-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                          style={{
                            background: 'rgba(196, 77, 240, 0.8)',
                            backdropFilter: 'blur(8px)',
                          }}
                        >
                          ▶
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      background: 'linear-gradient(to top, rgba(8,8,16,0.95) 0%, rgba(8,8,16,0.5) 50%, transparent 100%)',
                    }}
                  >
                    <div
                      className="inline-block px-2 py-0.5 rounded-full text-xs mb-2 w-fit"
                      style={{
                        background: 'rgba(196, 77, 240, 0.2)',
                        border: '1px solid rgba(196, 77, 240, 0.4)',
                        color: '#d877f9',
                      }}
                    >
                      {item.category}
                    </div>
                    <h3 className="text-white text-base font-bold leading-snug">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-1 mt-3 text-xs text-purple-400">
                      <span>🔍</span>
                      <span>Click to expand</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
