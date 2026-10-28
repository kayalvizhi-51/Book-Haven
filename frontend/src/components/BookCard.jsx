import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * BookCard Component
 * Fulfills Module 1: Display books with cover images, title, author, category, price, and stock.
 * Handles adding to cart and triggering view details.
 */
export default function BookCard({ book, onViewDetails, onToast }) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  // Safe fallback cover if internet is down or unsplash link fails
  const fallbackCover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const result = addToCart(book, 1);
    if (onToast) {
      onToast(result.message, result.success ? 'success' : 'warning');
    }
  };

  // Stock badge helper
  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return <span className="stock-tag stock-out"><i className="bi bi-x-circle me-1"></i>Out of Stock</span>;
    } else if (stock <= 5) {
      return <span className="stock-tag stock-low"><i className="bi bi-exclamation-triangle me-1"></i>Only {stock} Left</span>;
    } else {
      return <span className="stock-tag stock-in"><i className="bi bi-check-circle me-1"></i>In Stock ({stock})</span>;
    }
  };

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
      <div className="book-card h-100">
        {/* Cover Container */}
        <div className="book-cover-container" onClick={() => onViewDetails(book)} style={{ cursor: 'pointer' }}>
          <img
            src={imageError || !book.cover_image ? fallbackCover : book.cover_image}
            alt={book.title}
            className="book-cover-img"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          {/* Category Pill Tag */}
          <span className="category-tag">
            {book.category_name || 'Literature'}
          </span>
          {/* Stock Tag */}
          {getStockBadge(book.stock)}
        </div>

        {/* Card Body */}
        <div className="book-card-body">
          <h3
            className="book-card-title"
            title={book.title}
            onClick={() => onViewDetails(book)}
            style={{ cursor: 'pointer' }}
          >
            {book.title}
          </h3>
          <div className="book-card-author">
            by <span>{book.author}</span>
          </div>

          {/* Rating Stars & Year */}
          <div className="d-flex align-items-center justify-content-between small text-muted mb-3">
            <span className="text-warning">
              <i className="bi bi-star-fill me-1"></i>
              <strong className="text-dark">{Number(book.rating || 4.5).toFixed(1)}</strong>
            </span>
            <span>{book.published_year || 2023}</span>
          </div>

          {/* Price & Action Row */}
          <div className="mt-auto pt-2 border-top d-flex align-items-center justify-content-between">
            <div className="book-card-price">
              ${Number(book.price).toFixed(2)}
            </div>
            
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-circle"
                title="View Full Details"
                onClick={() => onViewDetails(book)}
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="bi bi-eye"></i>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-haven-primary rounded-pill px-3"
                disabled={book.stock <= 0}
                onClick={handleAddToCart}
                title={book.stock <= 0 ? 'Out of stock' : 'Add to shopping cart'}
              >
                <i className="bi bi-cart-plus me-1"></i>
                {book.stock <= 0 ? 'Sold' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
