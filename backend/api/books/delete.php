<?php
/**
 * DELETE/POST: /backend/api/books/delete.php
 * Module 2: Delete Book with Confirmation Message
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Book.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use POST or DELETE."]);
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

$id = isset($data['id']) ? intval($data['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Valid Book ID is required for deletion."]);
    exit;
}

// First, check if book exists
$existing = $book->readSingle($id);
if (!$existing) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Book with ID " . $id . " not found."]);
    exit;
}

try {
    if ($book->delete($id)) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Book '" . $existing['title'] . "' has been successfully removed from inventory.",
            "deleted_id" => $id
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Failed to delete book from database."
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Cannot delete book: it may be linked to existing customer orders. (Error: " . $e->getMessage() . ")"
    ]);
}
?>
