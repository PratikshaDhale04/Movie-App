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
$required = ['title', 'genre', 'description', 'year'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(array("error" => "Field '$field' is required"));
        exit();
    }
}
try {
    $stmt = $conn->prepare("INSERT INTO movies (title, genre, description, year, rating, poster, trailer, video_url, duration, director, cast) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['title'], $data['genre'], $data['description'], intval($data['year']),
        isset($data['rating']) ? floatval($data['rating']) : 0.0,
        $data['poster'] ?? '', $data['trailer'] ?? '', $data['video_url'] ?? '',
        $data['duration'] ?? '', $data['director'] ?? '', $data['cast'] ?? ''
    ]);
    $movieId = $conn->lastInsertId();
    echo json_encode(array("success" => true, "message" => "Movie added successfully", "movie_id" => $movieId));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to add movie: " . $e->getMessage()));
}
?>
