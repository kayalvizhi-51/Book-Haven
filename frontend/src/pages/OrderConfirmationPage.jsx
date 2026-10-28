import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner, ErrorState } from '../components/LoadingSpinner';

/**
 * OrderConfirmationPage Component
 * Fulfills Module 3: Display order confirmation and line items receipt
 */
export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await api.getOrderById(id);
      if (res.data) {
        setOrder(res.data);
      } else {
        setError(`Order #${id} could not be located.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve order confirmation details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-5">
        <LoadingSpinner message="Generating your order confirmation receipt..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-5">
        <ErrorState message={error || 'Order record not found.'} onRetry={fetchOrderDetails} />
        <div className="text-center mt-3">
          <Link to="/" className="btn btn-haven-primary rounded-pill">
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          
          {/* Success Banner */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ width: '70px', height: '70px', backgroundColor: '#E8F5E9', color: '#2E7D32' }}
            >
              <i className="bi bi-check2-circle fs-1"></i>
            </div>
            <h1 className="brand-font fs-2 text-dark mb-1">
              Thank You for Your Order!
            </h1>
            <p className="text-muted small">
              Your order has been recorded in the database and is now being prepared for shipment.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4" style={{ border: '1px solid #E5DDCF' }}>
            
            {/* Receipt Header */}
            <div className="card-header bg-light p-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
              <div>
                <span className="badge bg-success mb-1">Order Confirmed</span>
                <h5 className="mb-0 fw-bold text-dark">Order ID: #{order.id}</h5>
              </div>
              <div className="text-sm-end small text-muted">
                <div>Date: {new Date(order.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                <div>Status: <span className="fw-semibold text-primary">{order.order_status || 'Processing'}</span></div>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="card-body p-4">
              
              {/* Customer & Shipping Summary */}
              <div className="row g-3 mb-4 pb-3 border-bottom">
                <div className="col-sm-6">
                  <h6 className="text-uppercase text-muted fw-bold small">Customer Info</h6>
                  <div className="fw-semibold text-dark">{order.customer_name}</div>
                  <div className="small text-muted">{order.customer_email}</div>
                  <div className="small text-muted">{order.customer_phone}</div>
                </div>

                <div className="col-sm-6">
                  <h6 className="text-uppercase text-muted fw-bold small">Delivery Address</h6>
                  <div className="small text-dark">{order.shipping_address}</div>
                  <div className="small text-muted">{order.city}, {order.postal_code}</div>
                  <div className="small text-muted"><strong>Payment:</strong> {order.payment_method || 'Cash on Delivery'}</div>
                </div>
              </div>

              {/* Items Table */}
              <h6 className="text-uppercase text-muted fw-bold small mb-3">Itemized Books</h6>
              <div className="table-responsive mb-4">
                <table className="table align-middle">
                  <thead>
                    <tr className="table-light">
                      <th>Book</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="fw-semibold text-dark">{item.title}</div>
                          {item.author && <div className="text-muted small">by {item.author}</div>}
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end text-muted">${Number(item.unit_price || item.price).toFixed(2)}</td>
                        <td className="text-end fw-semibold text-dark">
                          ${(Number(item.unit_price || item.price) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grand Total Row */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <span className="fs-5 fw-bold text-dark">Grand Total</span>
                <span className="fs-4 fw-bold text-success">${Number(order.total_amount).toFixed(2)}</span>
              </div>

            </div>

            {/* Receipt Footer Actions */}
            <div className="card-footer bg-light p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={handlePrint}>
                <i className="bi bi-printer me-1"></i> Print Receipt
              </button>

              <Link to="/" className="btn btn-haven-primary btn-sm rounded-pill">
                <i className="bi bi-cart me-1"></i> Back to Bookstore
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
