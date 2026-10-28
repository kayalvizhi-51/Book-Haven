<?php
/**
 * Category Model Class
 * Handles category queries, counts, and listings
 */

class Category {
    private $conn;
    private $table_name = "categories";

    public $id;
    public $name;
    public $description;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Read all categories along with the count of active books in each category
     */
    public function read() {
        $query = "SELECT 
                    c.id, c.name, c.description,
                    COUNT(b.id) AS book_count
                  FROM " . $this->table_name . " c
                  LEFT JOIN books b ON c.id = b.category_id
                  GROUP BY c.id, c.name, c.description
                  ORDER BY c.name ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>
