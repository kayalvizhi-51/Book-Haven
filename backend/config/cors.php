<?php
/**
 * Cross-Origin Resource Sharing (CORS) & Response Header Handler
 * Enables the React frontend (running on Vite port 5173 / localhost) 
 * to communicate seamlessly with the PHP backend running on Apache (port 80).
 */

// Allow cross-origin requests from any frontend port in development
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle HTTP preflight OPTIONS requests immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
