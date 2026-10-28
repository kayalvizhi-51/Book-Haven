import React from 'react';

/**
 * CategoryFilter Component
 * Fulfills Module 1 (Filter books by category) & Unit IV/V (React Props, Event Handling)
 */
export default function CategoryFilter({ categories, selectedCategoryId, onSelectCategory }) {
  return (
    <div className="filter-pills-wrapper">
      {/* "All Categories" Pill */}
      <button
        type="button"
        className={`category-pill-btn ${Number(selectedCategoryId) === 0 ? 'active' : ''}`}
        onClick={() => onSelectCategory(0)}
      >
        <i className="bi bi-collection me-1"></i>
        All Categories
      </button>

      {/* Dynamic Category Pills */}
      {categories && categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`category-pill-btn ${Number(selectedCategoryId) === Number(cat.id) ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.name}
          {cat.book_count !== undefined && (
            <span className="badge bg-secondary bg-opacity-25 text-dark ms-2 rounded-pill small">
              {cat.book_count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
