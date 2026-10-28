# Book Haven – Online Bookstore and Management System

A modern, responsive full-stack bookstore application developed for a 3rd-year engineering **Web Programming** course. Built using **ReactJS (Vite)**, **Bootstrap 5.3**, custom **CSS3**, **PHP 8 REST APIs (PDO)**, and **MySQL**.

---

## Table of Contents
1. [Project Overview & Key Features](#1-project-overview--key-features)
2. [Syllabus Units Covered (Units I – V)](#2-syllabus-units-covered-units-i--v)
3. [Project Directory Structure](#3-project-directory-structure)
4. [Prerequisites Installation (Windows)](#4-prerequisites-installation-windows)
5. [Step-by-Step Setup Guide](#5-step-by-step-setup-guide)
   - [Step A: Setup Database in XAMPP phpMyAdmin](#step-a-setup-database-in-xampp-phpmyadmin)
   - [Step B: Setup PHP Backend in XAMPP](#step-b-setup-php-backend-in-xampp)
   - [Step C: Setup & Run React Frontend](#step-c-setup--run-react-frontend)
6. [Step-by-Step Module Testing Guide](#6-step-by-step-module-testing-guide)
   - [Testing Module 1: Book Catalogue & Search](#testing-module-1-book-catalogue--search)
   - [Testing Module 2: Book & Inventory Management (Admin)](#testing-module-2-book--inventory-management-admin)
   - [Testing Module 3: Cart & Order Management](#testing-module-3-cart--order-management)
7. [Troubleshooting & FAQs](#7-troubleshooting--faqs)
8. [Supplementary Academic Files](#8-supplementary-academic-files)

---

## 1. Project Overview & Key Features

**Book Haven** combines an elegant literary storefront with an administrative inventory system.

- **Design Palette:** Literary Cream (`#FBF8F2`), Rich Brown (`#2D1E16`, `#4B382A`), and Dark Forest Green (`#1E3F20`).
- **Module 1 (Catalogue & Search):**
  - Displays books with cover images, title, author, category, price, rating, and stock badges.
  - Real-time search by title or author.
  - Filter books by genre/category with live item counts.
  - Interactive book details modal (synopsis, ISBN, publisher, custom quantity selector).
  - User-friendly message and reset button when no books match search.
- **Module 2 (Book & Inventory Management):**
  - Admin dashboard with 4 metric cards: Total Titles, Inventory Units, Total Value, Low Stock Alerts.
  - Full inventory table with cover thumbnails and details.
  - Modal form to add new books with field validation.
  - Edit modal to update book details, price, and description.
  - Delete book with a confirmation modal.
  - Inline `+` / `-` buttons to adjust available stock.
- **Module 3 (Cart & Order Management):**
  - Persistent shopping cart backed by `localStorage`.
  - Modify quantities, calculate subtotals, tax (5%), and free shipping (> $50).
  - Checkout form with validation.
  - Backend database transaction: saves order, inserts items, and decrements book stock.
  - Itemized order confirmation receipt with printable view.

---

## 2. Syllabus Units Covered (Units I – V)

| Unit | Syllabus Requirement | Implementation in Book Haven |
| :--- | :--- | :--- |
| **Unit I** | HTML5, CSS3, page structure, forms, responsive styling, Git | HTML5 semantic tags (`<main>`, `<nav>`, `<footer>`), custom CSS variables, media queries, Git directory layout. |
| **Unit II** | JavaScript, DOM manipulation, events, loops, form validation, dynamic CSS | Interactive event handlers (`onChange`, `onSubmit`, `onClick`), array loops (`map`, `filter`, `reduce`), client-side form validation, dynamic badge styling. |
| **Unit III** | PHP backend, variables, loops, arrays, functions, PDO prepared statements, MySQL, Bootstrap 5.3 | Object-oriented PHP models (`Book`, `Category`, `Order`), PDO prepared statements to block SQL injection, database transactions, Bootstrap 5.3 grid and components. |
| **Unit IV** | ReactJS, JSX, reusable components, component lifecycle, React DevTools | Reusable atomic components (`BookCard`, `SearchBar`, `CategoryFilter`, `BookModal`, `LoadingSpinner`), component tree structure, JSX syntax. |
| **Unit V** | React props, state, data flow, hooks (`useState`, `useEffect`, `useContext`), React Router, deployment | Centralized state via `CartContext`, local state for modals and forms, side-effect data fetching via `useEffect`, client-side routing via React Router v6. |

*For a detailed line-by-line topic breakdown, refer to [SYLLABUS_MAPPING.md](file:///c:/Users/kayalvizhi%20R/Downloads/wb/SYLLABUS_MAPPING.md).*

---

## 3. Project Directory Structure

```
wb/
├── database/
│   └── bookhaven.sql                 # MySQL schema, tables, and sample books
├── backend/
│   ├── config/
│   │   ├── Database.php             # PDO database connection class
│   │   └── cors.php                 # CORS headers and OPTIONS preflight
│   ├── models/
│   │   ├── Book.php                 # Book CRUD operations
│   │   ├── Category.php             # Category queries & book counts
│   │   └── Order.php                # Order creation, items & transactions
│   ├── api/
│   │   ├── books/                   # read.php, create.php, update.php, delete.php
│   │   ├── categories/              # read.php
│   │   └── orders/                  # read.php, create.php
│   └── test_connection.php         # Diagnostic script for PHP + MySQL health
├── frontend/
│   ├── package.json                 # Dependencies (React 18, Vite, Bootstrap 5.3)
│   ├── index.html                   # HTML5 entry with fonts & meta tags
│   ├── vite.config.js               # Vite dev server configuration
│   └── src/
│       ├── index.css                # Cream, brown, dark green stylesheet
│       ├── main.jsx                 # React root mount
│       ├── App.jsx                  # React Router routes & toast state
│       ├── context/
│       │   └── CartContext.jsx      # Global cart state & calculations
│       ├── services/
│       │   └── api.js               # API service with live PHP & fallback mock
│       ├── components/              # Reusable UI components
│       └── pages/                   # Catalogue, Admin, Cart, Confirmation
├── SYLLABUS_MAPPING.md              # Unit I-V syllabus mapping table
├── VIVA_QUESTIONS_AND_ANSWERS.md    # 3rd-year engineering viva prep guide
├── PROJECT_REPORT_OUTLINE.md        # Report structure & screenshots checklist
└── README.md                        # Complete setup documentation
```

---

## 4. Prerequisites Installation (Windows)

To run this project on Windows, install two standard free tools:

### 1. Install Node.js
1. Visit [https://nodejs.org/](https://nodejs.org/) and download the **LTS (Long Term Support)** Windows Installer (e.g. Node v20.x or v18.x).
2. Run the installer and click **Next** through default settings.
3. Verify installation by opening **PowerShell** or **Command Prompt** and running:
   ```cmd
   node -v
   npm -v
   ```

### 2. Install XAMPP
1. Visit [https://www.apachefriends.org/](https://www.apachefriends.org/) and download **XAMPP for Windows** (PHP 8.2 or 8.1).
2. Install XAMPP to the default location: `C:\xampp`.
3. Open **XAMPP Control Panel** from the Windows Start menu.
4. Click the **Start** buttons next to **Apache** and **MySQL**. Both modules will turn green.

---

## 5. Step-by-Step Setup Guide

### Step A: Setup Database in XAMPP phpMyAdmin

1. Open your web browser and go to:  
   `http://localhost/phpmyadmin/`
2. Click on the **Databases** tab at the top.
3. Under **Create database**, type `bookhaven_db` and click **Create**.
4. In the left sidebar, click on your newly created `bookhaven_db`.
5. Click on the **Import** tab in the top navigation bar.
6. Click **Choose File** (or Browse) and select:  
   `c:\Users\kayalvizhi R\Downloads\wb\database\bookhaven.sql`
7. Scroll to the bottom and click the **Import** (or Go) button.
8. You will see a success message: *"Import has been successfully finished, 5 queries executed."* You will now see tables: `books`, `categories`, `orders`, `order_items`, and `admin_users`.

---

### Step B: Setup PHP Backend in XAMPP

Apache serves files located inside the `C:\xampp\htdocs\` folder.

1. Create a folder named `bookhaven` inside `C:\xampp\htdocs\`:
   ```cmd
   C:\xampp\htdocs\bookhaven
   ```
2. Copy the `backend` folder from this project into that directory:
   - Source: `c:\Users\kayalvizhi R\Downloads\wb\backend`
   - Destination: `C:\xampp\htdocs\bookhaven\backend`
3. Verify the backend connection by opening this URL in your web browser:  
   `http://localhost/bookhaven/backend/test_connection.php`
4. You should see a JSON response:
   ```json
   {
     "php_version": "8.2.x",
     "pdo_installed": true,
     "database_status": "Connected successfully to MySQL!",
     "sample_books_count": 12
   }
   ```
   *If you see this, your PHP backend and MySQL database are working.*

---

### Step C: Setup & Run React Frontend

1. Open **PowerShell** or **Command Prompt** on your computer.
2. Navigate to the `frontend` folder:
   ```cmd
   cd "c:\Users\kayalvizhi R\Downloads\wb\frontend"
   ```
3. Install the required Node packages:
   ```cmd
   npm install
   ```
   *(This installs React, ReactDOM, React Router, Vite, Bootstrap 5.3, and Bootstrap Icons).*
4. Start the development server:
   ```cmd
   npm run dev
   ```
5. Open your web browser at:  
   `http://localhost:5173`

> **Note on Standalone / Demo Mode:**  
> The React frontend includes a built-in fallback. If you start `npm run dev` before configuring XAMPP, the application will automatically run in demo mode with sample books and local storage. When XAMPP is active, it seamlessly connects to live MySQL. The status indicator in the top navbar shows whether it is connected to **"MySQL Live"** or **"Demo Mode"**.

---

## 6. Step-by-Step Module Testing Guide

### Testing Module 1: Book Catalogue & Search
1. Open `http://localhost:5173/`.
2. **View Catalogue:** Verify that book cards render with cover images, title, author, genre pill, price, rating stars, and stock status.
3. **Search by Title/Author:** In the search input, type `"Clean"` or `"Martin"`. Notice the grid updates instantly to show *Clean Code*.
4. **Empty State Message:** In the search input, type `"NonExistentTitleXYZ"`. Observe the user-friendly empty state box: *"No Matching Books Found"*. Click **Reset Search & Filters** to restore the full catalogue.
5. **Category Filter:** Click on pills like **"Science & Technology"** or **"Classic Literature"**. The catalogue filters to books within that genre. Click **"All Categories"** to reset.
6. **View Book Details:** Click the eye icon or book title on any card. The Book Details Modal opens, displaying synopsis, ISBN, publisher, publication year, price, and an add-to-cart counter.
7. **Add to Cart:** Click **Add to Cart**. A green toast notification confirms: *"Added 'The Great Gatsby' to your cart!"*. Notice the cart badge counter increments in the navbar.

---

### Testing Module 2: Book & Inventory Management (Admin)
1. In the top navigation bar, click **Inventory Admin** (or navigate to `http://localhost:5173/admin`).
2. **Dashboard Overview:** Check the 4 metric cards (Total Titles, Inventory Units, Inventory Value, Low Stock Alerts).
3. **Inventory Table:** Scroll through the table showing book thumbnails, title, author, category, price, stock, and action buttons.
4. **Add New Book:**
   - Click the green **Add New Book** button.
   - Leave the title blank and click **Add Book to Inventory**. Observe the red validation error: *"Book title is required."*
   - Fill in valid details:
     - Title: `Operating System Concepts`
     - Author: `Abraham Silberschatz`
     - Category: `Science & Technology`
     - Price: `49.99`
     - Available Stock: `15`
   - Click **Add Book to Inventory**. The new book appears in the table.
5. **Quick Stock Adjustment:** Find any book in the table and click the `+` or `-` buttons next to the stock number. Notice the stock updates inline and shows a toast notification.
6. **Edit Book Details & Price:**
   - Click the blue pencil icon on any row.
   - The Edit Modal opens prefilled with the book's information.
   - Change the price to `24.99` and click **Save Changes**. The table reflects the new price.
7. **Delete Book with Confirmation:**
   - Click the red trash icon on any row.
   - A confirmation dialog appears: *"Are you sure you want to delete this book?"*
   - Click **Yes, Delete Book**. The book is removed from the table and database.

---

### Testing Module 3: Cart & Order Management
1. In the top navbar, click the **Cart** button (or navigate to `http://localhost:5173/cart`).
2. **Quantity Update:** Click `+` or `-` to adjust item quantities. Notice the subtotal and grand total update automatically.
3. **Remove Item:** Click the trash icon next to an item to remove it from the cart.
4. **Proceed to Checkout:**
   - Click **Proceed to Checkout**.
   - Fill out the customer delivery form:
     - Full Name: `Ananya Roy`
     - Email: `ananya.roy@example.com`
     - Phone: `+91 9876543210`
     - Shipping Address: `42 Park Avenue, Koramangala`
     - City: `Bengaluru`
     - Postal Code: `560034`
     - Payment Method: `Cash on Delivery`
   - Click **Confirm & Place Order**.
5. **Order Confirmation Receipt:**
   - The application redirects to `/order-confirmation/:id`.
   - The receipt displays the generated Order ID, timestamp, customer information, itemized list of books, subtotals, and total price.
   - Click **Print Receipt** to verify printable layout.
6. **Stock Verification:** Return to the Catalogue or Admin Dashboard. Notice that the available stock for the ordered books has been decremented.

---

## 7. Troubleshooting & FAQs

### Problem 1: "Network Error" or Navbar shows "Demo Mode" instead of "MySQL Live"
- **Cause:** Apache or MySQL is not running in XAMPP, or the `backend` folder is not in `C:\xampp\htdocs\bookhaven\backend`.
- **Solution:**
  1. Open XAMPP Control Panel and verify both **Apache** and **MySQL** are green.
  2. Test `http://localhost/bookhaven/backend/test_connection.php` directly in your browser.
  3. Ensure your MySQL port is `3306` (default). If it is `3307`, update `$port` in `backend/config/Database.php`.

### Problem 2: `npm install` errors or Vite will not start
- **Cause:** Outdated Node.js version.
- **Solution:** Verify `node -v` is v18 or higher. If necessary, download the latest LTS release from [nodejs.org](https://nodejs.org/).

### Problem 3: Table import error in phpMyAdmin
- **Cause:** Database `bookhaven_db` was not selected before importing.
- **Solution:** In phpMyAdmin, click `bookhaven_db` in the left sidebar first, then go to the **Import** tab and select `database/bookhaven.sql`.

---

## 8. Supplementary Academic Files

The project includes documents tailored for 3rd-year engineering evaluations:
- **[SYLLABUS_MAPPING.md](file:///c:/Users/kayalvizhi%20R/Downloads/wb/SYLLABUS_MAPPING.md):** Explicit mapping of Units I through V to code files.
- **[VIVA_QUESTIONS_AND_ANSWERS.md](file:///c:/Users/kayalvizhi%20R/Downloads/wb/VIVA_QUESTIONS_AND_ANSWERS.md):** 12 comprehensive questions and answers covering architecture, PDO, CORS, React Hooks, and transactions.
- **[PROJECT_REPORT_OUTLINE.md](file:///c:/Users/kayalvizhi%20R/Downloads/wb/PROJECT_REPORT_OUTLINE.md):** Project report structure and 15-figure screenshots checklist.
