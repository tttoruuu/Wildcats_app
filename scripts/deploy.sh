#!/bin/bash

set -e  # エラーで即終了
set -o pipefail

# 変数定義
TIMESTAMP=$(date +%Y%m%d-%H%M)
VERSION="v$TIMESTAMP"
LOGFILE="deploy-log-$VERSION.log"
REGISTRY="wildcats9999.azurecr.io"
RG="wildcats-resource-group"

echo "🚀 全体デプロイ開始 [$VERSION]" | tee $LOGFILE

# 1. AzureへのログインとACRログイン
echo "Azure CLIにログイン中..." | tee -a $LOGFILE
az login

echo "ACRにログイン中..." | tee -a $LOGFILE
az acr login --name wildcats9999

# 2. バックエンドデプロイ
echo "バックエンドのデプロイを開始します..." | tee -a $LOGFILE
bash scripts/deploy-backend.sh
if [ $? -ne 0 ]; then
  echo "❌ バックエンドのデプロイに失敗しました。" | tee -a $LOGFILE
  exit 1
fi
echo "✅ バックエンドのデプロイが完了しました。" | tee -a $LOGFILE

# バックエンドURLが設定されたことを確認
if [ ! -f "backend_url.env" ]; then
  echo "⚠️ backend_url.envファイルが生成されていません。" | tee -a $LOGFILE
  # バックエンドURLを取得して保存
  BACKEND_URL=$(az containerapp show \
    --name backend-container \
    --resource-group $RG \
    --query properties.configuration.ingress.fqdn \
    --output tsv)
  
  if [ -n "$BACKEND_URL" ]; then
    echo "BACKEND_URL=https://$BACKEND_URL" > backend_url.env
    echo "📝 backend_url.envファイルを手動で作成しました。" | tee -a $LOGFILE
  else
    echo "❌ バックエンドURLの取得に失敗しました。" | tee -a $LOGFILE
    exit 1
  fi
fi

# バックエンドURLを読み込み
source backend_url.env
echo "🔗 バックエンドURL: $BACKEND_URL" | tee -a $LOGFILE

# 3. フロントエンドデプロイ
echo "フロントエンドのデプロイを開始します..." | tee -a $LOGFILE
bash scripts/deploy-frontend.sh
if [ $? -ne 0 ]; then
  echo "❌ フロントエンドのデプロイに失敗しました。" | tee -a $LOGFILE
  exit 1
fi
echo "✅ フロントエンドのデプロイが完了しました。" | tee -a $LOGFILE

# 4. フロントエンドURL取得
FRONTEND_URL=$(az containerapp show \
  --name frontend-container \
  --resource-group $RG \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "=================================================="
echo "🎉 デプロイが完了しました！"
echo "🔗 バックエンドURL: $BACKEND_URL"
echo "🔗 フロントエンドURL: https://$FRONTEND_URL"
echo "=================================================="

# ログファイルにも記録
echo "=================================================="
echo "🎉 デプロイが完了しました！" >> $LOGFILE
echo "🔗 バックエンドURL: $BACKEND_URL" >> $LOGFILE
echo "🔗 フロントエンドURL: https://$FRONTEND_URL" >> $LOGFILE
echo "=================================================="  >> $LOGFILE