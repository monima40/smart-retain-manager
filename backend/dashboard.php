<?php

require_once "config/database.php";


// ===============================
// TOTAL PRODUCTS
// ===============================

$product_result = $conn->query(
    "SELECT COUNT(*) AS total FROM products"
);

$total_products = $product_result->fetch_assoc()["total"];


// ===============================
// TOTAL CUSTOMERS
// ===============================

$customer_result = $conn->query(
    "SELECT COUNT(*) AS total FROM customers"
);

$total_customers = $customer_result->fetch_assoc()["total"];


// ===============================
// TOTAL SUPPLIERS
// ===============================

$supplier_result = $conn->query(
    "SELECT COUNT(*) AS total FROM suppliers"
);

$total_suppliers = $supplier_result->fetch_assoc()["total"];


// ===============================
// TOTAL STOCK
// ===============================

$stock_result = $conn->query(
    "SELECT COALESCE(SUM(stock_quantity), 0) AS total
     FROM products"
);

$total_stock = $stock_result->fetch_assoc()["total"];


// ===============================
// TOTAL SALES
// ===============================

$sales_result = $conn->query(
    "SELECT COALESCE(SUM(total_amount), 0) AS total
     FROM sales"
);

$total_sales = $sales_result->fetch_assoc()["total"];


// ===============================
// TOTAL PURCHASES
// ===============================

$purchase_result = $conn->query(
    "SELECT COALESCE(SUM(total_amount), 0) AS total
     FROM purchases"
);

$total_purchases = $purchase_result->fetch_assoc()["total"];


// ===============================
// LOW STOCK COUNT
// ===============================

$low_stock_result = $conn->query(
    "SELECT COUNT(*) AS total
     FROM products
     WHERE stock_quantity <= low_stock_limit"
);

$low_stock = $low_stock_result->fetch_assoc()["total"];


// ===============================
// LOW STOCK PRODUCTS
// ===============================

$low_stock_products = $conn->query(
    "SELECT product_name, stock_quantity, low_stock_limit
     FROM products
     WHERE stock_quantity <= low_stock_limit"
);

?>

<!DOCTYPE html>
<html>

<head>

    <title>Smart Retail Dashboard</title>

</head>

<body>

<h1>Smart Retail Manager Dashboard</h1>


<!-- ===============================
     DASHBOARD INFORMATION
     =============================== -->

<h2>Total Products</h2>

<p>
    <?php echo $total_products; ?>
</p>


<h2>Total Customers</h2>

<p>
    <?php echo $total_customers; ?>
</p>


<h2>Total Suppliers</h2>

<p>
    <?php echo $total_suppliers; ?>
</p>


<h2>Total Stock</h2>

<p>
    <?php echo $total_stock; ?>
</p>


<h2>Total Sales</h2>

<p>
    <?php echo $total_sales; ?>
</p>


<h2>Total Purchases</h2>

<p>
    <?php echo $total_purchases; ?>
</p>


<h2>Low Stock Products</h2>

<p>
    Number of low-stock products:
    <?php echo $low_stock; ?>
</p>


<!-- ===============================
     LOW STOCK PRODUCT LIST
     =============================== -->

<?php

if ($low_stock_products->num_rows > 0) {

    while ($row = $low_stock_products->fetch_assoc()) {

        echo "<p>";

        echo $row["product_name"];

        echo " - Stock: ";

        echo $row["stock_quantity"];

        echo " / Limit: ";

        echo $row["low_stock_limit"];

        echo "</p>";
    }

} else {

    echo "<p>No low-stock products.</p>";

}

?>


</body>

</html>