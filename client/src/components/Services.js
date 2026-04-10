import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceAPI } from '../services/api';

const categoryIcons = {
  Photography: '📸',
  Videography: '🎥',
  Wedding: '💍',
  Event: '🎉',
  Commercial: '🏢',
  Portrait: '🖼️',
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterAndSortServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services, searchTerm, selectedCategory, sortBy]);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getAll();
      setServices(response.data.data || []);
      const uniqueCategories = [...new Set(response.data.data.map((s) => s.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortServices = () => {
    let filtered = services.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

    setFilteredServices(filtered);
  };

  const handleBookNow = (serviceId) => {
    navigate('/booking', { state: { serviceId } });
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center glass-card rounded-2xl p-12">
          <div className="text-5xl mb-4">📷</div>
          <p className="text-red-400 mb-6 text-lg">{error}</p>
          <button onClick={fetchServices} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-dark-mesh">
      {/* Page Header */}
      <div
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0e0e1a 0%, #1a0a2e 100%)',
        }}
      >
        <div
          className="orb w-80 h-80 top-0 right-0 opacity-20"
          style={{ background: '#a62dd4' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="section-label mb-4">Our Offerings</div>
          <h1
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Services
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Comprehensive photography and videography packages tailored to your vision and budget.
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to bottom, transparent, #080810)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Search & Filters */}
        <div className="glass-card rounded-2xl p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
              <input
                id="services-search"
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Category */}
            <div className="md:w-52">
              <select
                id="services-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field cursor-pointer"
                style={{ WebkitAppearance: 'none', appearance: 'none' }}
              >
                <option value="All" style={{ background: '#141426' }}>All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} style={{ background: '#141426' }}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="md:w-52">
              <select
                id="services-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field cursor-pointer"
                style={{ WebkitAppearance: 'none', appearance: 'none' }}
              >
                <option value="name" style={{ background: '#141426' }}>Name (A–Z)</option>
                <option value="price-low" style={{ background: '#141426' }}>Price: Low → High</option>
                <option value="price-high" style={{ background: '#141426' }}>Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              id={`cat-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              style={
                selectedCategory === cat
                  ? {
                      background: 'linear-gradient(135deg, #c44df0, #8a20b0)',
                      boxShadow: '0 4px 15px rgba(196, 77, 240, 0.3)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }
              }
            >
              {categoryIcons[cat] && <span className="mr-1">{categoryIcons[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-gray-500 text-sm mb-8">
          Showing{' '}
          <span style={{ color: '#c44df0' }} className="font-semibold">
            {filteredServices.length}
          </span>{' '}
          of <span className="text-gray-300 font-semibold">{services.length}</span> services
        </p>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl">
            <div className="text-6xl mb-5">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-3">No services found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, i) => (
              <div
                key={service._id}
                id={`service-card-${service._id}`}
                className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-2"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  animationDelay: `${i * 0.05}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(196, 77, 240, 0.3)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(196,77,240,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-5xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(166, 45, 212, 0.2), rgba(138, 32, 176, 0.3))',
                      }}
                    >
                      {categoryIcons[service.category] || '📸'}
                    </div>
                  )}
                  {/* Category Badge */}
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{
                      background: 'rgba(8, 8, 16, 0.8)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(196, 77, 240, 0.4)',
                    }}
                  >
                    {service.category}
                  </div>
                  {/* Image overlay gradient */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(8,8,16,0.8) 0%, transparent 60%)',
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Duration */}
                  <div
                    className="flex items-center gap-2 text-xs text-gray-500 mb-5 pb-5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span>⏱️</span>
                    <span>Duration: {service.duration}</span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Starting at</p>
                      <p
                        className="text-2xl font-bold"
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
                    <button
                      id={`book-service-${service._id}`}
                      onClick={() => handleBookNow(service._id)}
                      className="btn-primary text-sm px-5 py-2.5"
                    >
                      Book Now
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

export default Services;
