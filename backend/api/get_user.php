<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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
$userId = $_SESSION['user_id'];
try {
    $userStmt = $conn->prepare("SELECT id, name, email, role, profile_image, created_at FROM users WHERE id = ?");
    $userStmt->execute([$userId]);
    $user = $userStmt->fetch();
    $watchlistStmt = $conn->prepare("SELECT COUNT(*) as count FROM watchlist WHERE user_id = ?");
    $watchlistStmt->execute([$userId]);
    $watchlistCount = $watchlistStmt->fetch()['count'];
    $historyStmt = $conn->prepare("SELECT COUNT(*) as count FROM history WHERE user_id = ?");
    $historyStmt->execute([$userId]);
    $historyCount = $historyStmt->fetch()['count'];
    $reviewsStmt = $conn->prepare("SELECT COUNT(*) as count FROM reviews WHERE user_id = ?");
    $reviewsStmt->execute([$userId]);
    $reviewsCount = $reviewsStmt->fetch()['count'];
    echo json_encode(array("success" => true, "user" => $user, "stats" => array("watchlist_count" => $watchlistCount, "history_count" => $historyCount, "reviews_count" => $reviewsCount)));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to get user data: " . $e->getMessage()));
}
?>
