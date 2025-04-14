#!/bin/bash

set -e
set -o pipefail

# 変数定義
TIMESTAMP=$(date +%Y%m%d-%H%M)
VERSION="v$TIMESTAMP"
LOGFILE="deploy-frontend-log-$VERSION.log"
REGISTRY="wildcats9999.azurecr.io"
RG="wildcats-resource-group"
ENV_NAME="wildcats-environment"
FRONTEND_APP_NAME="frontend-container"

echo "🚀 Frontend deployment [$VERSION]" | tee $LOGFILE

# バックエンドURLの読み込み（バックエンドデプロイ後に作成される）
if [ -f "backend_url.env" ]; then
  source backend_url.env
  API_URL=$BACKEND_URL
else
  # バックエンドのエンドポイントURLを取得（バックエンドが既にデプロイされている場合）
  API_URL=$(az containerapp show \
    --name backend-container \
    --resource-group $RG \
    --query properties.configuration.ingress.fqdn \
    --output tsv 2>/dev/null || echo "backend-container.example.com")
  
  # HTTPSプレフィックスの追加
  API_URL="https://$API_URL"
fi

# APIのURLがhttpsで始まることを確認（より強力な検証）
if [[ "$API_URL" != https://* ]]; then
  echo "バックエンドURLがhttpsで始まっていないため、修正します: $API_URL → https://${API_URL#http://}" | tee -a $LOGFILE
  API_URL="https://${API_URL#http://}"
fi

# 二重確認: 常にHTTPSを使用
API_URL=$(echo "$API_URL" | sed 's/^http:/https:/g')

echo "🔌 API URL: $API_URL" | tee -a $LOGFILE

# .env.productionファイルを更新
echo "NEXT_PUBLIC_API_URL=$API_URL" > frontend/.env.production
echo "更新した環境変数: NEXT_PUBLIC_API_URL=$API_URL" | tee -a $LOGFILE

# Dockerビルド - フロントエンド
echo "Dockerイメージをビルド中..." | tee -a $LOGFILE
docker build \
  --build-arg NEXT_PUBLIC_API_URL=$API_URL \
  --build-arg NODE_ENV=production \
  -t $REGISTRY/frontend:$VERSION \
  ./frontend | tee -a $LOGFILE

# ACRへプッシュ
echo "イメージをACRにプッシュ中..." | tee -a $LOGFILE
docker push $REGISTRY/frontend:$VERSION | tee -a $LOGFILE

# ACRの認証情報を取得
REGISTRY_USERNAME=$(az acr credential show -n wildcats9999 --query username -o tsv)
REGISTRY_PASSWORD=$(az acr credential show -n wildcats9999 --query passwords[0].value -o tsv)

# フロントエンドコンテナアプリの確認
FRONTEND_EXISTS=$(az containerapp show --name $FRONTEND_APP_NAME --resource-group $RG 2>/dev/null || echo "not-found")

if [ "$FRONTEND_EXISTS" = "not-found" ]; then
  # フロントエンドコンテナアプリの作成
  echo "フロントエンドコンテナアプリを作成中..." | tee -a $LOGFILE
  az containerapp create \
    --name $FRONTEND_APP_NAME \
    --resource-group $RG \
    --environment $ENV_NAME \
    --image $REGISTRY/frontend:$VERSION \
    --target-port 3000 \
    --ingress external \
    --registry-server $REGISTRY \
    --registry-username $REGISTRY_USERNAME \
    --registry-password $REGISTRY_PASSWORD \
    --env-vars NEXT_PUBLIC_API_URL=$API_URL \
    | tee -a $LOGFILE
else
  # フロントエンドコンテナアプリの更新

  # 先に既存のコンテナアプリを削除
  echo "既存のフロントエンドコンテナアプリを削除中..." | tee -a $LOGFILE
  az containerapp delete \
    --name $FRONTEND_APP_NAME \
    --resource-group $RG \
    --yes \
    | tee -a $LOGFILE

  # 新しいコンテナアプリを作成
  echo "新しいフロントエンドコンテナアプリを作成中..." | tee -a $LOGFILE
  az containerapp create \
    --name $FRONTEND_APP_NAME \
    --resource-group $RG \
    --environment $ENV_NAME \
    --image $REGISTRY/frontend:$VERSION \
    --target-port 3000 \
    --ingress external \
    --registry-server $REGISTRY \
    --registry-username $REGISTRY_USERNAME \
    --registry-password $REGISTRY_PASSWORD \
    --env-vars NEXT_PUBLIC_API_URL=$API_URL \
    | tee -a $LOGFILE
fi

# フロントエンドのエンドポイントURLを取得
FRONTEND_URL=$(az containerapp show \
  --name $FRONTEND_APP_NAME \
  --resource-group $RG \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "✅ フロントエンド更新が完了しました！" | tee -a $LOGFILE
echo "🌐 フロントエンドURL: https://$FRONTEND_URL" | tee -a $LOGFILE
