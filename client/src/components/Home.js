import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '500+', label: 'Happy Clients' },
  { value: '1200+', label: 'Projects Done' },
  { value: '8+', label: 'Years Experience' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const features = [
  {
    icon: '📸',
    title: 'Photography',
    desc: 'Weddings, portraits, events & commercial shoots crafted with artistry.',
  },
  {
    icon: '🎥',
    title: 'Videography',
    desc: 'Cinematic films, reels & corporate videos that tell your story.',
  },
  {
    icon: '✨',
    title: 'Pro Editing',
    desc: 'Color-graded, retouched media delivered on time & beyond expectations.',
  },
  {
    icon: '🗓️',
    title: 'Easy Booking',
    desc: 'Seamless online booking so you can focus on what matters most.',
  },
];

const testimonials = [
  {
    name: 'Ayesha Rahman',
    role: 'Bride',
    text: 'LensLink captured our wedding day beyond our wildest dreams. Every photo told a beautiful story.',
    avatar: 'AR',
  },
  {
    name: 'Karim & Sons Ltd.',
    role: 'Corporate Client',
    text: 'Their commercial photography elevated our brand visuals entirely. Professional, timely, and stunning.',
    avatar: 'KS',
  },
  {
    name: 'Nadia Hossain',
    role: 'Portrait Client',
    text: 'The portrait session was so comfortable and the final results had me speechless. 10/10!',
    avatar: 'NH',
  },
];

const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 30;
      const y = (clientY / innerHeight - 0.5) * 30;
      heroRef.current.style.setProperty('--parallax-x', `${x}px`);
      heroRef.current.style.setProperty('--parallax-y', `${y}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="page-container">
      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden flex items-center justify-center min-h-screen pt-20"
        style={{
          background: 'linear-gradient(135deg, #080810 0%, #1a0a2e 50%, #0e0e1a 100%)',
        }}
      >
        {/* Ambient Orbs */}
        <div
          className="orb w-96 h-96 top-10 -left-20 opacity-30"
          style={{ background: '#6b21a8', animationDelay: '0s' }}
        />
        <div
          className="orb w-72 h-72 top-1/3 right-10 opacity-20"
          style={{ background: '#f59e0b', animationDelay: '3s' }}
        />
        <div
          className="orb w-80 h-80 bottom-0 left-1/2 opacity-20"
          style={{ background: '#a62dd4', animationDelay: '1.5s' }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(196,77,240,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(196,77,240,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          {/* Pre-label */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
            style={{
              background: 'rgba(196, 77, 240, 0.1)',
              border: '1px solid rgba(196, 77, 240, 0.3)',
              color: '#d877f9',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Premium Photography & Videography
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-white">Capture Every </span>
            <span
              style={{
                background: 'linear-gradient(135deg, #d877f9, #e8a9fd, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Precious
            </span>
            <br />
            <span className="text-white">Moment</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Award-winning photography and videography services for weddings, events, portraits, and corporate needs — crafted with passion and precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/booking"
              id="hero-book-now"
              className="btn-gold text-base px-8 py-4 rounded-xl font-bold"
            >
              Book a Session
            </Link>
            <Link
              to="/portfolio"
              id="hero-view-portfolio"
              className="btn-ghost text-base px-8 py-4"
            >
              View Portfolio
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{
                    background: 'linear-gradient(135deg, #d877f9, #f59e0b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to bottom, transparent, #080810)',
          }}
        />
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 px-4 bg-dark-mesh">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-label mb-4">What We Do</div>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Specialties
            </h2>
            <div className="brand-divider mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div
                key={feat.title}
                className="glass-card-hover rounded-2xl p-8 text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 transition-transform duration-300 hover:scale-110"
                  style={{ background: 'rgba(196, 77, 240, 0.1)', border: '1px solid rgba(196, 77, 240, 0.2)' }}
                >
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section
        className="py-20 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0a2e, #0e0e1a)',
        }}
      >
        <div
          className="orb w-96 h-96 -top-20 -right-20 opacity-20"
          style={{ background: '#a62dd4' }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Create{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #d877f9, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Magic?
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Browse our curated services and find the perfect package for your next shoot.
          </p>
          <Link
            to="/services"
            id="cta-explore-services"
            className="btn-primary text-base px-10 py-4"
          >
            Explore Services
          </Link>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 px-4" style={{ background: '#080810' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-label mb-4">Testimonials</div>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              What Clients Say
            </h2>
            <div className="brand-divider mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card-hover rounded-2xl p-8">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #c44df0, #8a20b0)' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="py-12 px-4 border-t"
        style={{
          background: '#0e0e1a',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{ background: 'linear-gradient(135deg, #c44df0, #8a20b0)' }}
              >
                LL
              </div>
              <div>
                <div
                  className="font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #e8a9fd, #c44df0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  LensLink
                </div>
                <div className="text-xs text-gray-600">Photography & Videography</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link to="/services" className="hover:text-gray-300 transition-colors">Services</Link>
              <Link to="/portfolio" className="hover:text-gray-300 transition-colors">Portfolio</Link>
              <Link to="/booking" className="hover:text-gray-300 transition-colors">Book Now</Link>
            </div>

            <div className="text-xs text-gray-600">
              © {new Date().getFullYear()} LensLink. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
