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
    $stmt = $conn->prepare("SELECT m.*, h.watched_at FROM history h JOIN movies m ON h.movie_id = m.id WHERE h.user_id = ? ORDER BY h.watched_at DESC");
    $stmt->execute([$_SESSION['user_id']]);
    $history = $stmt->fetchAll();
    echo json_encode(array("success" => true, "history" => $history));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to fetch history: " . $e->getMessage()));
}
?>
