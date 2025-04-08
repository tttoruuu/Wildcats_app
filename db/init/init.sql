-- データベース作成（docker-compose.yml ですでに作成される場合は省略可）
CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    hometown VARCHAR(255),
    hobbies TEXT,
    matchmaking_agency VARCHAR(255),
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);

-- サンプルデータ
INSERT INTO users (username, password_hash, full_name, email, birth_date) VALUES
('yamada', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '山田 太郎', 'yamada@example.com', '1990-01-01'),
('sato', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '佐藤 花子', 'sato@example.com', '1992-05-15');

