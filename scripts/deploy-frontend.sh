#!/bin/bash

set -e

TIMESTAMP=$(date +%Y%m%d-%H%M)
VERSION="v$TIMESTAMP"
LOGFILE="deploy-frontend-log-$VERSION.log"
REGISTRY="wildcats9999.azurecr.io"
RG="myResourceGroup"
API_URL="https://backend-container.wittycliff-38392d32.japaneast.azurecontainerapps.io"

echo "🚀 Frontend deployment [$VERSION]" | tee $LOGFILE

# build時に NEXT_PUBLIC_API_URL を渡す
docker build \
  --build-arg NEXT_PUBLIC_API_URL=$API_URL \
  -t $REGISTRY/frontend:$VERSION \
  ./frontend | tee -a $LOGFILE

docker push $REGISTRY/frontend:$VERSION | tee -a $LOGFILE

az containerapp update \
  --name frontend-container \
  --resource-group $RG \
  --image $REGISTRY/frontend:$VERSION \
  | tee -a $LOGFILE

echo "✅ Frontend updated successfully!" | tee -a $LOGFILE
