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

$name = trim(
    $data["supplier_name"] ?? ""
);

$phone = trim(
    $data["phone"] ?? ""
);

$email = trim(
    $data["email"] ?? ""
);

$address = trim(
    $data["address"] ?? ""
);

if ($name === "" || $phone === "") {

    echo json_encode([
        "success" => false,
        "message" => "Supplier name and phone are required"
    ]);

    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO suppliers
     (
        supplier_name,
        phone,
        email,
        address
     )
     VALUES (?, ?, ?, ?)"
);

$stmt->bind_param(
    "ssss",
    $name,
    $phone,
    $email,
    $address
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Supplier added successfully",
        "supplier_id" => $stmt->insert_id
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