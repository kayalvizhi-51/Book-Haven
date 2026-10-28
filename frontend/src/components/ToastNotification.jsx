import React, { useEffect } from 'react';

/**
 * ToastNotification Component
 * Provides instant visual feedback for user actions (cart additions, updates, errors)
 */
export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgClasses = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    warning: 'bg-warning text-dark',
    info: 'bg-info text-white'
  };

  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-exclamation-octagon-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill'
  };

  const type = toast.type || 'info';

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1090 }}
    >
      <div
        className={`toast show align-items-center ${bgClasses[type] || bgClasses.info} border-0 shadow-lg`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ borderRadius: '12px', minWidth: '280px' }}
      >
        <div className="d-flex p-2">
          <div className="toast-body d-flex align-items-center gap-2 fw-medium">
            <i className={`bi ${icons[type]} fs-5`}></i>
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
}
