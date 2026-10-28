import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';
import CataloguePage from './pages/CataloguePage';
import AdminDashboard from './pages/AdminDashboard';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

/**
 * Root Application Component
 * Demonstrates Unit IV & V Architecture:
 * - Routing via React Router v6
 * - State management and prop drilling for toast alerts
 * - Modular component composition
 */
export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        <Routes>
          {/* Module 1: Book Catalogue & Search */}
          <Route path="/" element={<CataloguePage onToast={showToast} />} />

          {/* Module 2: Book and Inventory Management */}
          <Route path="/admin" element={<AdminDashboard onToast={showToast} />} />

          {/* Module 3: Shopping Cart & Checkout */}
          <Route path="/cart" element={<CartPage onToast={showToast} />} />

          {/* Module 3: Order Confirmation Receipt */}
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />

          {/* 404 Fallback Route */}
          <Route
            path="*"
            element={
              <div className="container py-5 text-center my-5">
                <i className="bi bi-compass fs-1 text-warning mb-3 d-block"></i>
                <h2 className="brand-font">Page Not Found</h2>
                <p className="text-muted">The requested section does not exist in Book Haven.</p>
                <Link to="/" className="btn btn-haven-primary rounded-pill px-4">
                  Back to Catalogue
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Toast Notification Layer */}
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
