<?php
/**
 * Book Haven – Online Bookstore and Management System
 * Database Connection Class using PDO (PHP Data Objects)
 * Compatible with XAMPP (Apache + MySQL) on Windows
 */

class Database {
    // Default XAMPP MySQL configuration
    private $host = "localhost";
    private $db_name = "bookhaven_db";
    private $username = "root";
    private $password = "";
    private $port = "3306";
    private $conn = null;

    /**
     * Establishes a secure PDO connection with error handling and UTF-8 charset
     * @return PDO|null
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on SQL errors
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Return arrays indexed by column name
                PDO::ATTR_EMULATE_PREPARES   => false,                  // Use genuine prepared statements
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            // Return a structured JSON response if connection fails
            http_response_code(500);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode([
                "status" => "error",
                "message" => "Database Connection Failed: " . $e->getMessage(),
                "hint" => "Ensure MySQL service is started in XAMPP Control Panel and database 'bookhaven_db' is imported."
            ]);
            exit;
        }

        return $this->conn;
    }
}
?>
