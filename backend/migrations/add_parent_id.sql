-- postsテーブルにparent_idカラムが存在するか確認する
SET @column_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'testdb'
    AND TABLE_NAME = 'posts'
    AND COLUMN_NAME = 'parent_id'
);

-- parent_idカラムが存在しない場合は追加する
SET @add_column_sql = IF(@column_exists = 0, 
    'ALTER TABLE posts ADD COLUMN parent_id INT NULL, ADD FOREIGN KEY (parent_id) REFERENCES posts(id)',
    'SELECT "parent_idカラムは既に存在しています" AS message');

PREPARE stmt FROM @add_column_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt; 