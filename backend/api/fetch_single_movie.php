<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
require_once '../config/database.php';
$database = new Database();
$conn = $database->getConnection();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
if (!$id) {
    echo json_encode(array("error" => "Movie ID is required"));
    exit();
}
try {
    $stmt = $conn->prepare("SELECT * FROM movies WHERE id = ?");
    $stmt->execute([$id]);
    $movie = $stmt->fetch();
    if (!$movie) {
        echo json_encode(array("error" => "Movie not found"));
        exit();
    }
    $updateViews = $conn->prepare("UPDATE movies SET views = views + 1 WHERE id = ?");
    $updateViews->execute([$id]);
    $similarStmt = $conn->prepare("SELECT * FROM movies WHERE genre = ? AND id != ? ORDER BY rating DESC LIMIT 6");
    $similarStmt->execute([$movie['genre'], $id]);
    $similarMovies = $similarStmt->fetchAll();
    $reviewsStmt = $conn->prepare("SELECT r.*, u.name as user_name, u.profile_image FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.movie_id = ? ORDER BY r.created_at DESC LIMIT 10");
    $reviewsStmt->execute([$id]);
    $reviews = $reviewsStmt->fetchAll();
    $avgRatingStmt = $conn->prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE movie_id = ?");
    $avgRatingStmt->execute([$id]);
    $ratingData = $avgRatingStmt->fetch();
    echo json_encode(array("success" => true, "movie" => $movie, "similar_movies" => $similarMovies, "reviews" => $reviews, "average_rating" => round($ratingData['avg_rating'], 1), "review_count" => $ratingData['count']));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to fetch movie: " . $e->getMessage()));
}
?>
