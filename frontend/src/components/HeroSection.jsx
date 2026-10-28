import React from 'react';

/**
 * Hero Section Component
 * Fulfills Design requirement: Professional hero section with cream, brown, dark green palette
 */
export default function HeroSection({ onExploreClick }) {
  return (
    <section className="hero-haven">
      <div className="container position-relative">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <span className="hero-badge">
              <i className="bi bi-stars me-1"></i> Curated Literary Collection
            </span>
            <h1 className="mb-3">
              Discover Your Next Great Read at Book Haven
            </h1>
            <p className="hero-tagline mb-4">
              Explore timeless classics, software engineering masterpieces, and mind-expanding philosophy. Designed with an elegant aesthetic and seamless shopping experience.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button
                onClick={onExploreClick}
                className="btn btn-warning fw-bold px-4 py-2 rounded-pill shadow-sm"
                style={{ backgroundColor: '#C08A4D', borderColor: '#C08A4D', color: '#FFFFFF' }}
              >
                <i className="bi bi-compass me-2"></i> Browse Catalogue
              </button>
              <a
                href="#admin"
                className="btn btn-outline-light px-4 py-2 rounded-pill"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#/admin';
                }}
              >
                <i className="bi bi-gear-wide-connected me-2"></i> Admin Panel
              </a>
            </div>
          </div>

          <div className="col-lg-5 d-none d-lg-block text-center">
            <div className="p-4 rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div className="row g-3 text-start">
                <div className="col-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                    <i className="bi bi-truck fs-3 text-warning"></i>
                    <div>
                      <div className="fw-bold text-white small">Free Shipping</div>
                      <div className="text-white-50" style={{ fontSize: '0.75rem' }}>On orders over $50</div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                    <i className="bi bi-patch-check fs-3 text-warning"></i>
                    <div>
                      <div className="fw-bold text-white small">100% Genuine</div>
                      <div className="text-white-50" style={{ fontSize: '0.75rem' }}>Authentic Publishers</div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                    <i className="bi bi-shield-lock fs-3 text-warning"></i>
                    <div>
                      <div className="fw-bold text-white small">Safe Checkout</div>
                      <div className="text-white-50" style={{ fontSize: '0.75rem' }}>ACID Transactions</div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                    <i className="bi bi-arrow-repeat fs-3 text-warning"></i>
                    <div>
                      <div className="fw-bold text-white small">Live Stock</div>
                      <div className="text-white-50" style={{ fontSize: '0.75rem' }}>Real-time inventory</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
