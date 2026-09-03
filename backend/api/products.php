<?php

require_once "../config/database.php";

header("Content-Type: application/json");

$sql = "SELECT 
            p.product_id,
            p.product_name,
            c.category_name,
            p.purchase_price,
            p.selling_price,
            p.stock_quantity,
            p.low_stock_limit
        FROM products p
        JOIN categories c
        ON p.category_id = c.category_id
        ORDER BY p.product_id DESC";

$result = $conn->query($sql);

if (!$result) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}

$products = [];

while ($row = $result->fetch_assoc()) {

    $products[] = $row;

}

echo json_encode([
    "success" => true,
    "data" => $products
]);

?>