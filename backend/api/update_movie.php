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
$fields = ['title', 'genre', 'description', 'year', 'rating', 'poster', 'trailer', 'video_url', 'duration', 'director', 'cast'];
$updates = array();
$params = array();
foreach ($fields as $field) {
    if (isset($data[$field])) {
        $updates[] = "$field = ?";
        $params[] = $data[$field];
    }
}
if (empty($updates)) {
    echo json_encode(array("error" => "No fields to update"));
    exit();
}
$params[] = $id;
$query = "UPDATE movies SET " . implode(", ", $updates) . " WHERE id = ?";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    echo json_encode(array("success" => true, "message" => "Movie updated successfully"));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to update movie: " . $e->getMessage()));
}
?>
