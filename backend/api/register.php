<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(array("error" => "Name, email and password are required"));
    exit();
}

$name = trim($data['name']);
$email = trim($data['email']);
$password = $data['password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(array("error" => "Invalid email format"));
    exit();
}

if (strlen($password) < 6) {
    echo json_encode(array("error" => "Password must be at least 6 characters"));
    exit();
}

try {
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);
    if ($checkStmt->fetch()) {
        echo json_encode(array("error" => "Email already exists"));
        exit();
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
    $stmt->execute([$name, $email, $hashedPassword]);
    
    $userId = $conn->lastInsertId();
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_role'] = 'user';
    
    echo json_encode(array(
        "success" => true,
        "message" => "Registration successful",
        "user" => array(
            "id" => $userId,
            "name" => $name,
            "email" => $email,
            "role" => 'user'
        )
    ));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Registration failed: " . $e->getMessage()));
}
?>
