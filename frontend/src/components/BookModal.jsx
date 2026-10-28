import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * BookModal Component
 * Fulfills Module 1: Display comprehensive book details (synopsis, ISBN, publisher, stock, price)
 */
export default function BookModal({ book, onClose, onToast }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!book) return null;

  const fallbackCover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";

  const handleAdd = () => {
    const result = addToCart(book, quantity);
    if (onToast) {
      onToast(result.message, result.success ? 'success' : 'warning');
    }
    if (result.success) {
      onClose();
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(30, 20, 15, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1055 }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          
          {/* Modal Header */}
          <div className="modal-header border-bottom py-3 px-4" style={{ backgroundColor: '#FBF8F2' }}>
            <h4 className="modal-title brand-font fs-5 mb-0 text-dark">
              <i className="bi bi-book-half text-success me-2"></i>
              Book Details
            </h4>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="row g-4 align-items-center">
              
              {/* Cover Column */}
              <div className="col-md-5 text-center">
                <div
                  className="rounded-3 shadow-sm overflow-hidden mx-auto"
                  style={{ maxHeight: '380px', maxWidth: '260px', backgroundColor: '#F5EFEB' }}
                >
                  <img
                    src={imageError || !book.cover_image ? fallbackCover : book.cover_image}
                    alt={book.title}
                    className="img-fluid w-100 h-100 object-fit-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
                <div className="mt-3">
                  <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
                    ISBN: {book.isbn || '978-0123456789'}
                  </span>
                </div>
              </div>

              {/* Details Column */}
              <div className="col-md-7">
                <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill mb-2">
                  {book.category_name || 'Literature'}
                </span>
                <h3 className="brand-font mb-1 text-dark">{book.title}</h3>
                <h6 className="text-muted mb-3">Written by <strong className="text-dark">{book.author}</strong></h6>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="fs-3 fw-bold text-success">
                    ${Number(book.price).toFixed(2)}
                  </span>
                  <span className="text-muted">|</span>
                  <span className={`badge ${book.stock > 0 ? 'bg-success' : 'bg-danger'} px-3 py-2 rounded-pill`}>
                    {book.stock > 0 ? `${book.stock} Copies in Stock` : 'Out of Stock'}
                  </span>
                  <span className="text-warning small">
                    <i className="bi bi-star-fill me-1"></i>
                    {Number(book.rating || 4.5).toFixed(1)} / 5.0
                  </span>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold small text-uppercase text-muted">Synopsis & Description</h6>
                  <p className="small text-secondary" style={{ lineHeight: 1.7 }}>
                    {book.description || 'A remarkable work in the Book Haven catalogue, offering readers an immersive journey through richly drawn narratives, thought-provoking themes, and masterful prose.'}
                  </p>
                </div>

                <div className="row g-2 small text-muted mb-4 border-top pt-2">
                  <div className="col-6">
                    <strong>Publisher:</strong> {book.publisher || 'Book Haven Press'}
                  </div>
                  <div className="col-6">
                    <strong>Year:</strong> {book.published_year || 2023}
                  </div>
                </div>

                {/* Add to Cart Section */}
                {book.stock > 0 ? (
                  <div className="d-flex align-items-center gap-3">
                    <div className="input-group" style={{ width: '130px' }}>
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={quantity}
                        min="1"
                        max={book.stock}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(book.stock, parseInt(e.target.value) || 1)))}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn btn-haven-primary flex-grow-1"
                      onClick={handleAdd}
                    >
                      <i className="bi bi-bag-plus-fill me-2"></i>
                      Add {quantity} to Cart (${(book.price * quantity).toFixed(2)})
                    </button>
                  </div>
                ) : (
                  <div className="alert alert-warning mb-0 py-2">
                    <i className="bi bi-info-circle me-1"></i> This book is currently sold out. Please check back later or contact inventory.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-top py-2 px-4 bg-light">
            <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill px-4" onClick={onClose}>
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
