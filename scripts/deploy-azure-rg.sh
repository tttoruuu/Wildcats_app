#!/bin/bash

set -e
set -o pipefail

# 変数定義
RG="wildcats-resource-group"
LOCATION="japaneast"
ACR_NAME="wildcats9999"
ENV_NAME="wildcats-environment"
MYSQL_SERVER_NAME="wildcats-mysql-server"
MYSQL_DB_NAME="testdb"
MYSQL_ADMIN="dbadmin"
MYSQL_PASSWORD="Password123!"
LOGFILE="deploy-azure-rg-log-$(date +%Y%m%d-%H%M).log"

echo "🚀 Azureリソースグループとコンテナレジストリの作成を開始します..." | tee $LOGFILE

# リソースグループの作成
echo "リソースグループを作成中: $RG" | tee -a $LOGFILE
az group create --name $RG --location $LOCATION | tee -a $LOGFILE

# Azure Container Registryの作成
echo "コンテナレジストリを作成中: $ACR_NAME" | tee -a $LOGFILE
az acr create --resource-group $RG --name $ACR_NAME --sku Basic | tee -a $LOGFILE

# ACRの管理者アカウントを有効化
echo "ACRの管理者アカウントを有効化中..." | tee -a $LOGFILE
az acr update -n $ACR_NAME --admin-enabled true | tee -a $LOGFILE

# ACRへのログイン
echo "コンテナレジストリにログイン中..." | tee -a $LOGFILE
az acr login --name $ACR_NAME | tee -a $LOGFILE

# Container Apps環境の作成
echo "Container Apps環境を作成中: $ENV_NAME" | tee -a $LOGFILE
az containerapp env create \
  --name $ENV_NAME \
  --resource-group $RG \
  --location $LOCATION | tee -a $LOGFILE

echo "✅ Azureリソースグループとコンテナレジストリが正常に作成されました！" | tee -a $LOGFILE 