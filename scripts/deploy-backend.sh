#!/bin/bash

set -e  # エラーで即終了
set -o pipefail

# 環境変数ファイルの読み込み
if [ -f ".env" ]; then
  echo "ローカルの.envファイルを読み込みます" | tee -a $LOGFILE
  source .env
fi

# OPENAI_API_KEYが設定されているか確認
if [ -z "$OPENAI_API_KEY" ]; then
  echo "警告: OPENAI_API_KEYが設定されていません" | tee -a $LOGFILE
  echo "チャット機能は動作しません。.envファイルにOPENAI_API_KEYを設定してください" | tee -a $LOGFILE
fi

# 変数定義
TIMESTAMP=$(date +%Y%m%d-%H%M)
VERSION="v$TIMESTAMP"
LOGFILE="deploy-backend-log-$VERSION.log"
REGISTRY="wildcats9999.azurecr.io"
RG="wildcats-resource-group"
ENV_NAME="wildcats-environment"
BACKEND_APP_NAME="backend-container"
MYSQL_SERVER_NAME="wildcats-mysql-server"
MYSQL_DB_NAME="testdb"
MYSQL_ADMIN="dbadmin"
MYSQL_PASSWORD="Password123!"

echo "🚀 Backend deployment [$VERSION]" | tee $LOGFILE

# 証明書ファイルが存在するか確認
if [ ! -f "DigiCertGlobalRootCA.crt.pem" ]; then
  echo "SSL証明書をダウンロード中..." | tee -a $LOGFILE
  curl -o DigiCertGlobalRootCA.crt.pem https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem
fi

# SSL証明書をbackendディレクトリにコピー
echo "SSL証明書をbackendディレクトリにコピー中..." | tee -a $LOGFILE
cp DigiCertGlobalRootCA.crt.pem backend/

# Dockerビルド（backend/以下をビルド）
echo "Dockerイメージをビルド中..." | tee -a $LOGFILE
docker build -t $REGISTRY/backend:$VERSION ./backend | tee -a $LOGFILE

# ACRへプッシュ
echo "イメージをACRにプッシュ中..." | tee -a $LOGFILE
docker push $REGISTRY/backend:$VERSION | tee -a $LOGFILE

# データベース接続文字列の設定
DB_CONNECTION_STRING="mysql+pymysql://${MYSQL_ADMIN}:${MYSQL_PASSWORD}@${MYSQL_SERVER_NAME}.mysql.database.azure.com:3306/${MYSQL_DB_NAME}?ssl_ca=DigiCertGlobalRootCA.crt.pem"

# フロントエンドURLの取得（存在する場合）
FRONTEND_URL=""
if az containerapp show --name frontend-container --resource-group $RG &>/dev/null; then
  FRONTEND_URL=$(az containerapp show \
    --name frontend-container \
    --resource-group $RG \
    --query properties.configuration.ingress.fqdn \
    --output tsv)
  FRONTEND_ORIGIN="https://$FRONTEND_URL"
  echo "🔌 フロントエンドURL検出: $FRONTEND_ORIGIN" | tee -a $LOGFILE
else
  FRONTEND_ORIGIN="http://localhost:3000"
  echo "⚠️ フロントエンドコンテナが見つからないため、デフォルト値を使用: $FRONTEND_ORIGIN" | tee -a $LOGFILE
fi

# ACRの認証情報を取得
REGISTRY_USERNAME=$(az acr credential show -n wildcats9999 --query username -o tsv)
REGISTRY_PASSWORD=$(az acr credential show -n wildcats9999 --query passwords[0].value -o tsv)

# 環境変数の設定
ENV_VARS="DATABASE_URL=$DB_CONNECTION_STRING FRONTEND_ORIGIN=$FRONTEND_ORIGIN ENV=\"production\""

# OPENAI_API_KEYが設定されている場合は追加
if [ ! -z "$OPENAI_API_KEY" ]; then
  ENV_VARS="$ENV_VARS OPENAI_API_KEY=$OPENAI_API_KEY"
  echo "✅ OPENAI_API_KEYが設定されました" | tee -a $LOGFILE
fi

# バックエンドコンテナアプリの確認
BACKEND_EXISTS=$(az containerapp show --name $BACKEND_APP_NAME --resource-group $RG 2>/dev/null || echo "not-found")

if [ "$BACKEND_EXISTS" = "not-found" ]; then
  # バックエンドコンテナアプリの作成
  echo "バックエンドコンテナアプリを作成中..." | tee -a $LOGFILE
  az containerapp create \
    --name $BACKEND_APP_NAME \
    --resource-group $RG \
    --environment $ENV_NAME \
    --image $REGISTRY/backend:$VERSION \
    --target-port 8000 \
    --ingress external \
    --registry-server $REGISTRY \
    --registry-username $REGISTRY_USERNAME \
    --registry-password $REGISTRY_PASSWORD \
    --env-vars $ENV_VARS \
    | tee -a $LOGFILE
else
  # バックエンドコンテナアプリの更新

  # 先に既存のコンテナアプリを削除
  echo "既存のバックエンドコンテナアプリを削除中..." | tee -a $LOGFILE
  az containerapp delete \
    --name $BACKEND_APP_NAME \
    --resource-group $RG \
    --yes \
    | tee -a $LOGFILE

  # 新しいコンテナアプリを作成
  echo "新しいバックエンドコンテナアプリを作成中..." | tee -a $LOGFILE
  az containerapp create \
    --name $BACKEND_APP_NAME \
    --resource-group $RG \
    --environment $ENV_NAME \
    --image $REGISTRY/backend:$VERSION \
    --target-port 8000 \
    --ingress external \
    --registry-server $REGISTRY \
    --registry-username $REGISTRY_USERNAME \
    --registry-password $REGISTRY_PASSWORD \
    --env-vars $ENV_VARS \
    | tee -a $LOGFILE
fi

# バックエンドのエンドポイントURLを取得
BACKEND_URL=$(az containerapp show \
  --name $BACKEND_APP_NAME \
  --resource-group $RG \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "✅ バックエンド更新が完了しました！" | tee -a $LOGFILE
echo "🔗 バックエンドURL: https://$BACKEND_URL" | tee -a $LOGFILE

# フロントエンドデプロイ用の環境変数を保存
echo "BACKEND_URL=https://$BACKEND_URL" > backend_url.env
