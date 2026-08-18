<?php

require_once "config/database.php";

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $product_name = $_POST["product_name"];
    $category_id = $_POST["category_id"];
    $purchase_price = $_POST["purchase_price"];
    $selling_price = $_POST["selling_price"];
    $stock_quantity = $_POST["stock_quantity"];

    $sql = "INSERT INTO products
            (product_name, category_id, purchase_price,
             selling_price, stock_quantity, low_stock_limit)
            VALUES (?, ?, ?, ?, ?, 5)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "siddd",
        $product_name,
        $category_id,
        $purchase_price,
        $selling_price,
        $stock_quantity
    );

    if ($stmt->execute()) {
        $message = "Product added successfully!";
    } else {
        $message = "Error: " . $stmt->error;
    }
}

?>

<!DOCTYPE html>
<html>

<head>
    <title>Smart Retail - Backend Test</title>
</head>

<body>

<h1>Smart Retail Manager</h1>

<h2>Add Product</h2>

<p><?php echo $message; ?></p>

<form method="POST">

    <label>Product Name:</label><br>
    <input type="text" name="product_name" required><br><br>

    <label>Category ID:</label><br>
    <input type="number" name="category_id" required><br><br>

    <label>Purchase Price:</label><br>
    <input type="number" name="purchase_price" step="0.01" required><br><br>

    <label>Selling Price:</label><br>
    <input type="number" name="selling_price" step="0.01" required><br><br>

    <label>Stock:</label><br>
    <input type="number" name="stock_quantity" required><br><br>

    <button type="submit">Add Product</button>

</form>

</body>

</html>