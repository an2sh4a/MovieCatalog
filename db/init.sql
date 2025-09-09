CREATE DATABASE IF NOT EXISTS movies_db;
USE movies_db;

CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  director VARCHAR(255),
  genre VARCHAR(100),
  release_year INT,
  rating DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO movies (title, director, genre, release_year, rating) VALUES
('The Matrix', 'The Wachowskis', 'Sci-Fi', 1999, 8.7),
('Parasite', 'Bong Joon-ho', 'Thriller', 2019, 8.6);
