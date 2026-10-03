<?php

require_once "../config/database.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$customer_id = intval($data["customer_id"] ?? 0);
$product_id = intval($data["product_id"] ?? 0);
$quantity = intval($data["quantity"] ?? 0);
$discount = floatval($data["discount"] ?? 0);
$payment_method = $data["payment_method"] ?? "Cash";

if (
    $customer_id <= 0 ||
    $product_id <= 0 ||
    $quantity <= 0
) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid sale data"
    ]);
    exit;
}

$stmt = $conn->prepare(
    "SELECT selling_price, purchase_price, stock_quantity
     FROM products
     WHERE product_id = ?"
);

$stmt->bind_param("i", $product_id);
$stmt->execute();

$result = $stmt->get_result();
$product = $result->fetch_assoc();

$stmt->close();

if (!$product) {

    echo json_encode([
        "success" => false,
        "message" => "Product not found"
    ]);

    exit;
}

if ($quantity > $product["stock_quantity"]) {

    echo json_encode([
        "success" => false,
        "message" => "Insufficient stock"
    ]);

    exit;
}

$selling_price = floatval($product["selling_price"]);
$purchase_price = floatval($product["purchase_price"]);

$subtotal = $selling_price * $quantity;

if ($discount < 0 || $discount > $subtotal) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid discount"
    ]);

    exit;
}

$total_amount = $subtotal - $discount;

$profit =
    (($selling_price - $purchase_price) * $quantity)
    - $discount;

$conn->begin_transaction();

try {

    $stmt = $conn->prepare(
        "INSERT INTO sales
        (
            customer_id,
            product_id,
            quantity,
            subtotal,
            discount,
            total_amount,
            profit,
            payment_method
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "iiidddds",
        $customer_id,
        $product_id,
        $quantity,
        $subtotal,
        $discount,
        $total_amount,
        $profit,
        $payment_method
    );

    $stmt->execute();

    $stmt->close();

    $stmt = $conn->prepare(
        "UPDATE products
         SET stock_quantity = stock_quantity - ?
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
        "message" => "Sale added successfully",
        "total_amount" => $total_amount,
        "profit" => $profit
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>