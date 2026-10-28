/**
 * Book Haven – Frontend API Service
 * Manages communication between React and the PHP REST backend (PDO + MySQL).
 * Includes intelligent fallback to local mock data if XAMPP is offline,
 * ensuring students can demonstrate the project under any examination circumstances.
 */

// Default URL pointing to the XAMPP Apache htdocs directory: http://localhost/bookhaven/backend/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/bookhaven/backend/api';

// Seed demo data for initial fallback / offline evaluation
const INITIAL_DEMO_CATEGORIES = [
  { id: 1, name: 'Fiction & Literature', description: 'Imaginative storytelling and contemporary fiction.', book_count: 2 },
  { id: 2, name: 'Classic Literature', description: 'Enduring masterpieces of world literature.', book_count: 4 },
  { id: 3, name: 'Science & Technology', description: 'Computing, software craftsmanship, and architecture.', book_count: 3 },
  { id: 4, name: 'Philosophy & Wisdom', description: 'Stoic thought, ethics, and the art of living.', book_count: 1 },
  { id: 5, name: 'Self-Help & Productivity', description: 'Personal development and peak focus.', book_count: 2 },
  { id: 6, name: 'Mystery & Thriller', description: 'Suspenseful detective puzzles and classic thrillers.', book_count: 1 }
];

const INITIAL_DEMO_BOOKS = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category_id: 2,
    category_name: 'Classic Literature',
    isbn: '978-0743273565',
    price: 14.99,
    stock: 18,
    description: 'A portrait of the Jazz Age, exploring themes of decadence, idealism, and social upheaval through the mysterious Jay Gatsby.',
    cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    publisher: 'Scribner',
    published_year: 1925
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category_id: 2,
    category_name: 'Classic Literature',
    isbn: '978-0061120084',
    price: 16.50,
    stock: 12,
    description: 'The unforgettable novel of childhood in a sleepy Southern town and the crisis of conscience that rocked it, centered on justice.',
    cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    publisher: 'J.B. Lippincott & Co.',
    published_year: 1960
  },
  {
    id: 3,
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category_id: 3,
    category_name: 'Science & Technology',
    isbn: '978-0132350884',
    price: 38.00,
    stock: 15,
    description: 'Even bad code can function. But if code is not clean, it can bring a development organization to its knees. A definitive guide.',
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    publisher: 'Prentice Hall',
    published_year: 2008
  },
  {
    id: 4,
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category_id: 3,
    category_name: 'Science & Technology',
    isbn: '978-1449373320',
    price: 44.95,
    stock: 9,
    description: 'The big ideas behind reliable, scalable, and maintainable systems. Key architectural principles for distributed software engineers.',
    cover_image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    publisher: "O'Reilly Media",
    published_year: 2017
  },
  {
    id: 5,
    title: 'Atomic Habits',
    author: 'James Clear',
    category_id: 5,
    category_name: 'Self-Help & Productivity',
    isbn: '978-0735211292',
    price: 21.00,
    stock: 25,
    description: 'An easy and proven way to build good habits and break bad ones. Practical strategies for microscopic changes with massive results.',
    cover_image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    publisher: 'Avery',
    published_year: 2018
  },
  {
    id: 6,
    title: 'Meditations',
    author: 'Marcus Aurelius',
    category_id: 4,
    category_name: 'Philosophy & Wisdom',
    isbn: '978-0140449334',
    price: 12.50,
    stock: 14,
    description: 'A series of personal writings by the Roman Emperor Marcus Aurelius, recording his private notes to himself on Stoic philosophy.',
    cover_image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    publisher: 'Penguin Classics',
    published_year: 2006
  },
  {
    id: 7,
    title: '1984',
    author: 'George Orwell',
    category_id: 2,
    category_name: 'Classic Literature',
    isbn: '978-0451524935',
    price: 13.99,
    stock: 20,
    description: 'A startling and haunting vision of the world, so powerfully realized that its symbols and words like Big Brother remain current.',
    cover_image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    publisher: 'Secker & Warburg',
    published_year: 1949
  },
  {
    id: 8,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category_id: 1,
    category_name: 'Fiction & Literature',
    isbn: '978-0062315007',
    price: 15.25,
    stock: 30,
    description: 'A magical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.',
    cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    publisher: 'HarperOne',
    1988: 1988
  },
  {
    id: 9,
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    category_id: 5,
    category_name: 'Self-Help & Productivity',
    isbn: '978-1455586691',
    price: 19.99,
    stock: 8,
    description: 'Deep work is the ability to focus without distraction on a cognitively demanding task. Practical rules to achieve peak output.',
    cover_image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    publisher: 'Grand Central Publishing',
    published_year: 2016
  },
  {
    id: 10,
    title: 'The Hound of the Baskervilles',
    author: 'Arthur Conan Doyle',
    category_id: 6,
    category_name: 'Mystery & Thriller',
    isbn: '978-0141036885',
    price: 11.50,
    stock: 10,
    description: 'Sherlock Holmes and Dr. Watson investigate the legend of an ancient hound that haunts the Dartmoor estate of the Baskervilles.',
    cover_image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    publisher: 'George Newnes',
    published_year: 1902
  },
  {
    id: 11,
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    author: 'David Thomas & Andrew Hunt',
    category_id: 3,
    category_name: 'Science & Technology',
    isbn: '978-0135957059',
    price: 42.00,
    stock: 11,
    description: 'Practical advice on career development, software design, refactoring, code craftsmanship, and modern systems thinking.',
    cover_image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    publisher: 'Addison-Wesley',
    published_year: 2019
  },
  {
    id: 12,
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    category_id: 2,
    category_name: 'Classic Literature',
    isbn: '978-0143058144',
    price: 17.00,
    stock: 5,
    description: 'A destitute former student in Saint Petersburg formulates a scheme to murder an unscrupulous pawnbroker to liberate himself.',
    cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    publisher: 'The Russian Messenger',
    published_year: 1866
  }
];

// Helper: Local Storage Store for Mock Mode
const getStoredBooks = () => {
  const data = localStorage.getItem('haven_mock_books');
  if (!data) {
    localStorage.setItem('haven_mock_books', JSON.stringify(INITIAL_DEMO_BOOKS));
    return INITIAL_DEMO_BOOKS;
  }
  return JSON.parse(data);
};

const setStoredBooks = (books) => {
  localStorage.setItem('haven_mock_books', JSON.stringify(books));
};

const getStoredOrders = () => {
  const data = localStorage.getItem('haven_mock_orders');
  return data ? JSON.parse(data) : [];
};

const setStoredOrders = (orders) => {
  localStorage.setItem('haven_mock_orders', JSON.stringify(orders));
};

export const api = {
  /**
   * Health check to detect whether PHP + MySQL is reachable
   */
  async checkConnection() {
    try {
      const res = await fetch(`http://localhost/bookhaven/backend/test_connection.php`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        return { isLive: true, data };
      }
      return { isLive: false, error: 'Non-200 status' };
    } catch (err) {
      return { isLive: false, error: err.message };
    }
  },

  /**
   * Fetch all categories
   */
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/read.php`);
      if (!res.ok) throw new Error('API server returned error');
      const json = await res.json();
      return { data: json.data, isLive: true };
    } catch {
      // Fallback
      return { data: INITIAL_DEMO_CATEGORIES, isLive: false };
    }
  },

  /**
   * Module 1: Fetch books with search and category filtering
   */
  async getBooks(search = '', categoryId = 0) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryId && Number(categoryId) > 0) params.append('category_id', categoryId);

      const res = await fetch(`${API_BASE_URL}/books/read.php?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch from live backend');
      const json = await res.json();
      return { data: json.data, isLive: true };
    } catch {
      // Fallback filtering in localStorage
      let books = getStoredBooks();
      if (categoryId && Number(categoryId) > 0) {
        books = books.filter(b => Number(b.category_id) === Number(categoryId));
      }
      if (search && search.trim() !== '') {
        const q = search.toLowerCase();
        books = books.filter(b =>
          b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
        );
      }
      return { data: books, isLive: false };
    }
  },

  /**
   * Module 1: Fetch single book details by ID
   */
  async getBookById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/books/read.php?id=${id}`);
      if (!res.ok) throw new Error('Failed to fetch book');
      const json = await res.json();
      return { data: json.data, isLive: true };
    } catch {
      const books = getStoredBooks();
      const found = books.find(b => Number(b.id) === Number(id));
      return { data: found || null, isLive: false };
    }
  },

  /**
   * Module 2: Add new book to inventory
   */
  async createBook(bookData) {
    try {
      const res = await fetch(`${API_BASE_URL}/books/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Creation failed');
      return { success: true, message: json.message, id: json.book_id, isLive: true };
    } catch (err) {
      if (err.message && !err.message.includes('fetch')) {
        throw err; // Real validation error from server
      }
      // Offline fallback: save in localStorage
      const books = getStoredBooks();
      const newId = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
      const catObj = INITIAL_DEMO_CATEGORIES.find(c => Number(c.id) === Number(bookData.category_id));
      const newBook = {
        ...bookData,
        id: newId,
        category_name: catObj ? catObj.name : 'Uncategorized',
        rating: 4.5,
        created_at: new Date().toISOString()
      };
      books.unshift(newBook);
      setStoredBooks(books);
      return { success: true, message: 'Book saved in local storage (Offline demo mode)', id: newId, isLive: false };
    }
  },

  /**
   * Module 2: Edit book details and price
   */
  async updateBook(bookData) {
    try {
      const res = await fetch(`${API_BASE_URL}/books/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Update failed');
      return { success: true, message: json.message, isLive: true };
    } catch (err) {
      if (err.message && !err.message.includes('fetch')) throw err;
      // Offline fallback
      const books = getStoredBooks();
      const idx = books.findIndex(b => Number(b.id) === Number(bookData.id));
      if (idx !== -1) {
        const catObj = INITIAL_DEMO_CATEGORIES.find(c => Number(c.id) === Number(bookData.category_id));
        books[idx] = {
          ...books[idx],
          ...bookData,
          category_name: catObj ? catObj.name : books[idx].category_name
        };
        setStoredBooks(books);
        return { success: true, message: 'Book updated in local storage (Offline demo mode)', isLive: false };
      }
      throw new Error('Book not found to update');
    }
  },

  /**
   * Module 2: Quick stock quantity update
   */
  async updateStock(id, newStock) {
    try {
      const res = await fetch(`${API_BASE_URL}/books/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock: newStock, action: 'update_stock' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Stock update failed');
      return { success: true, message: json.message, isLive: true };
    } catch {
      const books = getStoredBooks();
      const idx = books.findIndex(b => Number(b.id) === Number(id));
      if (idx !== -1) {
        books[idx].stock = Number(newStock);
        setStoredBooks(books);
        return { success: true, message: 'Stock updated locally', isLive: false };
      }
      throw new Error('Book not found');
    }
  },

  /**
   * Module 2: Delete book with confirmation
   */
  async deleteBook(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/books/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Delete failed');
      return { success: true, message: json.message, isLive: true };
    } catch (err) {
      if (err.message && !err.message.includes('fetch')) throw err;
      const books = getStoredBooks();
      const filtered = books.filter(b => Number(b.id) !== Number(id));
      setStoredBooks(filtered);
      return { success: true, message: 'Book deleted locally (Offline demo mode)', isLive: false };
    }
  },

  /**
   * Module 3: Checkout and place order
   */
  async createOrder(orderPayload) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Order failed');
      return {
        success: true,
        order_id: json.order_id,
        total_amount: json.total_amount,
        isLive: true
      };
    } catch (err) {
      if (err.message && !err.message.includes('fetch')) throw err;
      // Deduct stock in mock store and persist order
      const orders = getStoredOrders();
      const newOrderId = 2000 + orders.length + 1;
      const books = getStoredBooks();

      for (const item of orderPayload.items) {
        const b = books.find(x => Number(x.id) === Number(item.book_id));
        if (b) {
          b.stock = Math.max(0, b.stock - item.quantity);
        }
      }
      setStoredBooks(books);

      const newOrder = {
        id: newOrderId,
        customer_name: orderPayload.customer_name,
        customer_email: orderPayload.customer_email,
        customer_phone: orderPayload.customer_phone,
        shipping_address: orderPayload.shipping_address,
        city: orderPayload.city,
        postal_code: orderPayload.postal_code,
        payment_method: orderPayload.payment_method || 'Cash on Delivery',
        total_amount: orderPayload.items.reduce((sum, it) => sum + (it.price * it.quantity), 0),
        order_status: 'Processing',
        created_at: new Date().toISOString(),
        items: orderPayload.items.map((it, idx) => ({
          id: idx + 1,
          book_id: it.book_id,
          title: it.title,
          quantity: it.quantity,
          unit_price: it.price,
          subtotal: it.price * it.quantity,
          cover_image: it.cover_image
        }))
      };

      orders.unshift(newOrder);
      setStoredOrders(orders);

      return {
        success: true,
        order_id: newOrderId,
        total_amount: newOrder.total_amount,
        isLive: false
      };
    }
  },

  /**
   * Module 3: Fetch order details by ID
   */
  async getOrderById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/read.php?id=${id}`);
      if (!res.ok) throw new Error('Order not found');
      const json = await res.json();
      return { data: json.data, isLive: true };
    } catch {
      const orders = getStoredOrders();
      const found = orders.find(o => Number(o.id) === Number(id));
      return { data: found || null, isLive: false };
    }
  },

  /**
   * Module 3: Fetch all orders
   */
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/read.php`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const json = await res.json();
      return { data: json.data, isLive: true };
    } catch {
      return { data: getStoredOrders(), isLive: false };
    }
  }
};
