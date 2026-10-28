<?php
/**
 * POST: /backend/api/books/create.php
 * Module 2: Add New Book to Inventory
 * Validates all input fields and inserts into MySQL
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Book.php';

// Accept only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use POST."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();
$book = new Book($db);

// Read JSON input or fallback to $_POST form-data
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

// Input Validation (Module 2 Requirement: "Validate all input fields")
$errors = [];

if (empty($data['title']) || trim($data['title']) === '') {
    $errors[] = "Book title is required.";
} elseif (strlen(trim($data['title'])) < 2) {
    $errors[] = "Book title must be at least 2 characters long.";
}

if (empty($data['author']) || trim($data['author']) === '') {
    $errors[] = "Author name is required.";
} elseif (strlen(trim($data['author'])) < 2) {
    $errors[] = "Author name must be at least 2 characters long.";
}

if (!isset($data['category_id']) || intval($data['category_id']) <= 0) {
    $errors[] = "Please select a valid category.";
}

if (!isset($data['price']) || !is_numeric($data['price']) || floatval($data['price']) <= 0) {
    $errors[] = "Price must be a valid positive number greater than 0.";
}

if (!isset($data['stock']) || !is_numeric($data['stock']) || intval($data['stock']) < 0) {
    $errors[] = "Stock quantity must be a non-negative integer (0 or greater).";
}

// If validation errors exist, return 422 Unprocessable Entity
if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        "status" => "error",
        "message" => "Validation failed. Please correct the highlighted errors.",
        "errors" => $errors
    ]);
    exit;
}

// Proceed with creation
try {
    $newId = $book->create($data);
    if ($newId) {
        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "Book successfully added to catalogue!",
            "book_id" => (int)$newId
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Unable to add book due to a database error."
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
