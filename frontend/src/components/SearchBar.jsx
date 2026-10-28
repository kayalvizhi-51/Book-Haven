import React from 'react';

/**
 * SearchBar Component
 * Fulfills Module 1 (Search books by title or author) & Unit II (Events & Form Controls)
 */
export default function SearchBar({ searchTerm, onSearchChange, onSearchSubmit, onClear }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="search-box-wrapper w-100">
      <i className="bi bi-search search-icon-haven"></i>
      <input
        type="text"
        className="form-control search-input-haven"
        placeholder="Search books by title or author..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <button
          type="button"
          onClick={onClear}
          className="btn btn-sm btn-link position-absolute top-50 end-0 translate-middle-y me-3 text-secondary text-decoration-none"
          title="Clear search"
          aria-label="Clear search"
        >
          <i className="bi bi-x-circle-fill fs-5"></i>
        </button>
      )}
    </form>
  );
}
