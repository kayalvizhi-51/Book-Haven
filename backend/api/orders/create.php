<?php
/**
 * POST: /backend/api/orders/create.php
 * Module 3: Checkout and Order Creation
 * Validates shipping details, verifies stock, performs database transaction,
 * decrements book stock, and saves order items.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Order.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use POST."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();
$order = new Order($db);

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON payload."]);
    exit;
}

// 1. Validate customer information
$errors = [];

if (empty($data['customer_name']) || trim($data['customer_name']) === '') {
    $errors[] = "Customer name is required.";
}

if (empty($data['customer_email']) || !filter_var($data['customer_email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = "A valid email address is required.";
}

if (empty($data['customer_phone']) || strlen(trim($data['customer_phone'])) < 7) {
    $errors[] = "A valid contact phone number is required.";
}

if (empty($data['shipping_address']) || trim($data['shipping_address']) === '') {
    $errors[] = "Shipping address is required.";
}

if (empty($data['city']) || trim($data['city']) === '') {
    $errors[] = "City name is required.";
}

if (empty($data['postal_code']) || trim($data['postal_code']) === '') {
    $errors[] = "Postal/ZIP code is required.";
}

// 2. Validate Cart Items
if (empty($data['items']) || !is_array($data['items']) || count($data['items']) === 0) {
    $errors[] = "Your cart is empty. Please add at least one book to place an order.";
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        "status" => "error",
        "message" => "Please correct the form errors.",
        "errors" => $errors
    ]);
    exit;
}

// 3. Process order in transaction
try {
    $result = $order->create($data, $data['items']);
    
    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Order placed successfully!",
        "order_id" => $result['order_id'],
        "total_amount" => $result['total_amount'],
        "items_count" => $result['items_count']
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
