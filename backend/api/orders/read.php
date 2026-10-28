<?php
/**
 * GET: /backend/api/orders/read.php
 * Module 3: Fetch all orders or a single order by ID with line items
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Order.php';

$database = new Database();
$db = $database->getConnection();
$order = new Order($db);

if (isset($_GET['id']) && !empty($_GET['id'])) {
    $id = intval($_GET['id']);
    $orderData = $order->readSingle($id);

    if ($orderData) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "data" => $orderData
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Order #" . $id . " not found."
        ]);
    }
    exit;
}

// Fetch all orders
$stmt = $order->readAll();
$orders = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $row['id'] = (int)$row['id'];
    $row['total_amount'] = (float)$row['total_amount'];
    $row['total_items'] = (int)$row['total_items'];
    $orders[] = $row;
}

http_response_code(200);
echo json_encode([
    "status" => "success",
    "count" => count($orders),
    "data" => $orders
]);
?>
