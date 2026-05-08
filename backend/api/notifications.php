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
try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = isset($data['id']) ? intval($data['id']) : null;
        if ($id) {
            $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $_SESSION['user_id']]);
        } else {
            $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
            $stmt->execute([$_SESSION['user_id']]);
        }
        echo json_encode(array("success" => true, "message" => "Notifications marked as read"));
    } else {
        $stmt = $conn->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20");
        $stmt->execute([$_SESSION['user_id']]);
        $notifications = $stmt->fetchAll();
        $unreadStmt = $conn->prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0");
        $unreadStmt->execute([$_SESSION['user_id']]);
        $unreadCount = $unreadStmt->fetch()['count'];
        echo json_encode(array("success" => true, "notifications" => $notifications, "unread_count" => $unreadCount));
    }
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to get notifications: " . $e->getMessage()));
}
?>
