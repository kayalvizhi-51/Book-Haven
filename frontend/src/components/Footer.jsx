import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer Component
 * Fulfills Unit I (HTML5 Footer Semantic Structure) & Unit III (Bootstrap Layout)
 */
export default function Footer() {
  return (
    <footer className="haven-footer">
      <div className="container">
        <div className="row g-4">
          {/* Col 1: Brand & Bio */}
          <div className="col-lg-4 col-md-6">
            <h5 className="d-flex align-items-center gap-2">
              <i className="bi bi-book-half text-warning"></i>
              Book Haven
            </h5>
            <p className="small text-white-50 mb-3">
              An elegant online bookstore and inventory management system designed for avid readers and academic institutions. Crafted as a 3rd-year engineering Web Programming project.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-secondary bg-opacity-50">Unit I: HTML/CSS</span>
              <span className="badge bg-secondary bg-opacity-50">Unit II: JS/DOM</span>
              <span className="badge bg-secondary bg-opacity-50">Unit III: PHP/MySQL</span>
              <span className="badge bg-secondary bg-opacity-50">Unit IV & V: React</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="col-lg-2 col-md-6">
            <h5>Explore</h5>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li><Link to="/">Book Catalogue</Link></li>
              <li><Link to="/admin">Admin Dashboard</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Col 3: Modules Implemented */}
          <div className="col-lg-3 col-md-6">
            <h5>Modules</h5>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2 text-white-50">
              <li><i className="bi bi-check2 text-success me-1"></i> Module 1: Catalogue & Search</li>
              <li><i className="bi bi-check2 text-success me-1"></i> Module 2: Inventory Management</li>
              <li><i className="bi bi-check2 text-success me-1"></i> Module 3: Cart & Order Checkout</li>
            </ul>
          </div>

          {/* Col 4: Architecture & Stack */}
          <div className="col-lg-3 col-md-6">
            <h5>Tech Stack</h5>
            <div className="small text-white-50">
              <p className="mb-1"><strong>Frontend:</strong> React 18, Bootstrap 5.3, Vite</p>
              <p className="mb-1"><strong>Backend:</strong> PHP 8 (PDO, Prepared Statements)</p>
              <p className="mb-0"><strong>Database:</strong> MySQL via XAMPP phpMyAdmin</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-white-50">
          <div>
            &copy; {new Date().getFullYear()} Book Haven – Online Bookstore and Management System.
          </div>
          <div>
            Built with modern React & PHP PDO Architecture
          </div>
        </div>
      </div>
    </footer>
  );
}
