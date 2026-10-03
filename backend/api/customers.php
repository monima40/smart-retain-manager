<?php

require_once "../config/database.php";

header("Content-Type: application/json");

$sql = "SELECT
            customer_id,
            customer_name,
            phone
        FROM customers
        ORDER BY customer_id DESC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$customers = [];

while ($row = $result->fetch_assoc()) {
    $customers[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $customers
]);
?>