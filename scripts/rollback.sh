#!/bin/bash

set -e
set -o pipefail

# 変数定義
REGISTRY="wildcats9999.azurecr.io"
RG="wildcats-resource-group"
ENV_NAME="wildcats-environment"
FRONTEND_APP_NAME="frontend-container"
BACKEND_APP_NAME="backend-container"
MYSQL_SERVER_NAME="wildcats-mysql-server"
MYSQL_DB_NAME="testdb"
MYSQL_ADMIN="dbadmin"
MYSQL_PASSWORD="Password123!"
VERSION=$1

if [ -z "$VERSION" ]; then
  echo "⚠️ バージョンを指定してください:"
  echo "👉 例: ./scripts/rollback.sh v20250329-2300"
  exit 1
fi

LOGFILE="rollback-log-$VERSION.log"

echo "⏪ バージョン[$VERSION]へのロールバックを開始します..." | tee $LOGFILE

# バックエンドのエンドポイントURLを取得
BACKEND_URL=$(az containerapp show \
  --name $BACKEND_APP_NAME \
  --resource-group $RG \
  --query properties.configuration.ingress.fqdn \
  --output tsv)
BACKEND_URL="https://$BACKEND_URL"

# データベース接続文字列の設定
DB_CONNECTION_STRING="mysql+pymysql://${MYSQL_ADMIN}:${MYSQL_PASSWORD}@${MYSQL_SERVER_NAME}.mysql.database.azure.com:3306/${MYSQL_DB_NAME}?ssl_ca=DigiCertGlobalRootCA.crt.pem"

# フロントエンドをロールバック
echo "フロントエンドをロールバック中..." | tee -a $LOGFILE
az containerapp update \
  --name $FRONTEND_APP_NAME \
  --resource-group $RG \
  --image $REGISTRY/frontend:$VERSION \
  --set-env-vars NEXT_PUBLIC_API_URL=$BACKEND_URL | tee -a $LOGFILE

# バックエンドをロールバック
echo "バックエンドをロールバック中..." | tee -a $LOGFILE
az containerapp update \
  --name $BACKEND_APP_NAME \
  --resource-group $RG \
  --image $REGISTRY/backend:$VERSION \
  --set-env-vars DATABASE_URL="$DB_CONNECTION_STRING" | tee -a $LOGFILE

echo "✅ バージョン[$VERSION]へのロールバックが完了しました！" | tee -a $LOGFILE
