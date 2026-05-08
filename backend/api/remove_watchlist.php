<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
require_once '../config/database.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("error" => "Please login"));
    exit();
}
$database = new Database();
$conn = $database->getConnection();
$data = json_decode(file_get_contents("php://input"), true);
$movie_id = isset($data['movie_id']) ? intval($data['movie_id']) : null;
if (!$movie_id) {
    echo json_encode(array("error" => "Movie ID is required"));
    exit();
}
try {
    $stmt = $conn->prepare("DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?");
    $stmt->execute([$_SESSION['user_id'], $movie_id]);
    echo json_encode(array("success" => true, "message" => "Removed from watchlist"));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to remove from watchlist: " . $e->getMessage()));
}
?>
