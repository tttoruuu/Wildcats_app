#!/bin/bash

set -e  # どこかで失敗したら即終了
set -o pipefail

VERSION="v$(date +%Y%m%d-%H%M)"
LOG_FILE="scripts/deploy-log-${VERSION}.txt"

echo "🚀 Starting FULL deployment [$VERSION]" | tee $LOG_FILE

# FRONTEND
echo -e "\n==> 🔧 Deploying Frontend..." | tee -a $LOG_FILE
./scripts/deploy-frontend.sh "$VERSION" 2>&1 | tee -a $LOG_FILE

# BACKEND
echo -e "\n==> 🔧 Deploying Backend..." | tee -a $LOG_FILE
./scripts/deploy-backend.sh "$VERSION" 2>&1 | tee -a $LOG_FILE

echo -e "\n✅ Full deployment completed! [$VERSION]" | tee -a $LOG_FILE
