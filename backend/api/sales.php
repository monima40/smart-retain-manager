<?php

require_once "../config/database.php";

header("Content-Type: application/json");

$sql = "SELECT
            s.sale_id,
            c.customer_name,
            c.phone,
            s.sale_date,
            s.subtotal,
            s.discount,
            s.total_amount,
            s.profit
        FROM sales s
        JOIN customers c
        ON s.customer_id = c.customer_id
        ORDER BY s.sale_id DESC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$sales = [];

while ($row = $result->fetch_assoc()) {
    $sales[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $sales
]);
?>