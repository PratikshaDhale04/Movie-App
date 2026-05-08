<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
require_once '../config/database.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
$database = new Database();
$conn = $database->getConnection();
$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? intval($data['id']) : null;
if (!$id) {
    echo json_encode(array("error" => "Movie ID is required"));
    exit();
}
try {
    $stmt = $conn->prepare("DELETE FROM movies WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(array("success" => true, "message" => "Movie deleted successfully"));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to delete movie: " . $e->getMessage()));
}
?>
