-- まずparent_idカラムが存在するか確認
SELECT COUNT(*) INTO @column_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'posts' 
AND COLUMN_NAME = 'parent_id';

-- parent_idカラムが存在しない場合のみ追加
SET @query = IF(@column_exists = 0, 
    'ALTER TABLE posts ADD COLUMN parent_id INT NULL',
    'SELECT "parent_idカラムは既に存在しています" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 外部キー制約が存在するか確認
SELECT COUNT(*) INTO @fk_exists 
FROM information_schema.TABLE_CONSTRAINTS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'posts' 
AND CONSTRAINT_TYPE = 'FOREIGN KEY'
AND CONSTRAINT_NAME LIKE '%parent_id%';

-- 外部キー制約が存在しない場合のみ追加
SET @fk_query = IF(@fk_exists = 0, 
    'ALTER TABLE posts ADD FOREIGN KEY (parent_id) REFERENCES posts(id)',
    'SELECT "外部キー制約は既に存在しています" AS message');
PREPARE fk_stmt FROM @fk_query;
EXECUTE fk_stmt;
DEALLOCATE PREPARE fk_stmt;
