-- データベース作成（docker-compose.yml ですでに作成される場合は省略可）
CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;

-- サンプルテーブル
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- サンプルデータ
INSERT INTO users (name, email) VALUES
('山田 太郎', 'yamada@example.com'),
('佐藤 花子', 'sato@example.com');

