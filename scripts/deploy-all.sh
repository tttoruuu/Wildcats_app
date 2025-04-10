#!/bin/bash

set -e  # どこかで失敗したら即終了
set -o pipefail

VERSION="v$(date +%Y%m%d-%H%M)"
LOG_FILE="scripts/deploy-log-${VERSION}.txt"

echo "🚀 Azure上への完全デプロイを開始します [$VERSION]" | tee $LOG_FILE

# Azureリソースグループの作成
echo -e "\n==> 🔧 Azureリソースグループを作成中..." | tee -a $LOG_FILE
./scripts/deploy-azure-rg.sh 2>&1 | tee -a $LOG_FILE

# Azure Database for MySQLのデプロイ
echo -e "\n==> 🐬 Azure Database for MySQLをデプロイ中..." | tee -a $LOG_FILE
./scripts/deploy-db.sh 2>&1 | tee -a $LOG_FILE

# BACKEND
echo -e "\n==> 🔧 バックエンドをデプロイ中..." | tee -a $LOG_FILE
./scripts/deploy-backend.sh "$VERSION" 2>&1 | tee -a $LOG_FILE

# FRONTEND
echo -e "\n==> 🔧 フロントエンドをデプロイ中..." | tee -a $LOG_FILE
./scripts/deploy-frontend.sh "$VERSION" 2>&1 | tee -a $LOG_FILE

echo -e "\n✅ 完全デプロイが完了しました！ [$VERSION]" | tee -a $LOG_FILE
echo -e "バックエンドのURLを確認するには: az containerapp show --name backend-container --resource-group wildcats-resource-group --query properties.configuration.ingress.fqdn --output tsv" | tee -a $LOG_FILE
echo -e "フロントエンドのURLを確認するには: az containerapp show --name frontend-container --resource-group wildcats-resource-group --query properties.configuration.ingress.fqdn --output tsv" | tee -a $LOG_FILE
