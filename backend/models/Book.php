<?php
/**
 * Book Model Class
 * Handles all database operations for Books (Module 1 & Module 2)
 * Demonstrates Unit III concepts: OOP, PDO Prepared Statements, Error Handling
 */

class Book {
    private $conn;
    private $table_name = "books";

    // Book Properties
    public $id;
    public $title;
    public $author;
    public $category_id;
    public $category_name;
    public $isbn;
    public $price;
    public $stock;
    public $description;
    public $cover_image;
    public $rating;
    public $publisher;
    public $published_year;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Read all books with optional search (title/author) and category filter
     * Fulfills Module 1 requirements
     */
    public function read($search = "", $categoryId = 0) {
        $query = "SELECT 
                    b.id, b.title, b.author, b.category_id, b.isbn, 
                    b.price, b.stock, b.description, b.cover_image, 
                    b.rating, b.publisher, b.published_year, b.created_at,
                    c.name AS category_name
                  FROM " . $this->table_name . " b
                  LEFT JOIN categories c ON b.category_id = c.id
                  WHERE 1=1";

        $params = [];

        // Filter by category if specified
        if (!empty($categoryId) && intval($categoryId) > 0) {
            $query .= " AND b.category_id = :category_id";
            $params[':category_id'] = intval($categoryId);
        }

        // Search in title or author if query provided
        if (!empty($search)) {
            $query .= " AND (b.title LIKE :search_title OR b.author LIKE :search_author)";
            $params[':search_title'] = "%" . $search . "%";
            $params[':search_author'] = "%" . $search . "%";
        }

        $query .= " ORDER BY b.id DESC";

        $stmt = $this->conn->prepare($query);

        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }

        $stmt->execute();
        return $stmt;
    }

    /**
     * Fetch a single book by ID
     */
    public function readSingle($id) {
        $query = "SELECT 
                    b.id, b.title, b.author, b.category_id, b.isbn, 
                    b.price, b.stock, b.description, b.cover_image, 
                    b.rating, b.publisher, b.published_year, b.created_at,
                    c.name AS category_name
                  FROM " . $this->table_name . " b
                  LEFT JOIN categories c ON b.category_id = c.id
                  WHERE b.id = :id 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create a new book
     * Fulfills Module 2 requirement
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . "
                  (title, author, category_id, isbn, price, stock, description, cover_image, rating, publisher, published_year)
                  VALUES
                  (:title, :author, :category_id, :isbn, :price, :stock, :description, :cover_image, :rating, :publisher, :published_year)";

        $stmt = $this->conn->prepare($query);

        // Sanitize string inputs
        $title = htmlspecialchars(strip_tags($data['title']));
        $author = htmlspecialchars(strip_tags($data['author']));
        $category_id = intval($data['category_id']);
        $isbn = !empty($data['isbn']) ? htmlspecialchars(strip_tags($data['isbn'])) : null;
        $price = floatval($data['price']);
        $stock = intval($data['stock']);
        $description = !empty($data['description']) ? htmlspecialchars(strip_tags($data['description'])) : '';
        $cover_image = !empty($data['cover_image']) ? filter_var($data['cover_image'], FILTER_SANITIZE_URL) : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80';
        $rating = !empty($data['rating']) ? floatval($data['rating']) : 4.5;
        $publisher = !empty($data['publisher']) ? htmlspecialchars(strip_tags($data['publisher'])) : 'Book Haven Press';
        $published_year = !empty($data['published_year']) ? intval($data['published_year']) : intval(date('Y'));

        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':author', $author);
        $stmt->bindParam(':category_id', $category_id, PDO::PARAM_INT);
        $stmt->bindParam(':isbn', $isbn);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':stock', $stock, PDO::PARAM_INT);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':cover_image', $cover_image);
        $stmt->bindParam(':rating', $rating);
        $stmt->bindParam(':publisher', $publisher);
        $stmt->bindParam(':published_year', $published_year, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Update existing book details and price
     * Fulfills Module 2 requirement
     */
    public function update($data) {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    title = :title,
                    author = :author,
                    category_id = :category_id,
                    isbn = :isbn,
                    price = :price,
                    stock = :stock,
                    description = :description,
                    cover_image = :cover_image,
                    rating = :rating,
                    publisher = :publisher,
                    published_year = :published_year
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $id = intval($data['id']);
        $title = htmlspecialchars(strip_tags($data['title']));
        $author = htmlspecialchars(strip_tags($data['author']));
        $category_id = intval($data['category_id']);
        $isbn = !empty($data['isbn']) ? htmlspecialchars(strip_tags($data['isbn'])) : null;
        $price = floatval($data['price']);
        $stock = intval($data['stock']);
        $description = !empty($data['description']) ? htmlspecialchars(strip_tags($data['description'])) : '';
        $cover_image = !empty($data['cover_image']) ? filter_var($data['cover_image'], FILTER_SANITIZE_URL) : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80';
        $rating = !empty($data['rating']) ? floatval($data['rating']) : 4.5;
        $publisher = !empty($data['publisher']) ? htmlspecialchars(strip_tags($data['publisher'])) : 'Book Haven Press';
        $published_year = !empty($data['published_year']) ? intval($data['published_year']) : intval(date('Y'));

        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':author', $author);
        $stmt->bindParam(':category_id', $category_id, PDO::PARAM_INT);
        $stmt->bindParam(':isbn', $isbn);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':stock', $stock, PDO::PARAM_INT);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':cover_image', $cover_image);
        $stmt->bindParam(':rating', $rating);
        $stmt->bindParam(':publisher', $publisher);
        $stmt->bindParam(':published_year', $published_year, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Quick stock quantity update
     * Fulfills Module 2 requirement
     */
    public function updateStock($id, $newStock) {
        $query = "UPDATE " . $this->table_name . " SET stock = :stock WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':stock', $newStock, PDO::PARAM_INT);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Delete book by ID
     * Fulfills Module 2 requirement
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
