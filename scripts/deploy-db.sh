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

echo "🐬 Azure Database for MySQL Flexible Serverをデプロイ中..." | tee $LOGFILE

# Azure Database for MySQL Flexible Serverの作成
echo "MySQL Flexible Serverを作成中: $MYSQL_SERVER_NAME" | tee -a $LOGFILE
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

# データベースの作成
echo "データベースを作成中: $MYSQL_DB_NAME" | tee -a $LOGFILE
az mysql flexible-server db create \
  --resource-group $RG \
  --server-name $MYSQL_SERVER_NAME \
  --database-name $MYSQL_DB_NAME | tee -a $LOGFILE

# パブリックアクセスを有効にする（開発用）
echo "パブリックアクセスを有効化中..." | tee -a $LOGFILE
az mysql flexible-server firewall-rule create \
  --resource-group $RG \
  --name $MYSQL_SERVER_NAME \
  --rule-name AllowAll \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255 | tee -a $LOGFILE

# データベース接続文字列を表示
echo "🔌 データベース接続文字列:" | tee -a $LOGFILE
CONN_STRING="mysql+pymysql://${MYSQL_ADMIN}:${MYSQL_PASSWORD}@${MYSQL_SERVER_NAME}.mysql.database.azure.com:3306/${MYSQL_DB_NAME}?ssl_ca=DigiCertGlobalRootCA.crt.pem"
echo $CONN_STRING | tee -a $LOGFILE

# SSL証明書をダウンロード
echo "SSL証明書をダウンロード中..." | tee -a $LOGFILE
curl -o DigiCertGlobalRootCA.crt.pem https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem

# SQLダンプファイルをインポート（もし存在するなら）
if [ -f "dump.sql" ]; then
  echo "SQLダンプファイルをインポート中..." | tee -a $LOGFILE
  mysql -h ${MYSQL_SERVER_NAME}.mysql.database.azure.com -u ${MYSQL_ADMIN} -p${MYSQL_PASSWORD} --ssl-ca=DigiCertGlobalRootCA.crt.pem ${MYSQL_DB_NAME} < dump.sql
  echo "SQLダンプファイルのインポートが完了しました" | tee -a $LOGFILE
fi

echo "✅ Azure Database for MySQL Flexible Serverが正常にデプロイされました！" | tee -a $LOGFILE
