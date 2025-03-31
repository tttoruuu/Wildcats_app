#!/bin/bash

set -e
REGISTRY="wildcats9999.azurecr.io"
RG="myResourceGroup"
VERSION=$1

if [ -z "$VERSION" ]; then
  echo "⚠️ バージョンを指定してください:"
  echo "👉 例: ./scripts/rollback.sh v20250329-2300"
  exit 1
fi

LOGFILE="rollback-log-$VERSION.log"

echo "⏪ Rolling back to version [$VERSION]..." | tee $LOGFILE

# Frontend rollback
az containerapp update \
  --name frontend-container \
  --resource-group $RG \
  --image $REGISTRY/frontend:$VERSION \
  --env-vars NEXT_PUBLIC_API_URL="http://backend-container:8000" \
  --ingress external | tee -a $LOGFILE

# Backend rollback
az containerapp update \
  --name backend-container \
  --resource-group $RG \
  --image $REGISTRY/backend:$VERSION \
  --env-vars DATABASE_URL="mysql+pymysql://user:password@mysql-container:3306/testdb" \
  --ingress internal | tee -a $LOGFILE

echo "✅ Successfully rolled back to [$VERSION]!" | tee -a $LOGFILE
