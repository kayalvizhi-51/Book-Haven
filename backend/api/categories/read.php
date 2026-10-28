<?php
/**
 * GET: /backend/api/categories/read.php
 * Module 1 & 2: Fetch all book categories for filtering and dropdowns
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Category.php';

$database = new Database();
$db = $database->getConnection();
$category = new Category($db);

$stmt = $category->read();
$categories = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $row['id'] = (int)$row['id'];
    $row['book_count'] = (int)$row['book_count'];
    $categories[] = $row;
}

http_response_code(200);
echo json_encode([
    "status" => "success",
    "count" => count($categories),
    "data" => $categories
]);
?>
