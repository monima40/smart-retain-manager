<?php

require_once "../config/database.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "success" => false,
        "message" => "Only POST method is allowed"
    ]);

    exit;
}

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$name = trim($data["product_name"] ?? "");
$category_id = intval($data["category_id"] ?? 0);
$purchase_price = floatval($data["purchase_price"] ?? 0);
$selling_price = floatval($data["selling_price"] ?? 0);
$stock_quantity = intval($data["stock_quantity"] ?? 0);
$low_stock_limit = intval($data["low_stock_limit"] ?? 5);


if ($name === "" || $category_id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Product name and category are required"
    ]);

    exit;
}


if (
    $purchase_price < 0 ||
    $selling_price < 0 ||
    $stock_quantity < 0 ||
    $low_stock_limit < 0
) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid numeric values"
    ]);

    exit;
}


if ($selling_price < $purchase_price) {

    echo json_encode([
        "success" => false,
        "message" => "Selling price cannot be lower than purchase price"
    ]);

    exit;
}


$sql = "INSERT INTO products
        (
            product_name,
            category_id,
            purchase_price,
            selling_price,
            stock_quantity,
            low_stock_limit
        )
        VALUES (?, ?, ?, ?, ?, ?)";


$stmt = $conn->prepare($sql);


if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}


$stmt->bind_param(
    "siddii",
    $name,
    $category_id,
    $purchase_price,
    $selling_price,
    $stock_quantity,
    $low_stock_limit
);


if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Product added successfully",
        "product_id" => $stmt->insert_id
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);

}


$stmt->close();
$conn->close();

?>