-- ============================================================================
-- Book Haven – Online Bookstore and Management System
-- Database Schema and Sample Data for MySQL / phpMyAdmin (XAMPP)
-- Suitable for 3rd Year Engineering Web Programming Project
-- ============================================================================

-- 1. Create the Database if it does not already exist
CREATE DATABASE IF NOT EXISTS `bookhaven_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `bookhaven_db`;

-- 2. Drop existing tables in reverse dependency order (safe for re-running)
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `admin_users`;

-- ----------------------------------------------------------------------------
-- Table: categories
-- Stores book categories/genres for filtering in Module 1
-- ----------------------------------------------------------------------------
CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table: books
-- Core table for Module 1 (Catalogue) & Module 2 (Inventory Management)
-- ----------------------------------------------------------------------------
CREATE TABLE `books` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `author` VARCHAR(255) NOT NULL,
    `category_id` INT NOT NULL,
    `isbn` VARCHAR(20) DEFAULT NULL,
    `price` DECIMAL(10, 2) NOT NULL CHECK (`price` >= 0),
    `stock` INT NOT NULL DEFAULT 0 CHECK (`stock` >= 0),
    `description` TEXT NULL,
    `cover_image` VARCHAR(500) DEFAULT NULL,
    `rating` DECIMAL(2, 1) DEFAULT 4.5,
    `publisher` VARCHAR(150) DEFAULT 'Book Haven Press',
    `published_year` INT DEFAULT 2023,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_books_category` FOREIGN KEY (`category_id`) 
        REFERENCES `categories` (`id`) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Index for high-performance title & author searches (Module 1 requirement)
CREATE INDEX `idx_books_title` ON `books` (`title`);
CREATE INDEX `idx_books_author` ON `books` (`author`);
CREATE INDEX `idx_books_category` ON `books` (`category_id`);

-- ----------------------------------------------------------------------------
-- Table: orders
-- Stores customer orders for Module 3 (Cart & Order Management)
-- ----------------------------------------------------------------------------
CREATE TABLE `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `customer_name` VARCHAR(150) NOT NULL,
    `customer_email` VARCHAR(150) NOT NULL,
    `customer_phone` VARCHAR(30) NOT NULL,
    `shipping_address` TEXT NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(20) NOT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` VARCHAR(50) DEFAULT 'Cash on Delivery',
    `order_status` ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Processing',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table: order_items
-- Normalized table storing individual line items of an order
-- ----------------------------------------------------------------------------
CREATE TABLE `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `book_id` INT NOT NULL,
    `quantity` INT NOT NULL CHECK (`quantity` > 0),
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) 
        REFERENCES `orders` (`id`) 
        ON DELETE CASCADE,
    CONSTRAINT `fk_order_items_book` FOREIGN KEY (`book_id`) 
        REFERENCES `books` (`id`) 
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table: admin_users (Optional / Reference)
-- ----------------------------------------------------------------------------
CREATE TABLE `admin_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- SEED DATA INSERTION
-- Realistic sample books, categories, and initial order records
-- ============================================================================

-- Insert Categories
INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Fiction & Literature', 'Imaginative storytelling, timeless narratives, and contemporary works of fiction.'),
(2, 'Classic Literature', 'Enduring masterpieces of world literature celebrated across generations.'),
(3, 'Science & Technology', 'Software engineering, artificial intelligence, computing history, and popular science.'),
(4, 'Philosophy & Wisdom', 'Profound insights into ethics, existential thought, logic, and the art of living.'),
(5, 'Self-Help & Productivity', 'Practical guides on personal habits, psychological resilience, and peak focus.'),
(6, 'Mystery & Thriller', 'Suspenseful detective narratives, psychological puzzles, and crime fiction.');

-- Insert Default Admin User (Password: admin123 hashed using bcrypt)
INSERT INTO `admin_users` (`username`, `password_hash`, `full_name`) VALUES
('admin', '$2y$10$eA09.F5b6G/lP1.uR1e58eqQ5d.1oG8R1T9Z8H1y1xR8L2C1.tKma', 'Book Haven Administrator');

-- Insert Sample Books with attractive covers and diverse stock
INSERT INTO `books` (`id`, `title`, `author`, `category_id`, `isbn`, `price`, `stock`, `description`, `cover_image`, `rating`, `publisher`, `published_year`) VALUES
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 2, '978-0743273565', 14.99, 18, 
 'A portrait of the Jazz Age, exploring themes of decadence, idealism, social upheaval, and the elusive American Dream through the mysterious Jay Gatsby.',
 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80', 4.8, 'Scribner', 1925),

(2, 'To Kill a Mockingbird', 'Harper Lee', 2, '978-0061120084', 16.50, 12, 
 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, centered on justice and racial compassion.',
 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', 4.9, 'J.B. Lippincott & Co.', 1960),

(3, 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 3, '978-0132350884', 38.00, 15, 
 'Even bad code can function. But if code is not clean, it can bring a development organization to its knees. A definitive guide for developers.',
 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', 4.7, 'Prentice Hall', 2008),

(4, 'Designing Data-Intensive Applications', 'Martin Kleppmann', 3, '978-1449373320', 44.95, 9, 
 'The big ideas behind reliable, scalable, and maintainable systems. Key architectural principles for distributed software engineers.',
 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', 5.0, "O'Reilly Media", 2017),

(5, 'Atomic Habits', 'James Clear', 5, '978-0735211292', 21.00, 25, 
 'An easy and proven way to build good habits and break bad ones. Practical strategies that teach you exactly how to form good habits that stick.',
 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80', 4.9, 'Avery', 2018),

(6, 'Meditations', 'Marcus Aurelius', 4, '978-0140449334', 12.50, 14, 
 'A series of personal writings by the Roman Emperor Marcus Aurelius, recording his private notes to himself on Stoic philosophy.',
 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80', 4.8, 'Penguin Classics', 2006),

(7, '1984', 'George Orwell', 2, '978-0451524935', 13.99, 20, 
 'A startling and haunting vision of the world, so powerfully realized that its symbols and words like Big Brother remain current in political discourse.',
 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80', 4.7, 'Secker & Warburg', 1949),

(8, 'The Alchemist', 'Paulo Coelho', 1, '978-0062315007', 15.25, 30, 
 'A magical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure as extravagant as any ever found.',
 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', 4.6, 'HarperOne', 1988),

(9, 'Deep Work: Rules for Focused Success in a Distracted World', 'Cal Newport', 5, '978-1455586691', 19.99, 8, 
 'Deep work is the ability to focus without distraction on a cognitively demanding task. Cal Newport lays out concrete rules to master it.',
 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80', 4.7, 'Grand Central Publishing', 2016),

(10, 'The Hound of the Baskervilles', 'Arthur Conan Doyle', 6, '978-0141036885', 11.50, 10, 
 'Sherlock Holmes and Dr. Watson investigate the legend of an ancient hound that haunts the Dartmoor estate of the Baskerville family.',
 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80', 4.6, 'George Newnes', 1902),

(11, 'The Pragmatic Programmer: Your Journey To Mastery', 'David Thomas & Andrew Hunt', 3, '978-0135957059', 42.00, 11, 
 'Filled with practical advice on career development, software design, refactoring, and craftsmanship for professional coders.',
 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80', 4.8, 'Addison-Wesley', 2019),

(12, 'Crime and Punishment', 'Fyodor Dostoevsky', 2, '978-0143058144', 17.00, 5, 
 'A destitute former student in Saint Petersburg formulates a scheme to murder an unscrupulous pawnbroker to liberate himself from poverty.',
 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', 4.7, 'The Russian Messenger', 1866);

-- Insert Sample Orders for Demonstration (Module 3 testing)
INSERT INTO `orders` (`id`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `city`, `postal_code`, `total_amount`, `payment_method`, `order_status`, `created_at`) VALUES
(1001, 'Aditi Sharma', 'aditi.sharma@example.com', '+91 9876543210', 'Flat 402, Green Meadows, 5th Main Road', 'Bengaluru', '560034', 52.99, 'Credit Card', 'Processing', NOW() - INTERVAL 2 DAY),
(1002, 'Rahul Verma', 'rahul.v@example.com', '+91 9123456780', '12B Silver Oak Residency, MG Road', 'Chennai', '600001', 38.00, 'Cash on Delivery', 'Shipped', NOW() - INTERVAL 1 DAY);

-- Insert Sample Order Line Items
INSERT INTO `order_items` (`order_id`, `book_id`, `quantity`, `unit_price`, `subtotal`) VALUES
(1001, 1, 1, 14.99, 14.99),
(1001, 3, 1, 38.00, 38.00),
(1002, 3, 1, 38.00, 38.00);
