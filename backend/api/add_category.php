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
    $data["category_name"] ?? ""
);

if ($name === "") {

    echo json_encode([
        "success" => false,
        "message" => "Category name is required"
    ]);

    exit;
}

$check = $conn->prepare(
    "SELECT category_id
     FROM categories
     WHERE category_name = ?"
);

$check->bind_param(
    "s",
    $name
);

$check->execute();

$result = $check->get_result();

if ($result->num_rows > 0) {

    echo json_encode([
        "success" => false,
        "message" => "Category already exists"
    ]);

    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO categories
     (category_name)
     VALUES (?)"
);

$stmt->bind_param(
    "s",
    $name
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Category added successfully",
        "category_id" => $stmt->insert_id
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);

}

$stmt->close();
$check->close();
$conn->close();

?>