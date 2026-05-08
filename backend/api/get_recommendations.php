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
    echo json_encode(array("error" => "Please login for recommendations"));
    exit();
}
try {
    $userId = $_SESSION['user_id'];
    $genreStmt = $conn->prepare("SELECT m.genre, COUNT(*) as count FROM watchlist w JOIN movies m ON w.movie_id = m.id WHERE w.user_id = ? GROUP BY m.genre ORDER BY count DESC LIMIT 1");
    $genreStmt->execute([$userId]);
    $topGenre = $genreStmt->fetch();
    $watchedStmt = $conn->prepare("SELECT movie_id FROM watchlist WHERE user_id = ? UNION SELECT movie_id FROM history WHERE user_id = ?");
    $watchedStmt->execute([$userId, $userId]);
    $watchedIds = array_column($watchedStmt->fetchAll(), 'movie_id');
    $excludeClause = '';
    $params = array();
    if (!empty($watchedIds)) {
        $placeholders = str_repeat('?,', count($watchedIds) - 1) . '?';
        $excludeClause = "AND id NOT IN ($placeholders)";
        $params = $watchedIds;
    }
    if ($topGenre) {
        $query = "SELECT * FROM movies WHERE genre = ? $excludeClause ORDER BY rating DESC, views DESC LIMIT 10";
        $params = array_merge([$topGenre['genre']], $params);
    } else {
        $query = "SELECT * FROM movies ORDER BY rating DESC, views DESC LIMIT 10";
    }
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $recommendations = $stmt->fetchAll();
    echo json_encode(array("success" => true, "recommendations" => $recommendations, "top_genre" => $topGenre ? $topGenre['genre'] : null));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to get recommendations: " . $e->getMessage()));
}
?>
