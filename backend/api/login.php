<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(array("error" => "Email and password are required"));
    exit();
}

$email = trim($data['email']);
$password = $data['password'];

try {
    $stmt = $conn->prepare("SELECT id, name, email, password, role, profile_image FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(array("error" => "Invalid email or password"));
        exit();
    }
    
    if (!password_verify($password, $user['password'])) {
        echo json_encode(array("error" => "Invalid email or password"));
        exit();
    }
    
    session_start();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_role'] = $user['role'];
    
    echo json_encode(array(
        "success" => true,
        "message" => "Login successful",
        "user" => array(
            "id" => $user['id'],
            "name" => $user['name'],
            "email" => $user['email'],
            "role" => $user['role'],
            "profile_image" => $user['profile_image']
        )
    ));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Login failed: " . $e->getMessage()));
}
?>
