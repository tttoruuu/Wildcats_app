#!/bin/bash

# X-Forwarded-Proto ヘッダー検証スクリプト
# Azure Container AppsにデプロイされたアプリケーションのX-Forwarded-Protoヘッダーを検証します

set -e
set -o pipefail

# 変数定義
RG="wildcats-resource-group"
FRONTEND_APP_NAME="frontend-container"
BACKEND_APP_NAME="backend-container"

echo "🔍 X-Forwarded-Proto ヘッダー検証を開始します"

# バックエンドURLの取得
BACKEND_URL=$(az containerapp show \
  --name $BACKEND_APP_NAME \
  --resource-group $RG \
  --query properties.configuration.ingress.fqdn \
  --output tsv 2>/dev/null || echo "backend-container.example.com")

# 完全なURLを作成
FULL_URL="https://$BACKEND_URL/headers"

echo "🌐 検証URL: $FULL_URL"

# ヘッダーの検証リクエストを送信
echo "📡 リクエスト送信中..."
response=$(curl -s "$FULL_URL" || echo '{"error": "リクエスト失敗"}')

# レスポンスの表示
echo "📊 レスポンス:"
echo "$response" | json_pp

# X-Forwarded-Protoの検証
x_forwarded_proto=$(echo "$response" | grep -o '"x_forwarded_proto" : "[^"]*"' | cut -d '"' -f 4)
request_protocol=$(echo "$response" | grep -o '"request_protocol" : "[^"]*"' | cut -d '"' -f 4)
is_secure=$(echo "$response" | grep -o '"is_secure" : [^,}]*' | cut -d ' ' -f 3)

echo ""
echo "📋 検証結果:"
echo "--------------------------------"
echo "X-Forwarded-Proto: $x_forwarded_proto"
echo "リクエストプロトコル: $request_protocol"
echo "セキュア接続: $is_secure"
echo "--------------------------------"

# 結果の評価
if [ "$x_forwarded_proto" = "https" ] && [ "$request_protocol" = "https" ] && [ "$is_secure" = "true" ]; then
    echo "✅ 検証成功: X-Forwarded-Protoヘッダーが正しく処理されています"
else
    echo "❌ 検証失敗: X-Forwarded-Protoヘッダーが正しく処理されていません"
    
    if [ "$x_forwarded_proto" != "https" ]; then
        echo "  - X-Forwarded-Protoヘッダーが 'https' ではありません"
    fi
    
    if [ "$request_protocol" != "https" ]; then
        echo "  - リクエストプロトコルが 'https' ではありません（ミドルウェアが機能していない可能性）"
    fi
    
    if [ "$is_secure" != "true" ]; then
        echo "  - セキュア接続が 'true' ではありません"
    fi
fi

echo ""
echo "詳細な手順とトラブルシューティングについては、docs/azure-proxy-check.md を参照してください" 