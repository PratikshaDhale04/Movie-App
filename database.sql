CREATE DATABASE IF NOT EXISTS cineverse_pro;
USE cineverse_pro;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    profile_image VARCHAR(255) DEFAULT 'default.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    description TEXT,
    year INT,
    rating DECIMAL(3,1) DEFAULT 0.0,
    poster VARCHAR(255),
    trailer VARCHAR(255),
    video_url VARCHAR(500),
    duration VARCHAR(20),
    director VARCHAR(100),
    cast TEXT,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS watchlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_watchlist (user_id, movie_id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@cineverse.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Demo User', 'user@cineverse.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

INSERT INTO movies (title, genre, description, year, rating, poster, trailer, video_url, duration, director, cast, views) VALUES
('Inception', 'Sci-Fi', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 2010, 8.8, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 'https://www.youtube.com/embed/YoHD9XEInc0', '2h 28min', 'Christopher Nolan', 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page', 1500000),
('The Dark Knight', 'Action', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 2008, 9.0, 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', 'https://www.youtube.com/embed/EXeTwQWrcwY', '2h 32min', 'Christopher Nolan', 'Christian Bale, Heath Ledger, Aaron Eckhart', 2000000),
('Interstellar', 'Sci-Fi', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.', 2014, 8.6, 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 'https://www.youtube.com/embed/zSWdZVtXT7E', '2h 49min', 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway, Jessica Chastain', 1800000),
('The Matrix', 'Sci-Fi', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', 1999, 8.7, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', 'https://www.youtube.com/watch?v=vK02NN9lE38', 'https://www.youtube.com/embed/vK02NN9lE38', '2h 16min', 'The Wachowskis', 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss', 2500000),
('Pulp Fiction', 'Crime', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 1994, 8.9, 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400', 'https://www.youtube.com/watch?v=s7EdQ4FDsbg', 'https://www.youtube.com/embed/s7EdQ4FDsbg', '2h 34min', 'Quentin Tarantino', 'John Travolta, Uma Thurman, Samuel L. Jackson', 2200000),
('Forrest Gump', 'Drama', 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.', 1994, 8.8, 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400', 'https://www.youtube.com/watch?v=uPIEn0M8su0', 'https://www.youtube.com/embed/uPIEn0M8su0', '2h 22min', 'Robert Zemeckis', 'Tom Hanks, Robin Wright, Gary Sinise', 3000000),
('The Shawshank Redemption', 'Drama', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1994, 9.3, 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=400', 'https://www.youtube.com/watch?v=6hB3S9bIaco', 'https://www.youtube.com/embed/6hB3S9bIaco', '2h 22min', 'Frank Darabont', 'Tim Robbins, Morgan Freeman, Bob Gunton', 3500000),
('Gladiator', 'Action', 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.', 2000, 8.5, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400', 'https://www.youtube.com/watch?v=0BLZbrFDBBw', 'https://www.youtube.com/embed/0BLZbrFDBBw', '2h 35min', 'Ridley Scott', 'Russell Crowe, Joaquin Phoenix, Connie Nielsen', 1700000),
('The Godfather', 'Crime', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 9.2, 'https://images.unsplash.com/photo-1485846147225-9f0a57f4f8b0?w=400', 'https://www.youtube.com/watch?v=sY1S34973zA', 'https://www.youtube.com/embed/sY1S34973zA', '2h 55min', 'Francis Ford Coppola', 'Marlon Brando, Al Pacino, James Caan', 2800000),
('Avatar', 'Sci-Fi', 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.', 2009, 7.9, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'https://www.youtube.com/watch?v=5PSNL1qE6VY', 'https://www.youtube.com/embed/5PSNL1qE6VY', '2h 42min', 'James Cameron', 'Sam Worthington, Zoe Saldana, Sigourney Weaver', 4000000),
('Avengers: Endgame', 'Action', 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.', 2019, 8.4, 'https://images.unsplash.com/photo-1624213111452-35e8d3d5cc18?w=400', 'https://www.youtube.com/watch?v=TcMBFSGVi1c', 'https://www.youtube.com/embed/TcMBFSGVi1c', '3h 01min', 'Anthony Russo', 'Robert Downey Jr., Chris Evans, Mark Ruffalo', 5000000),
('Joker', 'Drama', 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.', 2019, 8.4, 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400', 'https://www.youtube.com/watch?v=zAGVQLHvwOY', 'https://www.youtube.com/embed/zAGVQLHvwOY', '2h 02min', 'Todd Phillips', 'Joaquin Phoenix, Robert De Niro, Zazie Beetz', 3200000),
('Spider-Man: No Way Home', 'Action', 'With Spider-Man identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, 
