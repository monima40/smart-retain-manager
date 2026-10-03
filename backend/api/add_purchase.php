<?php

require_once "../config/database.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$supplier_id = intval($data["supplier_id"] ?? 0);
$product_id = intval($data["product_id"] ?? 0);
$quantity = intval($data["quantity"] ?? 0);
$purchase_price = floatval($data["purchase_price"] ?? 0);

if (
    $supplier_id <= 0 ||
    $product_id <= 0 ||
    $quantity <= 0 ||
    $purchase_price < 0
) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid purchase data"
    ]);
    exit;
}

$total_amount = $quantity * $purchase_price;

$conn->begin_transaction();

try {

    $stmt = $conn->prepare(
        "INSERT INTO purchases
        (supplier_id, product_id, quantity, purchase_price, total_amount)
        VALUES (?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "iiidd",
        $supplier_id,
        $product_id,
        $quantity,
        $purchase_price,
        $total_amount
    );

    $stmt->execute();

    $stmt->close();

    $stmt = $conn->prepare(
        "UPDATE products
         SET stock_quantity = stock_quantity + ?
         WHERE product_id = ?"
    );

    $stmt->bind_param(
        "ii",
        $quantity,
        $product_id
    );

    $stmt->execute();

    $stmt->close();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Purchase added successfully",
        "total_amount" => $total_amount
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>