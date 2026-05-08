<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'cineverse_pro';
    private $username = 'root';
    private $password = '';
    private $conn;
    private $useSqlite = false;

    public function getConnection() {
        if ($this->conn !== null) return $this->conn;
        $this->conn = $this->tryMysql();
        if ($this->conn === null) {
            $this->conn = $this->trySqlite();
        }
        return $this->conn;
    }

    private function tryMysql() {
        try {
            $conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                )
            );
            return $conn;
        } catch(PDOException $e) {
            return null;
        }
    }

    private function trySqlite() {
        $dbDir = __DIR__ . '/../data';
        if (!is_dir($dbDir)) mkdir($dbDir, 0777, true);
        $dbPath = $dbDir . '/cineverse.db';
        $isNew = !file_exists($dbPath);
        $conn = new PDO("sqlite:" . $dbPath);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $conn->exec("PRAGMA journal_mode=WAL");
        $conn->exec("PRAGMA foreign_keys=ON");
        if ($isNew) {
            $conn->exec("CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                profile_image TEXT DEFAULT 'default.png',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");
            $conn->exec("CREATE TABLE IF NOT EXISTS movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                genre TEXT NOT NULL,
                description TEXT,
                year INTEGER,
                rating REAL DEFAULT 0.0,
                poster TEXT,
                trailer TEXT,
                video_url TEXT,
                duration TEXT,
                director TEXT,
                cast TEXT,
                views INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");
            $conn->exec("CREATE TABLE IF NOT EXISTS watchlist (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                movie_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
                UNIQUE(user_id, movie_id)
            )");
            $conn->exec("CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                movie_id INTEGER NOT NULL,
                rating INTEGER,
                comment TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
            )");
            $conn->exec("CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                movie_id INTEGER NOT NULL,
                watched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
            )");
            $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                is_read INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )");
            $hash = password_hash('password', PASSWORD_BCRYPT);
            $conn->prepare("INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
                ->execute(['Admin', 'admin@cineverse.com', $hash, 'admin']);
            $conn->prepare("INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
                ->execute(['Demo User', 'user@cineverse.com', $hash, 'user']);
        }
        $this->useSqlite = true;
        return $conn;
    }

    public function isSqlite() {
        return $this->useSqlite;
    }
}
?>
