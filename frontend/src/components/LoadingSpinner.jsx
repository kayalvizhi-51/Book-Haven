import React from 'react';

/**
 * LoadingSpinner & State Display Components
 * Fulfills Design requirement: "Add loading, empty, and error states"
 * and Module 1: "Show a user-friendly message when no books match the search"
 */

export function LoadingSpinner({ message = 'Loading books from catalogue...' }) {
  return (
    <div className="text-center py-5 my-4">
      <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-medium">{message}</p>
    </div>
  );
}

export function EmptyState({ 
  icon = "bi-journal-x", 
  title = "No Books Found", 
  description = "We couldn't find any books matching your current search or category filter.", 
  actionText, 
  onAction 
}) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h3 className="h4 brand-font text-dark mb-2">{title}</h3>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '480px' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn btn-haven-primary rounded-pill px-4"
        >
          <i className="bi bi-arrow-clockwise me-1"></i> {actionText}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="alert alert-danger shadow-sm my-4 p-4 text-center rounded-3">
      <i className="bi bi-exclamation-triangle-fill fs-2 d-block mb-2 text-danger"></i>
      <h5 className="alert-heading">Notice: Unable to Load Data</h5>
      <p className="mb-3 small">{message}</p>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger px-4 rounded-pill" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i> Retry Connection
        </button>
      )}
    </div>
  );
}
