<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
session_start();
session_destroy();
echo json_encode(array("success" => true, "message" => "Logged out successfully"));
?>
