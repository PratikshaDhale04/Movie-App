<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
require_once '../config/database.php';
$database = new Database();
$conn = $database->getConnection();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
try {
    $category = isset($_GET['category']) ? $_GET['category'] : 'all';
    $genre = isset($_GET['genre']) ? $_GET['genre'] : null;
    $year = isset($_GET['year']) ? intval($_GET['year']) : null;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'rating';
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    $search = isset($_GET['search']) ? trim($_GET['search']) : null;
    
    $query = "SELECT * FROM movies WHERE 1=1";
    $params = array();
    
    if ($search) {
        $query .= " AND (title LIKE ? OR description LIKE ? OR director LIKE ? OR cast LIKE ?)";
        $searchTerm = "%$search%";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    }
    
    if ($genre && $genre !== 'All') {
        $query .= " AND genre = ?";
        $params[] = $genre;
    }
    
    if ($year) {
        $query .= " AND year = ?";
        $params[] = $year;
    }
    
    switch ($sort) {
        case 'latest': $query .= " ORDER BY created_at DESC"; break;
        case 'popular': $query .= " ORDER BY views DESC"; break;
        default: $query .= " ORDER BY rating DESC";
    }
    
    $query .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $movies = $stmt->fetchAll();
    
    $countQuery = "SELECT COUNT(*) as total FROM movies WHERE 1=1";
    $countParams = array();
    if ($search) {
        $countQuery .= " AND (title LIKE ? OR description LIKE ?)";
        $searchTerm = "%$search%";
        $countParams = [$searchTerm, $searchTerm];
    }
    if ($genre && $genre !== 'All') {
        $countQuery .= " AND genre = ?";
        $countParams[] = $genre;
    }
    if ($year) {
        $countQuery .= " AND year = ?";
        $countParams[] = $year;
    }
    $countStmt = $conn->prepare($countQuery);
    $countStmt->execute($countParams);
    $total = $countStmt->fetch()['total'];
    
    echo json_encode(array("success" => true, "movies" => $movies, "total" => $total));
} catch(PDOException $e) {
    echo json_encode(array("error" => "Failed to fetch movies: " . $e->getMessage()));
}
?>
