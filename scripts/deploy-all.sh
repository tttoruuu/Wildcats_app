#!/bin/bash

set -e  # どこかで失敗したら即終了
set -o pipefail

VERSION="v$(date +%Y%m%d-%H%M)"
LOG_FILE="scripts/deploy-log-${VERSION}.txt"
REGISTRY="wildcats9999.azurecr.io"

echo "🚀 Azure上への完全デプロイを開始します [$VERSION]" | tee $LOG_FILE

# Azure CLIへのログイン
echo -e "\n==> 🔑 Azure CLIにログイン中..." | tee -a $LOG_FILE
az login

# ACRへのログイン
echo -e "\n==> 🔑 Azure Container Registry (ACR)にログイン中..." | tee -a $LOG_FILE
az acr login --name $REGISTRY

# Azureリソースグループの作成
echo -e "\n==> 🔧 Azureリソースグループを作成中..." | tee -a $LOG_FILE
./scripts/deploy-azure-rg.sh 2>&1 | tee -a $LOG_FILE

# Azure Database for MySQLのデプロイ
echo -e "\n==> 🐬 Azure Database for MySQLをデプロイ中..." | tee -a $LOG_FILE
./scripts/deploy-db.sh 2>&1 | tee -a $LOG_FILE

# データベースマイグレーションの実行
echo -e "\n==> 🔄 データベースマイグレーションを実行中..." | tee -a $LOG_FILE
./scripts/deploy-db-migration.sh 2>&1 | tee -a $LOG_FILE

# BACKEND
echo -e "\n==> 🔧 バックエンドをデプロイ中..." | tee -a $LOG_FILE
./scripts/deploy-backend.sh "$VERSION" 2>&1 | tee -a $LOG_FILE

# FRONTEND
echo -e "\n==> 🔧 フロントエンドをデプロイ中..." | tee -a $LOG_FILE
./scripts/deploy-frontend.sh "$VERSION" 2>&1 | tee -a $LOG_FILE

# URLの取得
RG="wildcats-resource-group"
echo -e "\n==> 🔍 デプロイされたURLを取得中..." | tee -a $LOG_FILE

# バックエンドURL取得
BACKEND_URL=$(az containerapp show \
  --name backend-container \
  --resource-group $RG \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

# フロントエンドURL取得
FRONTEND_URL=$(az containerapp show \
  --name frontend-container \
  --resource-group $RG \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo -e "\n=================================================="
echo -e "✅ 完全デプロイが完了しました！ [$VERSION]" 
echo -e "🔗 バックエンドURL: https://$BACKEND_URL"
echo -e "🔗 フロントエンドURL: https://$FRONTEND_URL"
echo -e "==================================================\n"

# ログファイルにも記録
echo -e "\n==================================================" >> $LOG_FILE
echo -e "✅ 完全デプロイが完了しました！ [$VERSION]" >> $LOG_FILE
echo -e "🔗 バックエンドURL: https://$BACKEND_URL" >> $LOG_FILE
echo -e "🔗 フロントエンドURL: https://$FRONTEND_URL" >> $LOG_FILE
echo -e "==================================================\n" >> $LOG_FILE
