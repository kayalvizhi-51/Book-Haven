import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { EmptyState } from '../components/LoadingSpinner';

/**
 * CartPage Component
 * Fulfills Module 3: Cart and Order Management
 * - Add and remove books from cart
 * - Change quantities
 * - Calculate total price automatically
 * - Place order with form validation
 * - Store order details in database
 */
export default function CartPage({ onToast }) {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotalPrice,
    shippingCost,
    taxAmount,
    totalPrice
  } = useCart();

  // Checkout modal & form states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutErrors, setCheckoutErrors] = useState({});

  const [checkoutForm, setCheckoutForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    postal_code: '',
    payment_method: 'Cash on Delivery'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
    if (checkoutErrors[name]) {
      setCheckoutErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Validate checkout fields
   */
  const validateCheckout = () => {
    const errors = {};
    if (!checkoutForm.customer_name.trim()) {
      errors.customer_name = 'Please provide your full name.';
    }
    if (!checkoutForm.customer_email.trim() || !/\S+@\S+\.\S+/.test(checkoutForm.customer_email)) {
      errors.customer_email = 'Please provide a valid email address.';
    }
    if (!checkoutForm.customer_phone.trim() || checkoutForm.customer_phone.trim().length < 7) {
      errors.customer_phone = 'Please provide a valid contact number.';
    }
    if (!checkoutForm.shipping_address.trim()) {
      errors.shipping_address = 'Shipping address is required.';
    }
    if (!checkoutForm.city.trim()) {
      errors.city = 'City name is required.';
    }
    if (!checkoutForm.postal_code.trim()) {
      errors.postal_code = 'Postal / ZIP code is required.';
    }

    setCheckoutErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Place Order & Persist to MySQL
   */
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateCheckout()) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        ...checkoutForm,
        total_amount: totalPrice,
        items: cartItems.map(item => ({
          book_id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          cover_image: item.cover_image
        }))
      };

      const result = await api.createOrder(orderPayload);

      if (result.success) {
        clearCart();
        onToast('Order placed successfully! Redirecting to receipt...', 'success');
        setShowCheckoutModal(false);
        navigate(`/order-confirmation/${result.order_id}`);
      } else {
        onToast(result.message || 'Unable to place order.', 'error');
      }
    } catch (err) {
      onToast(err.message || 'Error communicating with checkout service.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1 className="brand-font fs-2 text-dark mb-1">
          <i className="bi bi-bag-check-fill text-success me-2"></i>
          Your Shopping Cart
        </h1>
        <p className="text-muted small mb-0">
          Review your selected books, modify quantities, and proceed to checkout.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <EmptyState
          icon="bi-bag-x"
          title="Your Shopping Cart is Empty"
          description="You haven't added any books to your cart yet. Browse our rich catalogue of literature and technical classics!"
          actionText="Explore Book Catalogue"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="row g-4">
          
          {/* Left Column: Cart Items Table */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ border: '1px solid #E5DDCF' }}>
              <div className="table-responsive">
                <table className="table haven-table align-middle mb-0">
                  <thead style={{ backgroundColor: '#F7F3EB' }}>
                    <tr>
                      <th style={{ width: '80px' }}>Item</th>
                      <th>Book Details</th>
                      <th>Price</th>
                      <th style={{ minWidth: '130px' }}>Quantity</th>
                      <th>Subtotal</th>
                      <th className="text-end">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        {/* Cover Image */}
                        <td>
                          <img
                            src={item.cover_image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'}
                            alt={item.title}
                            className="rounded"
                            style={{ width: '48px', height: '64px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                        </td>

                        {/* Title & Category */}
                        <td>
                          <div className="fw-bold text-dark">{item.title}</div>
                          <div className="small text-muted">by {item.author}</div>
                          <span className="badge bg-light text-dark border small mt-1">
                            {item.category_name}
                          </span>
                        </td>

                        {/* Unit Price */}
                        <td className="fw-semibold text-secondary">
                          ${Number(item.price).toFixed(2)}
                        </td>

                        {/* Quantity Controls (Module 3: Change quantities) */}
                        <td>
                          <div className="input-group input-group-sm" style={{ width: '105px' }}>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="form-control text-center px-1"
                              value={item.quantity}
                              min="1"
                              max={item.stock}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              +
                            </button>
                          </div>
                          {item.quantity >= item.stock && (
                            <div className="text-warning small" style={{ fontSize: '0.7rem' }}>
                              Max in stock ({item.stock})
                            </div>
                          )}
                        </td>

                        {/* Subtotal (Module 3: Calculate total price automatically) */}
                        <td className="fw-bold text-success">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>

                        {/* Remove Action (Module 3: Remove books from cart) */}
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger border-0"
                            title="Remove from Cart"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cart Table Footer */}
              <div className="p-3 bg-light d-flex justify-content-between align-items-center">
                <Link to="/" className="btn btn-sm btn-outline-secondary rounded-pill">
                  <i className="bi bi-arrow-left me-1"></i> Continue Shopping
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger rounded-pill"
                  onClick={clearCart}
                >
                  <i className="bi bi-trash me-1"></i> Empty Cart
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Module 3) */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5DDCF' }}>
              <h4 className="brand-font fs-5 text-dark mb-3">Order Summary</h4>
              
              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="fw-semibold">${subtotalPrice.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Estimated Shipping</span>
                <span className="fw-semibold">
                  {shippingCost === 0 ? (
                    <span className="text-success fw-bold">FREE</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-3 small">
                <span className="text-muted">Estimated Tax (5%)</span>
                <span className="fw-semibold">${taxAmount.toFixed(2)}</span>
              </div>

              {shippingCost > 0 && (
                <div className="alert alert-info py-2 small mb-3">
                  <i className="bi bi-info-circle me-1"></i> Add ${(50 - subtotalPrice).toFixed(2)} more for free shipping!
                </div>
              )}

              <div className="d-flex justify-content-between border-top pt-3 mb-4">
                <span className="fw-bold fs-5 text-dark">Total Price</span>
                <span className="fw-bold fs-4 text-success">${totalPrice.toFixed(2)}</span>
              </div>

              <button
                type="button"
                className="btn btn-haven-primary w-100 py-3 rounded-pill fw-bold shadow-sm"
                onClick={() => setShowCheckoutModal(true)}
              >
                <i className="bi bi-lock-fill me-2"></i> Proceed to Checkout
              </button>

              <div className="text-center mt-3">
                <span className="small text-muted" style={{ fontSize: '0.78rem' }}>
                  <i className="bi bi-shield-check text-success me-1"></i> Secure 256-bit Encrypted Checkout
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          CHECKOUT MODAL (Module 3: Place order & store in database)
         ===================================================================== */}
      {showCheckoutModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 1055 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light py-3 px-4">
                <h5 className="modal-title brand-font text-dark mb-0">
                  <i className="bi bi-credit-card-2-front-fill text-success me-2"></i>
                  Delivery & Checkout Details
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCheckoutModal(false)}></button>
              </div>

              <form onSubmit={handlePlaceOrder}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    
                    {/* Customer Name */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Full Name *</label>
                      <input
                        type="text"
                        name="customer_name"
                        className={`form-control ${checkoutErrors.customer_name ? 'is-invalid' : ''}`}
                        placeholder="e.g. Aditi Sharma"
                        value={checkoutForm.customer_name}
                        onChange={handleInputChange}
                      />
                      {checkoutErrors.customer_name && <div className="invalid-feedback">{checkoutErrors.customer_name}</div>}
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email Address *</label>
                      <input
                        type="email"
                        name="customer_email"
                        className={`form-control ${checkoutErrors.customer_email ? 'is-invalid' : ''}`}
                        placeholder="aditi@example.com"
                        value={checkoutForm.customer_email}
                        onChange={handleInputChange}
                      />
                      {checkoutErrors.customer_email && <div className="invalid-feedback">{checkoutErrors.customer_email}</div>}
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number *</label>
                      <input
                        type="tel"
                        name="customer_phone"
                        className={`form-control ${checkoutErrors.customer_phone ? 'is-invalid' : ''}`}
                        placeholder="+91 9876543210"
                        value={checkoutForm.customer_phone}
                        onChange={handleInputChange}
                      />
                      {checkoutErrors.customer_phone && <div className="invalid-feedback">{checkoutErrors.customer_phone}</div>}
                    </div>

                    {/* Payment Method */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Payment Method</label>
                      <select
                        name="payment_method"
                        className="form-select"
                        value={checkoutForm.payment_method}
                        onChange={handleInputChange}
                      >
                        <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                        <option value="Credit / Debit Card">Credit / Debit Card</option>
                        <option value="UPI / Net Banking">UPI / Net Banking</option>
                      </select>
                    </div>

                    {/* Shipping Address */}
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Shipping Street Address *</label>
                      <textarea
                        name="shipping_address"
                        rows="2"
                        className={`form-control ${checkoutErrors.shipping_address ? 'is-invalid' : ''}`}
                        placeholder="House / Flat No, Street name, Area"
                        value={checkoutForm.shipping_address}
                        onChange={handleInputChange}
                      ></textarea>
                      {checkoutErrors.shipping_address && <div className="invalid-feedback">{checkoutErrors.shipping_address}</div>}
                    </div>

                    {/* City */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">City *</label>
                      <input
                        type="text"
                        name="city"
                        className={`form-control ${checkoutErrors.city ? 'is-invalid' : ''}`}
                        placeholder="e.g. Bengaluru"
                        value={checkoutForm.city}
                        onChange={handleInputChange}
                      />
                      {checkoutErrors.city && <div className="invalid-feedback">{checkoutErrors.city}</div>}
                    </div>

                    {/* Postal Code */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Postal / PIN Code *</label>
                      <input
                        type="text"
                        name="postal_code"
                        className={`form-control ${checkoutErrors.postal_code ? 'is-invalid' : ''}`}
                        placeholder="e.g. 560001"
                        value={checkoutForm.postal_code}
                        onChange={handleInputChange}
                      />
                      {checkoutErrors.postal_code && <div className="invalid-feedback">{checkoutErrors.postal_code}</div>}
                    </div>

                  </div>

                  {/* Summary Box inside Modal */}
                  <div className="mt-4 p-3 rounded-3 bg-light border">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small text-muted">Amount Payable:</span>
                      <span className="fs-5 fw-bold text-success">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCheckoutModal(false)}>
                    Back to Cart
                  </button>
                  <button type="submit" className="btn btn-haven-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Confirming Order...' : 'Confirm & Place Order'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
