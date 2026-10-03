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

$name =
    trim(
        $data["customer_name"] ?? ""
    );

$phone =
    trim(
        $data["phone"] ?? ""
    );


if ($name === "") {

    echo json_encode([
        "success" => false,
        "message" => "Customer name is required"
    ]);

    exit;
}


/* Check existing customer */

$check =
    $conn->prepare(
        "SELECT customer_id
         FROM customers
         WHERE customer_name = ?
         AND phone = ?
         LIMIT 1"
    );


$check->bind_param(
    "ss",
    $name,
    $phone
);


$check->execute();


$result =
    $check->get_result();


if ($result->num_rows > 0) {

    $row =
        $result->fetch_assoc();


    echo json_encode([
        "success" => true,
        "message" => "Customer already exists",
        "customer_id" =>
            $row["customer_id"]
    ]);

    $check->close();
    $conn->close();

    exit;
}


/* Add customer */

$stmt =
    $conn->prepare(
        "INSERT INTO customers
        (
            customer_name,
            phone
        )
        VALUES (?, ?)"
    );


$stmt->bind_param(
    "ss",
    $name,
    $phone
);


if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Customer added successfully",
        "customer_id" =>
            $stmt->insert_id
    ]);

}
else {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);

}


$stmt->close();
$check->close();
$conn->close();

?>