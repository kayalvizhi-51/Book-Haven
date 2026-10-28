<?php
/**
 * PUT/POST: /backend/api/books/update.php
 * Module 2: Edit Book Details, Price, and Stock
 * Validates inputs and updates the MySQL database
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Book.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use POST or PUT."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();
$book = new Book($db);

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

// Check for Book ID
if (empty($data['id']) || intval($data['id']) <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Valid Book ID is required for update."]);
    exit;
}

// If this is a quick stock update request
if (isset($data['action']) && $data['action'] === 'update_stock') {
    if (!isset($data['stock']) || !is_numeric($data['stock']) || intval($data['stock']) < 0) {
        http_response_code(422);
        echo json_encode(["status" => "error", "message" => "Stock must be a non-negative integer."]);
        exit;
    }

    if ($book->updateStock(intval($data['id']), intval($data['stock']))) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Stock quantity updated successfully!"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to update stock quantity."]);
    }
    exit;
}

// Standard full edit validation
$errors = [];

if (empty($data['title']) || trim($data['title']) === '') {
    $errors[] = "Book title cannot be blank.";
}

if (empty($data['author']) || trim($data['author']) === '') {
    $errors[] = "Author name cannot be blank.";
}

if (!isset($data['category_id']) || intval($data['category_id']) <= 0) {
    $errors[] = "Please select a valid category.";
}

if (!isset($data['price']) || !is_numeric($data['price']) || floatval($data['price']) <= 0) {
    $errors[] = "Price must be a valid positive number.";
}

if (!isset($data['stock']) || !is_numeric($data['stock']) || intval($data['stock']) < 0) {
    $errors[] = "Stock must be a non-negative number.";
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        "status" => "error",
        "message" => "Validation failed. Please correct the highlighted errors.",
        "errors" => $errors
    ]);
    exit;
}

try {
    if ($book->update($data)) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Book details updated successfully!"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Failed to update book details in database."
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>
