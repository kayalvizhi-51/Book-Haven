import React, { useState, useEffect, useRef } from 'react';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import { LoadingSpinner, EmptyState, ErrorState } from '../components/LoadingSpinner';
import { api } from '../services/api';

/**
 * CataloguePage Component
 * Fulfills Module 1: Book Catalogue and Search
 * - Display books with cover images, title, author, category, price, and available stock
 * - Search books by title or author
 * - Filter books by category
 * - Add books to shopping cart
 * - Display book details in modal
 * - User-friendly message when no books match the search
 */
export default function CataloguePage({ onToast }) {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  const catalogueRef = useRef(null);

  // Load categories and initial books on mount (Unit V useEffect)
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch books whenever search or category changes
  useEffect(() => {
    fetchBooksList(searchTerm, selectedCategoryId);
  }, [selectedCategoryId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [catsRes, booksRes] = await Promise.all([
        api.getCategories(),
        api.getBooks('', 0)
      ]);
      setCategories(catsRes.data || []);
      setBooks(booksRes.data || []);
      setIsLiveBackend(booksRes.isLive);
    } catch (err) {
      setError(err.message || 'Unable to connect to bookstore service.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksList = async (search, categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getBooks(search, categoryId);
      setBooks(res.data || []);
      setIsLiveBackend(res.isLive);
    } catch (err) {
      setError(err.message || 'Error filtering catalogue.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    fetchBooksList(searchTerm, selectedCategoryId);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    // Instant search with debounce feel
    fetchBooksList(term, selectedCategoryId);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchBooksList('', selectedCategoryId);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const scrollToCatalogue = () => {
    if (catalogueRef.current) {
      catalogueRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="catalogue-wrapper">
      {/* Hero Welcome Banner */}
      <HeroSection onExploreClick={scrollToCatalogue} />

      {/* Main Catalogue Container */}
      <div className="container py-5" ref={catalogueRef}>
        
        {/* Header & Search Bar Row */}
        <div className="row align-items-center g-3 mb-4">
          <div className="col-lg-6">
            <h2 className="mb-1 text-dark fw-bold">
              Explore Our Collection
            </h2>
            <p className="text-muted small mb-0">
              Browse through authentic literature, technical classics, and bestselling titles.
              {!isLiveBackend && (
                <span className="ms-2 badge bg-warning text-dark fw-normal">
                  <i className="bi bi-info-circle me-1"></i> Running with sample demo books
                </span>
              )}
            </p>
          </div>

          <div className="col-lg-6">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              onClear={handleClearSearch}
            />
          </div>
        </div>

        {/* Category Pills (Module 1: Filter books by category) */}
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleCategorySelect}
        />

        {/* Content Area: Loading / Error / Empty / Grid */}
        {loading ? (
          <LoadingSpinner message="Searching Book Haven catalogue..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchBooksList(searchTerm, selectedCategoryId)} />
        ) : books.length === 0 ? (
          /* Module 1: Show a user-friendly message when no books match the search */
          <EmptyState
            icon="bi-search"
            title="No Matching Books Found"
            description={`We couldn't find any books matching "${searchTerm || 'your selected filters'}". Try searching with different keywords, authors, or selecting "All Categories".`}
            actionText="Reset Search & Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedCategoryId(0);
              fetchBooksList('', 0);
            }}
          />
        ) : (
          <div>
            {/* Results Count Meta */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="small text-muted">
                Showing <strong>{books.length}</strong> {books.length === 1 ? 'book' : 'books'}
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            </div>

            {/* Book Cards Grid (Module 1) */}
            <div className="row g-4">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onViewDetails={(b) => setSelectedBook(b)}
                  onToast={onToast}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Book Details Modal (Module 1: Display book details) */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onToast={onToast}
        />
      )}
    </div>
  );
}
