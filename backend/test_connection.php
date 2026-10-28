<?php
/**
 * Quick Diagnostic Script for Students and Examiners
 * URL: http://localhost/bookhaven/backend/test_connection.php
 * Verifies PHP version, PDO MySQL driver, and database connectivity.
 */

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/Database.php';

$response = [
    "php_version" => phpversion(),
    "pdo_installed" => extension_loaded('pdo') && extension_loaded('pdo_mysql'),
    "database_status" => "untested",
    "tables_found" => [],
    "sample_books_count" => 0,
    "timestamp" => date('Y-m-d H:i:s')
];

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        $response["database_status"] = "Connected successfully to MySQL!";
        
        // Check tables in bookhaven_db
        $stmt = $db->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $response["tables_found"] = $tables;

        // Check books count
        if (in_array('books', $tables)) {
            $countStmt = $db->query("SELECT COUNT(*) FROM books");
            $response["sample_books_count"] = (int)$countStmt->fetchColumn();
        }
    }
} catch (Exception $e) {
    $response["database_status"] = "Connection Error: " . $e->getMessage();
}

http_response_code(200);
echo json_encode($response, JSON_PRETTY_PRINT);
?>
