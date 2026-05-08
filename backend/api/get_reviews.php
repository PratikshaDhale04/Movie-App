<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
require_once '../config/database.php';
$database = new Database();
$conn = $database->getConnection();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
$movie_id = isset($_GET['movie_id']) ? intval($_GET['movie_id']) : null;
if (!$movie_id) {
    echo json_encode(array("error" => "Movie ID is required"));
    exit();
}
try {
    $stmt = $conn->prepare("SELECT r.*, u.name as user_name, u.profile_image FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.movie_id = ? ORDER BY r.created_at DESC");
    $stmt->execute([$movie_id]);
    $reviews = $stmt->fetchAll();
    echo json_encode(array("success" => true, "reviews" => $reviews));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to fetch reviews: " . $e->getMessage()));
}
?>
