<?php
/**
 * Order Model Class
 * Handles customer checkout, order persistence, stock deduction in transactions,
 * and order retrieval for Module 3 (Cart & Order Management)
 */

class Order {
    private $conn;
    private $orders_table = "orders";
    private $items_table = "order_items";
    private $books_table = "books";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create an order with transactional integrity and stock decrement
     * @param array $customerData (customer_name, email, phone, address, city, postal_code, total_amount, payment_method)
     * @param array $items Array of items [{book_id, quantity, price}, ...]
     * @return array Result with order_id and status
     * @throws Exception
     */
    public function create($customerData, $items) {
        // Begin Database Transaction for ACID compliance
        $this->conn->beginTransaction();

        try {
            // 1. Verify stock availability for all items before placing order
            $checkStmt = $this->conn->prepare("SELECT id, title, stock, price FROM " . $this->books_table . " WHERE id = :id FOR UPDATE");
            
            $verifiedItems = [];
            $computedTotal = 0;

            foreach ($items as $item) {
                $bookId = intval($item['book_id']);
                $qty = intval($item['quantity']);

                if ($qty <= 0) {
                    throw new Exception("Invalid quantity for book ID " . $bookId);
                }

                $checkStmt->execute([':id' => $bookId]);
                $book = $checkStmt->fetch(PDO::FETCH_ASSOC);

                if (!$book) {
                    throw new Exception("Book with ID " . $bookId . " does not exist.");
                }

                if ($book['stock'] < $qty) {
                    throw new Exception("Insufficient stock for '" . $book['title'] . "'. Available: " . $book['stock'] . ", requested: " . $qty);
                }

                $unitPrice = floatval($book['price']);
                $subtotal = $unitPrice * $qty;
                $computedTotal += $subtotal;

                $verifiedItems[] = [
                    'book_id' => $bookId,
                    'title' => $book['title'],
                    'quantity' => $qty,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal
                ];
            }

            // 2. Insert into orders table
            $orderQuery = "INSERT INTO " . $this->orders_table . "
                           (customer_name, customer_email, customer_phone, shipping_address, city, postal_code, total_amount, payment_method, order_status)
                           VALUES
                           (:name, :email, :phone, :address, :city, :postal_code, :total_amount, :payment_method, 'Processing')";

            $orderStmt = $this->conn->prepare($orderQuery);
            $orderStmt->execute([
                ':name'           => htmlspecialchars(strip_tags($customerData['customer_name'])),
                ':email'          => filter_var($customerData['customer_email'], FILTER_SANITIZE_EMAIL),
                ':phone'          => htmlspecialchars(strip_tags($customerData['customer_phone'])),
                ':address'        => htmlspecialchars(strip_tags($customerData['shipping_address'])),
                ':city'           => htmlspecialchars(strip_tags($customerData['city'])),
                ':postal_code'    => htmlspecialchars(strip_tags($customerData['postal_code'])),
                ':total_amount'   => $computedTotal,
                ':payment_method' => htmlspecialchars(strip_tags($customerData['payment_method'] ?? 'Cash on Delivery'))
            ]);

            $orderId = $this->conn->lastInsertId();

            // 3. Insert order items & deduct stock
            $itemQuery = "INSERT INTO " . $this->items_table . " (order_id, book_id, quantity, unit_price, subtotal)
                          VALUES (:order_id, :book_id, :quantity, :unit_price, :subtotal)";
            $itemStmt = $this->conn->prepare($itemQuery);

            $stockQuery = "UPDATE " . $this->books_table . " SET stock = stock - :quantity WHERE id = :book_id";
            $stockStmt = $this->conn->prepare($stockQuery);

            foreach ($verifiedItems as $item) {
                // Insert item record
                $itemStmt->execute([
                    ':order_id'   => $orderId,
                    ':book_id'    => $item['book_id'],
                    ':quantity'   => $item['quantity'],
                    ':unit_price' => $item['unit_price'],
                    ':subtotal'   => $item['subtotal']
                ]);

                // Decrement available stock
                $stockStmt->execute([
                    ':quantity' => $item['quantity'],
                    ':book_id'  => $item['book_id']
                ]);
            }

            // Commit the transaction
            $this->conn->commit();

            return [
                'success' => true,
                'order_id' => $orderId,
                'total_amount' => $computedTotal,
                'items_count' => count($verifiedItems)
            ];

        } catch (Exception $e) {
            // Roll back all changes if an error occurs
            $this->conn->rollBack();
            throw $e;
        }
    }

    /**
     * Read all orders with brief summaries
     */
    public function readAll() {
        $query = "SELECT 
                    o.id, o.customer_name, o.customer_email, o.customer_phone,
                    o.city, o.total_amount, o.payment_method, o.order_status, o.created_at,
                    COUNT(oi.id) AS total_items
                  FROM " . $this->orders_table . " o
                  LEFT JOIN " . $this->items_table . " oi ON o.id = oi.order_id
                  GROUP BY o.id
                  ORDER BY o.id DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Read a single order with full itemized breakdown
     */
    public function readSingle($id) {
        $orderQuery = "SELECT * FROM " . $this->orders_table . " WHERE id = :id LIMIT 1";
        $orderStmt = $this->conn->prepare($orderQuery);
        $orderStmt->execute([':id' => $id]);
        $order = $orderStmt->fetch(PDO::FETCH_ASSOC);

        if (!$order) {
            return null;
        }

        $itemsQuery = "SELECT 
                        oi.id, oi.book_id, oi.quantity, oi.unit_price, oi.subtotal,
                        b.title, b.author, b.cover_image
                       FROM " . $this->items_table . " oi
                       LEFT JOIN " . $this->books_table . " b ON oi.book_id = b.id
                       WHERE oi.order_id = :order_id";
        $itemsStmt = $this->conn->prepare($itemsQuery);
        $itemsStmt->execute([':order_id' => $id]);
        $order['items'] = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);

        return $order;
    }
}
?>
