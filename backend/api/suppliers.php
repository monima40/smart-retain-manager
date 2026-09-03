<?php

require_once "../config/database.php";

header("Content-Type: application/json");

$sql = "SELECT
            supplier_id,
            supplier_name,
            phone,
            email,
            address
        FROM suppliers
        ORDER BY supplier_id DESC";

$result = $conn->query($sql);

if (!$result) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}

$suppliers = [];

while ($row = $result->fetch_assoc()) {

    $suppliers[] = $row;

}

echo json_encode([
    "success" => true,
    "data" => $suppliers
]);

?>