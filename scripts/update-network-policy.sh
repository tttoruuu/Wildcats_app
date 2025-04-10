#!/bin/bash

set -e
set -o pipefail

echo "🔒 Azure Container Appsの内部通信設定を更新中..."

RG="wildcats-resource-group"
FRONTEND_APP="frontend-container"
BACKEND_APP="backend-container"
ENV_NAME="wildcats-environment"

# 1. バックエンドコンテナアプリの情報を取得
BACKEND_FQDN=$(az containerapp show --name $BACKEND_APP --resource-group $RG --query properties.configuration.ingress.fqdn -o tsv)
echo "バックエンドFQDN: $BACKEND_FQDN"

# 2. フロントエンドの環境変数を更新して、内部サービス名でバックエンドにアクセスするよう設定
echo "フロントエンドの環境変数を更新..."

# Azure Container Appsの内部サービス名を使用
INTERNAL_URL="http://$BACKEND_APP.$ENV_NAME.internal:80"
echo "内部サービスURL: $INTERNAL_URL"

# 環境変数を更新
az containerapp update \
  --name $FRONTEND_APP \
  --resource-group $RG \
  --set-env-vars "NEXT_PUBLIC_API_URL=$INTERNAL_URL"

echo "✅ 内部通信設定の更新が完了しました！"
echo "これにより、フロントエンドからバックエンドへの通信が内部サービス名経由で可能になります。"
echo "新しいバックエンドURL: $INTERNAL_URL" 