<?php

require_once "../config/database.php";

header("Content-Type: application/json");

$sql = "SELECT
            p.purchase_id,
            s.supplier_name,
            p.purchase_date,
            p.total_amount
        FROM purchases p
        JOIN suppliers s
        ON p.supplier_id = s.supplier_id
        ORDER BY p.purchase_id DESC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$purchases = [];

while ($row = $result->fetch_assoc()) {
    $purchases[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $purchases
]);
?>