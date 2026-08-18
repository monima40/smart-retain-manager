<!DOCTYPE html>
<html>

<head>

    <title>Smart Retail Manager - Backend</title>

    <style>

        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background: #f5f6fa;
        }

        h1 {
            margin-bottom: 30px;
        }

        .menu {
            display: grid;
            grid-template-columns: repeat(2, 250px);
            gap: 20px;
        }

        a {
            display: block;
            padding: 25px;
            background: white;
            border-radius: 10px;
            text-decoration: none;
            color: #222;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        a:hover {
            background: #eeeeee;
        }

        .title {
            font-size: 20px;
            font-weight: bold;
        }

        .description {
            margin-top: 8px;
            color: #666;
        }

    </style>

</head>

<body>

<h1>Smart Retail Manager</h1>

<div class="menu">

    <a href="dashboard.php">

        <div class="title">
            Dashboard
        </div>

        <div class="description">
            View business statistics
        </div>

    </a>


    <a href="admin_test.php">

        <div class="title">
            Products
        </div>

        <div class="description">
            Add products
        </div>

    </a>


    <a href="purchase_test.php">

        <div class="title">
            Purchases
        </div>

        <div class="description">
            Purchase products and increase stock
        </div>

    </a>


    <a href="sale_test.php">

        <div class="title">
            Sales
        </div>

        <div class="description">
            Sell products and decrease stock
        </div>

    </a>

</div>

</body>

</html>