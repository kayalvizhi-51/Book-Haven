import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LoadingSpinner, EmptyState, ErrorState } from '../components/LoadingSpinner';

/**
 * AdminDashboard Component
 * Fulfills Module 2: Book and Inventory Management
 * - Provide an admin dashboard
 * - Add new books
 * - View all books in a table
 * - Edit book details and prices
 * - Delete books with a confirmation message
 * - Update available stock
 * - Validate all input fields
 */
export default function AdminDashboard({ onToast }) {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter in admin view
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState(0);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Active book being edited or deleted
  const [currentBook, setCurrentBook] = useState(null);

  // Form State
  const initialFormState = {
    title: '',
    author: '',
    category_id: '',
    isbn: '',
    price: '',
    stock: '',
    description: '',
    cover_image: '',
    publisher: 'Book Haven Press',
    published_year: new Date().getFullYear()
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catsRes, booksRes] = await Promise.all([
        api.getCategories(),
        api.getBooks('', 0)
      ]);
      setCategories(catsRes.data || []);
      setBooks(booksRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  // Form Input Change Handler (Unit II Form handling)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for field on type
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Validate all form input fields (Module 2 requirement)
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.title || formData.title.trim() === '') {
      errors.title = 'Book title is required.';
    } else if (formData.title.trim().length < 2) {
      errors.title = 'Title must be at least 2 characters.';
    }

    if (!formData.author || formData.author.trim() === '') {
      errors.author = 'Author name is required.';
    } else if (formData.author.trim().length < 2) {
      errors.author = 'Author name must be at least 2 characters.';
    }

    if (!formData.category_id || Number(formData.category_id) <= 0) {
      errors.category_id = 'Please select a valid category.';
    }

    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = 'Price must be a positive number greater than 0.';
    }

    if (formData.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0) {
      errors.stock = 'Stock must be an integer 0 or greater.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Add New Book (Module 2)
   */
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category_id: Number(formData.category_id),
        isbn: formData.isbn.trim() || '978-0123456789',
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        description: formData.description.trim(),
        cover_image: formData.cover_image.trim() || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
        publisher: formData.publisher.trim() || 'Book Haven Press',
        published_year: parseInt(formData.published_year, 10) || new Date().getFullYear()
      };

      const res = await api.createBook(payload);
      onToast(res.message || 'Book successfully added to inventory!', 'success');
      setShowAddModal(false);
      setFormData(initialFormState);
      loadDashboardData();
    } catch (err) {
      onToast(err.message || 'Error creating book', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Edit Book Details and Price (Module 2)
   */
  const openEditModal = (book) => {
    setCurrentBook(book);
    setFormData({
      id: book.id,
      title: book.title,
      author: book.author,
      category_id: book.category_id,
      isbn: book.isbn || '',
      price: book.price,
      stock: book.stock,
      description: book.description || '',
      cover_image: book.cover_image || '',
      publisher: book.publisher || 'Book Haven Press',
      published_year: book.published_year || 2023
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        id: currentBook.id,
        title: formData.title.trim(),
        author: formData.author.trim(),
        category_id: Number(formData.category_id),
        isbn: formData.isbn.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        description: formData.description.trim(),
        cover_image: formData.cover_image.trim(),
        publisher: formData.publisher.trim(),
        published_year: parseInt(formData.published_year, 10)
      };

      const res = await api.updateBook(payload);
      onToast(res.message || 'Book details updated successfully!', 'success');
      setShowEditModal(false);
      setCurrentBook(null);
      loadDashboardData();
    } catch (err) {
      onToast(err.message || 'Error updating book', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Quick Stock Adjustment (Module 2: Update available stock)
   */
  const handleQuickStock = async (book, delta) => {
    const newStock = Math.max(0, book.stock + delta);
    try {
      await api.updateStock(book.id, newStock);
      setBooks(prev =>
        prev.map(b => (b.id === book.id ? { ...b, stock: newStock } : b))
      );
      onToast(`Updated "${book.title}" stock to ${newStock}`, 'info');
    } catch (err) {
      onToast(err.message || 'Failed to update stock', 'error');
    }
  };

  /**
   * Delete Book with confirmation modal (Module 2)
   */
  const openDeleteModal = (book) => {
    setCurrentBook(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!currentBook) return;
    setSubmitting(true);
    try {
      const res = await api.deleteBook(currentBook.id);
      onToast(res.message || 'Book removed from inventory', 'success');
      setShowDeleteModal(false);
      setCurrentBook(null);
      loadDashboardData();
    } catch (err) {
      onToast(err.message || 'Cannot delete book', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter books in the admin table
  const filteredBooks = books.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(tableSearch.toLowerCase()) ||
      (b.isbn && b.isbn.toLowerCase().includes(tableSearch.toLowerCase()));
    const matchesCategory =
      tableCategory === 0 || Number(b.category_id) === Number(tableCategory);
    return matchesSearch && matchesCategory;
  });

  // Calculate Key Inventory Metrics
  const totalBooksCount = books.length;
  const totalStockUnits = books.reduce((acc, b) => acc + Number(b.stock || 0), 0);
  const totalValuation = books.reduce((acc, b) => acc + (Number(b.price || 0) * Number(b.stock || 0)), 0);
  const lowStockCount = books.filter(b => Number(b.stock) < 5).length;

  return (
    <div className="container py-4">
      
      {/* Title Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="brand-font fs-2 text-dark mb-1">
            <i className="bi bi-shield-lock-fill text-success me-2"></i>
            Inventory & Book Management
          </h1>
          <p className="text-muted small mb-0">
            Administrative panel to add, edit, monitor stock levels, and organize catalogue records.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-haven-primary rounded-pill shadow-sm"
          onClick={() => {
            setFormData(initialFormState);
            setFormErrors({});
            setShowAddModal(true);
          }}
        >
          <i className="bi bi-plus-circle-fill me-2"></i>
          Add New Book
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-sm-6">
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <i className="bi bi-journal-bookmark-fill"></i>
            </div>
            <div>
              <div className="stat-number">{totalBooksCount}</div>
              <div className="stat-label">Total Titles</div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="stat-card">
            <div className="stat-icon stat-icon-brown">
              <i className="bi bi-boxes"></i>
            </div>
            <div>
              <div className="stat-number">{totalStockUnits}</div>
              <div className="stat-label">Inventory Units</div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="stat-card">
            <div className="stat-icon stat-icon-gold">
              <i className="bi bi-cash-stack"></i>
            </div>
            <div>
              <div className="stat-number">${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="stat-label">Inventory Value</div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#FFEBEE', color: '#D32F2F' }}>
              <i className="bi bi-exclamation-diamond-fill"></i>
            </div>
            <div>
              <div className="stat-number text-danger">{lowStockCount}</div>
              <div className="stat-label">Low Stock Alerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Control Filters */}
      <div className="card border-0 shadow-sm mb-4 rounded-3" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E5DDCF' }}>
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Filter inventory by title, author, or ISBN..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-5">
              <select
                className="form-select"
                value={tableCategory}
                onChange={(e) => setTableCategory(Number(e.target.value))}
              >
                <option value={0}>All Categories ({books.length})</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Inventory Table */}
      {loading ? (
        <LoadingSpinner message="Loading inventory database records..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadDashboardData} />
      ) : (
        <div className="haven-table-card">
          <div className="table-responsive">
            <table className="table haven-table align-middle">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Cover</th>
                  <th>Title & Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th style={{ minWidth: '150px' }}>Available Stock</th>
                  <th>Year</th>
                  <th className="text-end" style={{ minWidth: '130px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-journal-x fs-2 d-block text-warning mb-2"></i>
                      No inventory records match your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((b) => (
                    <tr key={b.id}>
                      {/* Cover Thumbnail */}
                      <td>
                        <img
                          src={b.cover_image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'}
                          alt={b.title}
                          className="rounded"
                          style={{ width: '42px', height: '56px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </td>

                      {/* Title & Author */}
                      <td>
                        <div className="fw-bold text-dark">{b.title}</div>
                        <div className="small text-muted">by {b.author}</div>
                        {b.isbn && <div className="small text-secondary" style={{ fontSize: '0.75rem' }}>ISBN: {b.isbn}</div>}
                      </td>

                      {/* Category */}
                      <td>
                        <span className="badge bg-light text-dark border">
                          {b.category_name || 'General'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="fw-bold text-success">
                        ${Number(b.price).toFixed(2)}
                      </td>

                      {/* Available Stock & Quick Buttons (Module 2) */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary py-0 px-2 rounded"
                            title="Decrease stock by 1"
                            onClick={() => handleQuickStock(b, -1)}
                            disabled={b.stock <= 0}
                          >
                            -
                          </button>
                          <span
                            className={`badge px-2 py-1 rounded-pill ${
                              b.stock === 0 ? 'bg-danger' : b.stock < 5 ? 'bg-warning text-dark' : 'bg-success'
                            }`}
                            style={{ minWidth: '35px' }}
                          >
                            {b.stock}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary py-0 px-2 rounded"
                            title="Increase stock by 1"
                            onClick={() => handleQuickStock(b, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Published Year */}
                      <td className="small text-muted">{b.published_year || 2023}</td>

                      {/* Action Buttons: Edit & Delete (Module 2) */}
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            title="Edit book details and price"
                            onClick={() => openEditModal(b)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            title="Delete book from inventory"
                            onClick={() => openDeleteModal(b)}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          ADD BOOK MODAL (Module 2: Add new books & Validate all input fields)
         ===================================================================== */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 1055 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-light">
                <h5 className="modal-title brand-font text-dark">
                  <i className="bi bi-plus-circle text-success me-2"></i>
                  Add New Book to Inventory
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreateSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    
                    {/* Title */}
                    <div className="col-md-8">
                      <label className="form-label fw-semibold small">Book Title *</label>
                      <input
                        type="text"
                        name="title"
                        className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                        placeholder="e.g. Clean Architecture"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                      {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                    </div>

                    {/* Author */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Author *</label>
                      <input
                        type="text"
                        name="author"
                        className={`form-control ${formErrors.author ? 'is-invalid' : ''}`}
                        placeholder="e.g. Robert C. Martin"
                        value={formData.author}
                        onChange={handleInputChange}
                      />
                      {formErrors.author && <div className="invalid-feedback">{formErrors.author}</div>}
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Category *</label>
                      <select
                        name="category_id"
                        className={`form-select ${formErrors.category_id ? 'is-invalid' : ''}`}
                        value={formData.category_id}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {formErrors.category_id && <div className="invalid-feedback">{formErrors.category_id}</div>}
                    </div>

                    {/* ISBN */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">ISBN</label>
                      <input
                        type="text"
                        name="isbn"
                        className="form-control"
                        placeholder="e.g. 978-0134494166"
                        value={formData.isbn}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Price */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Price ($) *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
                          placeholder="29.99"
                          value={formData.price}
                          onChange={handleInputChange}
                        />
                      </div>
                      {formErrors.price && <div className="text-danger small mt-1">{formErrors.price}</div>}
                    </div>

                    {/* Available Stock */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Available Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        className={`form-control ${formErrors.stock ? 'is-invalid' : ''}`}
                        placeholder="10"
                        value={formData.stock}
                        onChange={handleInputChange}
                      />
                      {formErrors.stock && <div className="invalid-feedback">{formErrors.stock}</div>}
                    </div>

                    {/* Year */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Published Year</label>
                      <input
                        type="number"
                        name="published_year"
                        className="form-control"
                        value={formData.published_year}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Cover Image URL */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Book Cover Image URL</label>
                      <input
                        type="url"
                        name="cover_image"
                        className="form-control"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={formData.cover_image}
                        onChange={handleInputChange}
                      />
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        Leave blank to use a stylish bookstore default cover image.
                      </span>
                    </div>

                    {/* Description / Synopsis */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Description / Synopsis</label>
                      <textarea
                        name="description"
                        rows="3"
                        className="form-control"
                        placeholder="Write a brief overview of the book's topics or plot..."
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-haven-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Add Book to Inventory'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          EDIT BOOK MODAL (Module 2: Edit book details and prices)
         ===================================================================== */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 1055 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-light">
                <h5 className="modal-title brand-font text-dark">
                  <i className="bi bi-pencil-square text-primary me-2"></i>
                  Edit Book Details & Price
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    
                    {/* Title */}
                    <div className="col-md-8">
                      <label className="form-label fw-semibold small">Book Title *</label>
                      <input
                        type="text"
                        name="title"
                        className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                      {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                    </div>

                    {/* Author */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Author *</label>
                      <input
                        type="text"
                        name="author"
                        className={`form-control ${formErrors.author ? 'is-invalid' : ''}`}
                        value={formData.author}
                        onChange={handleInputChange}
                      />
                      {formErrors.author && <div className="invalid-feedback">{formErrors.author}</div>}
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Category *</label>
                      <select
                        name="category_id"
                        className={`form-select ${formErrors.category_id ? 'is-invalid' : ''}`}
                        value={formData.category_id}
                        onChange={handleInputChange}
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {formErrors.category_id && <div className="invalid-feedback">{formErrors.category_id}</div>}
                    </div>

                    {/* ISBN */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">ISBN</label>
                      <input
                        type="text"
                        name="isbn"
                        className="form-control"
                        value={formData.isbn}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Price */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Price ($) *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
                          value={formData.price}
                          onChange={handleInputChange}
                        />
                      </div>
                      {formErrors.price && <div className="text-danger small mt-1">{formErrors.price}</div>}
                    </div>

                    {/* Available Stock */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Available Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        className={`form-control ${formErrors.stock ? 'is-invalid' : ''}`}
                        value={formData.stock}
                        onChange={handleInputChange}
                      />
                      {formErrors.stock && <div className="invalid-feedback">{formErrors.stock}</div>}
                    </div>

                    {/* Published Year */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Published Year</label>
                      <input
                        type="number"
                        name="published_year"
                        className="form-control"
                        value={formData.published_year}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Cover Image URL */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Cover Image URL</label>
                      <input
                        type="url"
                        name="cover_image"
                        className="form-control"
                        value={formData.cover_image}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Description</label>
                      <textarea
                        name="description"
                        rows="3"
                        className="form-control"
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-haven-primary" disabled={submitting}>
                    {submitting ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          DELETE CONFIRMATION MODAL (Module 2: Delete with confirmation message)
         ===================================================================== */}
      {showDeleteModal && currentBook && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fs-5">
                  <i className="bi bi-trash3-fill me-2"></i>
                  Confirm Deletion
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body p-4 text-center">
                <i className="bi bi-exclamation-triangle-fill text-warning fs-1 d-block mb-3"></i>
                <h5 className="mb-2">Are you sure you want to delete this book?</h5>
                <p className="text-muted mb-3">
                  This will permanently remove <strong>"{currentBook.title}"</strong> by {currentBook.author} from the database.
                </p>
                <div className="badge bg-light text-dark p-2 border">
                  Book ID: #{currentBook.id} | Available Stock: {currentBook.stock}
                </div>
              </div>
              <div className="modal-footer bg-light justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 rounded-pill"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-4 rounded-pill"
                  onClick={confirmDelete}
                  disabled={submitting}
                >
                  {submitting ? 'Deleting...' : 'Yes, Delete Book'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
