<?php
/**
 * GET: /backend/api/books/read.php
 * Module 1 & 2: Read all books, filter by category, search by title/author, or fetch single book
 * Query Params:
 *   - ?id=123 (fetches single book)
 *   - ?category_id=2 (filters by category)
 *   - ?search=harry (searches title and author)
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Book.php';

$database = new Database();
$db = $database->getConnection();
$book = new Book($db);

// Check if a single book ID is requested
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $id = intval($_GET['id']);
    $bookData = $book->readSingle($id);

    if ($bookData) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "data" => $bookData
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Book not found with ID " . $id
        ]);
    }
    exit;
}

// Otherwise, fetch book list with optional search and category filters
$search = isset($_GET['search']) ? trim($_GET['search']) : "";
$categoryId = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;

$stmt = $book->read($search, $categoryId);
$num = $stmt->rowCount();

$booksArr = [];

if ($num > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Cast numerical columns properly for clean JSON output
        $row['id'] = (int)$row['id'];
        $row['category_id'] = (int)$row['category_id'];
        $row['price'] = (float)$row['price'];
        $row['stock'] = (int)$row['stock'];
        $row['rating'] = (float)$row['rating'];
        $row['published_year'] = (int)$row['published_year'];

        $booksArr[] = $row;
    }
}

http_response_code(200);
echo json_encode([
    "status" => "success",
    "count" => count($booksArr),
    "filters" => [
        "search" => $search,
        "category_id" => $categoryId
    ],
    "data" => $booksArr
]);
?>
