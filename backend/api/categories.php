<?php

require_once "../config/database.php";

header("Content-Type: application/json");

$sql = "SELECT
            category_id,
            category_name
        FROM categories
        ORDER BY category_id DESC";

$result = $conn->query($sql);

if (!$result) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}

$categories = [];

while ($row = $result->fetch_assoc()) {

    $categories[] = $row;

}

echo json_encode([
    "success" => true,
    "data" => $categories
]);

?>