#!/bin/bash

set -e
RG="myResourceGroup"
LOGFILE="deploy-db-log-$(date +%Y%m%d-%H%M).log"

echo "🐬 Redeploying MySQL container..." | tee $LOGFILE

az containerapp update \
  --name mysql-container \
  --resource-group $RG \
  --image mysql:8 \
  --env-vars \
    MYSQL_ROOT_PASSWORD=rootpassword \
    MYSQL_DATABASE=testdb \
    MYSQL_USER=user \
    MYSQL_PASSWORD=password \
  --ingress internal | tee -a $LOGFILE

echo "✅ MySQL redeployed successfully!" | tee -a $LOGFILE
