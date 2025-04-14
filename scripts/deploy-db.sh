#!/bin/bash

set -e
set -o pipefail

# 変数定義
RG="wildcats-resource-group"
LOCATION="japaneast"
MYSQL_SERVER_NAME="wildcats-mysql-server"
MYSQL_DB_NAME="testdb"
MYSQL_ADMIN="dbadmin"
MYSQL_PASSWORD="Password123!"
MYSQL_SKU="Standard_D2ds_v4"
LOGFILE="deploy-db-log-$(date +%Y%m%d-%H%M).log"

echo "🐬 Azure Database for MySQL Flexible Serverのデプロイを開始します..." | tee $LOGFILE

# サーバーが既に存在するか確認
SERVER_EXISTS=$(az mysql flexible-server show --resource-group $RG --name $MYSQL_SERVER_NAME --query name -o tsv 2>/dev/null || echo "")

if [ -z "$SERVER_EXISTS" ]; then
  # サーバーが存在しない場合は新規作成
  echo "新しいMySQL Flexible Serverを作成中: $MYSQL_SERVER_NAME" | tee -a $LOGFILE
  az mysql flexible-server create \
    --resource-group $RG \
    --name $MYSQL_SERVER_NAME \
    --location $LOCATION \
    --admin-user $MYSQL_ADMIN \
    --admin-password $MYSQL_PASSWORD \
    --sku-name $MYSQL_SKU \
    --storage-size 32 \
    --version 8.0.21 \
    --tier GeneralPurpose \
    --yes | tee -a $LOGFILE
    
  # パブリックアクセスを有効にする（開発用）
  echo "パブリックアクセスを有効化中..." | tee -a $LOGFILE
  az mysql flexible-server firewall-rule create \
    --resource-group $RG \
    --name $MYSQL_SERVER_NAME \
    --rule-name AllowAll \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 255.255.255.255 | tee -a $LOGFILE
else
  echo "既存のMySQL Flexible Serverを使用します: $MYSQL_SERVER_NAME" | tee -a $LOGFILE
fi

# データベースが存在するか確認
DB_EXISTS=$(az mysql flexible-server db show --resource-group $RG --server-name $MYSQL_SERVER_NAME --database-name $MYSQL_DB_NAME --query name -o tsv 2>/dev/null || echo "")

if [ -z "$DB_EXISTS" ]; then
  # データベースが存在しない場合は新規作成
  echo "データベースを作成中: $MYSQL_DB_NAME" | tee -a $LOGFILE
  az mysql flexible-server db create \
    --resource-group $RG \
    --server-name $MYSQL_SERVER_NAME \
    --database-name $MYSQL_DB_NAME | tee -a $LOGFILE
else
  echo "既存のデータベースを使用します: $MYSQL_DB_NAME" | tee -a $LOGFILE
fi

# SSL証明書をダウンロード (既に存在しない場合のみ)
if [ ! -f "DigiCertGlobalRootCA.crt.pem" ]; then
  echo "SSL証明書をダウンロード中..." | tee -a $LOGFILE
  curl -o DigiCertGlobalRootCA.crt.pem https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem
else
  echo "既存のSSL証明書を使用します" | tee -a $LOGFILE
fi

# データベース接続文字列を表示
echo "🔌 データベース接続文字列:" | tee -a $LOGFILE
CONN_STRING="mysql+pymysql://${MYSQL_ADMIN}:${MYSQL_PASSWORD}@${MYSQL_SERVER_NAME}.mysql.database.azure.com:3306/${MYSQL_DB_NAME}?ssl_ca=DigiCertGlobalRootCA.crt.pem"
echo $CONN_STRING | tee -a $LOGFILE

# SQLダンプファイルをインポート（もし存在するなら）
if [ -f "dump.sql" ]; then
  echo "SQLダンプファイルが見つかりましたが、ローカルからのインポートをスキップします。" | tee -a $LOGFILE
  echo "バックエンドデプロイ時にマイグレーションが実行されるため、テーブルは自動的に作成されます。" | tee -a $LOGFILE
else
  echo "SQLダンプファイルが見つかりません。テーブル作成をスキップします。" | tee -a $LOGFILE
fi

echo "✅ Azure Database for MySQL Flexible Serverのデプロイが完了しました！" | tee -a $LOGFILE
