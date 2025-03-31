#!/bin/bash

set -e  # エラーで即終了

TIMESTAMP=$(date +%Y%m%d-%H%M)
VERSION="v$TIMESTAMP"
LOGFILE="deploy-backend-log-$VERSION.log"
REGISTRY="wildcats9999.azurecr.io"
RG="myResourceGroup"

echo "🚀 Backend deployment [$VERSION]" | tee $LOGFILE

# Dockerビルド（backend/以下をビルド）
docker build -t $REGISTRY/backend:$VERSION ./backend | tee -a $LOGFILE

# ACRへプッシュ
docker push $REGISTRY/backend:$VERSION | tee -a $LOGFILE

# Azure Container Appsへ更新
az containerapp update \
  --name backend-container \
  --resource-group $RG \
  --image $REGISTRY/backend:$VERSION \
  --set-env-vars DATABASE_URL="mysql+pymysql://user:password@mysql-container:3306/testdb" \
  | tee -a $LOGFILE

echo "✅ Backend updated successfully!" | tee -a $LOGFILE
