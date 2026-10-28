import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

/**
 * Navbar Component
 * Fulfills Unit IV (Reusable Components) & Unit V (React Router Navigation, State)
 */
export default function Navbar() {
  const location = useLocation();
  const { totalItemsCount } = useCart();
  const [backendStatus, setBackendStatus] = useState({ checking: true, isLive: false });

  // Check backend health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setBackendStatus(prev => ({ ...prev, checking: true }));
    const res = await api.checkConnection();
    setBackendStatus({ checking: false, isLive: res.isLive });
  };

  return (
    <nav className="navbar navbar-expand-lg haven-navbar">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand haven-brand" to="/">
          <i className="bi bi-book-half"></i>
          <span>Book Haven</span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#havenNavbarContent"
          aria-controls="havenNavbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div className="collapse navbar-collapse" id="havenNavbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link
                className={`nav-link nav-link-haven ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
              >
                <i className="bi bi-grid me-1"></i> Catalogue
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link nav-link-haven ${location.pathname === '/admin' ? 'active' : ''}`}
                to="/admin"
              >
                <i className="bi bi-sliders me-1"></i> Inventory Admin
              </Link>
            </li>
          </ul>

          {/* Right Action Items */}
          <div className="d-flex align-items-center gap-3">
            {/* Backend Health Pill */}
            <button
              onClick={checkHealth}
              className="btn btn-sm d-none d-md-inline-flex align-items-center gap-1 border-0 rounded-pill px-3 py-1"
              style={{
                backgroundColor: backendStatus.isLive ? '#E8F5E9' : '#FFF3E0',
                color: backendStatus.isLive ? '#2E7D32' : '#E65100',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
              title="Click to re-check PHP + MySQL XAMPP connection"
            >
              <i className={`bi ${backendStatus.checking ? 'bi-arrow-repeat' : backendStatus.isLive ? 'bi-database-check' : 'bi-database-exclamation'}`}></i>
              <span>{backendStatus.isLive ? 'MySQL Live' : 'Demo Mode'}</span>
            </button>

            {/* Shopping Cart Pill Button */}
            <Link to="/cart" className="cart-badge-btn" title="View Shopping Cart">
              <i className="bi bi-bag-heart-fill"></i>
              <span>Cart</span>
              {totalItemsCount > 0 && (
                <span className="cart-badge-count">{totalItemsCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
