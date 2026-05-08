<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
require_once '../config/database.php';
$database = new Database();
$conn = $database->getConnection();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("error" => "Please login"));
    exit();
}
try {
    $usersStmt = $conn->prepare("SELECT COUNT(*) as count FROM users");
    $usersStmt->execute();
    $totalUsers = $usersStmt->fetch()['count'];
    $moviesStmt = $conn->prepare("SELECT COUNT(*) as count FROM movies");
    $moviesStmt->execute();
    $totalMovies = $moviesStmt->fetch()['count'];
    $reviewsStmt = $conn->prepare("SELECT COUNT(*) as count FROM reviews");
    $reviewsStmt->execute();
    $totalReviews = $reviewsStmt->fetch()['count'];
    $viewsStmt = $conn->prepare("SELECT SUM(views) as total FROM movies");
    $viewsStmt->execute();
    $totalViews = $viewsStmt->fetch()['total'] ?? 0;
    $recentUsersStmt = $conn->prepare("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5");
    $recentUsersStmt->execute();
    $recentUsers = $recentUsersStmt->fetchAll();
    $recentMoviesStmt = $conn->prepare("SELECT * FROM movies ORDER BY created_at DESC LIMIT 5");
    $recentMoviesStmt->execute();
    $recentMovies = $recentMoviesStmt->fetchAll();
    echo json_encode(array("success" => true, "stats" => array("total_users" => $totalUsers, "total_movies" => $totalMovies, "total_reviews" => $totalReviews, "total_views" => $totalViews), "recent_users" => $recentUsers, "recent_movies" => $recentMovies));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to get dashboard data: " . $e->getMessage()));
}
?>
