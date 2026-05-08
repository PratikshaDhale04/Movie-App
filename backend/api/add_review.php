<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
require_once '../config/database.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("error" => "Please login to add a review"));
    exit();
}
$database = new Database();
$conn = $database->getConnection();
$data = json_decode(file_get_contents("php://input"), true);
$movie_id = isset($data['movie_id']) ? intval($data['movie_id']) : null;
$rating = isset($data['rating']) ? intval($data['rating']) : null;
$comment = isset($data['comment']) ? trim($data['comment']) : '';
if (!$movie_id || !$rating) {
    echo json_encode(array("error" => "Movie ID and rating are required"));
    exit();
}
if ($rating < 1 || $rating > 5) {
    echo json_encode(array("error" => "Rating must be between 1 and 5"));
    exit();
}
try {
    $checkStmt = $conn->prepare("SELECT id FROM reviews WHERE user_id = ? AND movie_id = ?");
    $checkStmt->execute([$_SESSION['user_id'], $movie_id]);
    if ($checkStmt->fetch()) {
        $updateStmt = $conn->prepare("UPDATE reviews SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP WHERE user_id = ? AND movie_id = ?");
        $updateStmt->execute([$rating, $comment, $_SESSION['user_id'], $movie_id]);
        echo json_encode(array("success" => true, "message" => "Review updated successfully"));
    } else {
        $stmt = $conn->prepare("INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES (?, ?, ?, ?)");
        $stmt->execute([$_SESSION['user_id'], $movie_id, $rating, $comment]);
        echo json_encode(array("success" => true, "message" => "Review added successfully"));
    }
    $avgStmt = $conn->prepare("SELECT AVG(rating) as avg_rating FROM reviews WHERE movie_id = ?");
    $avgStmt->execute([$movie_id]);
    $avgRating = $avgStmt->fetch()['avg_rating'];
    $updateMovieRating = $conn->prepare("UPDATE movies SET rating = ? WHERE id = ?");
    $updateMovieRating->execute([round($avgRating, 1), $movie_id]);
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to add review: " . $e->getMessage()));
}
?>
