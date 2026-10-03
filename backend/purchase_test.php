<?php

require_once "config/database.php";

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $product_id = $_POST["product_id"];
    $quantity = $_POST["quantity"];

    // Get current stock
    $sql = "SELECT stock_quantity FROM products WHERE product_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {

        $message = "Product not found!";

    } else {

        $product = $result->fetch_assoc();

        $old_stock = $product["stock_quantity"];

        // Increase stock
        $new_stock = $old_stock + $quantity;

        $update = "UPDATE products
                   SET stock_quantity = ?
                   WHERE product_id = ?";

        $stmt2 = $conn->prepare($update);

        $stmt2->bind_param(
            "ii",
            $new_stock,
            $product_id
        );

        if ($stmt2->execute()) {

            $message =
                "Purchase successful! Stock changed from "
                . $old_stock
                . " to "
                . $new_stock;

        } else {

            $message = "Error: " . $stmt2->error;
        }
    }
}

?>

<!DOCTYPE html>
<html>

<head>

    <title>Purchase</title>

</head>

<body>

<h1>Smart Retail Manager</h1>

<h2>Purchase Product</h2>

<p><?php echo $message; ?></p>

<form method="POST">

    <label>Product ID:</label><br>

    <input
        type="number"
        name="product_id"
        required
    >

    <br><br>

    <label>Quantity:</label><br>

    <input
        type="number"
        name="quantity"
        min="1"
        required
    >

    <br><br>

    <button type="submit">
        Purchase
    </button>

</form>

</body>

</html>