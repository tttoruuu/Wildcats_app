#!/bin/bash

set -e
set -o pipefail

# 変数定義
RG="wildcats-resource-group"
MYSQL_SERVER_NAME="wildcats-mysql-server"
MYSQL_DB_NAME="testdb"
MYSQL_ADMIN="dbadmin"
MYSQL_PASSWORD="Password123!"
LOGFILE="deploy-db-migration-log-$(date +%Y%m%d-%H%M).log"

echo "🔄 データベースマイグレーションを開始します..." | tee $LOGFILE

# 作業ディレクトリのパスを取得
WORK_DIR=$(pwd)
CERT_FILE="${WORK_DIR}/DigiCertGlobalRootCA.crt.pem"

# SSL証明書の存在確認
if [ ! -f "$CERT_FILE" ]; then
  echo "SSL証明書をダウンロード中..." | tee -a $LOGFILE
  curl -o "$CERT_FILE" https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem
fi

echo "SSL証明書パス: $CERT_FILE" | tee -a $LOGFILE

# マイグレーションスクリプトの作成
MIGRATION_SQL="${WORK_DIR}/backend/migrations/add_parent_id_migration.sql"
mkdir -p backend/migrations

echo "📝 マイグレーションSQLファイルを作成: $MIGRATION_SQL" | tee -a $LOGFILE

cat > $MIGRATION_SQL << 'EOL'
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
EOL

# マイグレーションスクリプトをAzure MySQLに適用
echo "⚙️ マイグレーションスクリプトを実行中..." | tee -a $LOGFILE

# 一時的なDocker MySQLコンテナを使用してマイグレーション実行
echo "Docker MySQLクライアントを使用してマイグレーションを実行します" | tee -a $LOGFILE

# Docker が利用可能か確認
if ! command -v docker &> /dev/null; then
  echo "❌ Dockerがインストールされていないか、パスに含まれていません" | tee -a $LOGFILE
  exit 1
fi

# SQLファイルとcert.pemをマウント可能な位置にコピー
mkdir -p "${WORK_DIR}/backend/migrations/tmp"
cp "$MIGRATION_SQL" "${WORK_DIR}/backend/migrations/tmp/migration.sql"
cp "$CERT_FILE" "${WORK_DIR}/backend/migrations/tmp/cert.pem"

# Dockerコンテナを使ってMySQLに接続し、マイグレーションを実行
docker run --rm \
  -v "${WORK_DIR}/backend/migrations/tmp:/scripts" \
  mysql:8.0 \
  sh -c "mysql -h ${MYSQL_SERVER_NAME}.mysql.database.azure.com -u ${MYSQL_ADMIN} -p'${MYSQL_PASSWORD}' --ssl-ca=/scripts/cert.pem ${MYSQL_DB_NAME} < /scripts/migration.sql" 2>&1 | tee -a $LOGFILE

RESULT=$?
if [ $RESULT -eq 0 ]; then
  echo "✅ データベースマイグレーションが正常に完了しました！" | tee -a $LOGFILE
else
  echo "❌ データベースマイグレーションに失敗しました" | tee -a $LOGFILE
  exit 1
fi

# 一時ファイルを削除
rm -rf "${WORK_DIR}/backend/migrations/tmp" 