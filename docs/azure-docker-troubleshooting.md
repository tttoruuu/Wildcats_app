# AzureでのDockerデプロイ時のエラー解決方法

## 1. HTTPS関連のエラー

### 問題
- Azure Container AppsはリバースプロキシとしてHTTPSトラフィックをHTTPに変換してコンテナに転送する
- アプリケーションがこれを適切に処理しないと、リダイレクトループやセキュア接続の問題が発生する

### 解決策
1. **X-Forwarded-Proto ヘッダー処理ミドルウェアの実装**
   ```python
   @app.middleware("http")
   async def process_x_forwarded_proto(request: Request, call_next):
       forwarded_proto = request.headers.get("x-forwarded-proto")
       if forwarded_proto == "https":
           request.scope["scheme"] = "https"
       response = await call_next(request)
       return response
   ```

2. **フロントエンドのURLをHTTPS強制変換**
   ```javascript
   const ensureHttps = (url) => {
     if (!url) return url;
     if (url.includes('localhost') || url.includes('127.0.0.1')) return url;
     
     const isProd = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
     const isHttpsPage = typeof window !== 'undefined' && window.location.protocol === 'https:';
     
     if ((isProd || isHttpsPage) && url.startsWith('http:')) {
       return 'https:' + url.substring(5);
     }
     return url;
   };
   ```

3. **ヘッダー検証エンドポイントの追加**
   ```python
   @app.get("/headers")
   def get_headers(request: Request):
       headers = dict(request.headers)
       protocol = headers.get("x-forwarded-proto", "未設定")
       secure = protocol == "https"
       
       return {
           "all_headers": headers,
           "x_forwarded_proto": protocol,
           "is_secure": secure,
           "request_protocol": request.url.scheme
       }
   ```

## 2. コンテナレジストリへのイメージプッシュエラー

### 問題
- ACR（Azure Container Registry）へのイメージプッシュ時にタイムアウトや認証エラーが発生する

### 解決策
1. **ACR管理者アカウントの有効化**
   ```bash
   az acr update -n $ACR_NAME --admin-enabled true
   ```

2. **ACRへの事前ログインを確認**
   ```bash
   az acr login --name $ACR_NAME
   ```

3. **イメージ名の形式を確認**
   - 正しい形式: `registry-name.azurecr.io/image-name:tag`

## 3. コンテナアプリケーション作成・更新エラー

### 問題
- コンテナアプリの作成/更新に失敗する
- 前回のデプロイが完全に終了していない状態での再デプロイで発生

### 解決策
1. **既存のアプリを削除してから再作成**
   ```bash
   az containerapp delete --name $APP_NAME --resource-group $RG --yes
   az containerapp create --name $APP_NAME --resource-group $RG --environment $ENV_NAME --image $IMAGE ...
   ```

2. **デプロイの進行状況を確認**
   ```bash
   az containerapp show --name $APP_NAME --resource-group $RG
   ```

## 4. 環境変数の設定エラー

### 問題
- 環境変数が正しく設定されていない（特にAPIキーやURLなど）

### 解決策
1. **環境変数の明示的な設定**
   ```bash
   az containerapp create/update ... --env-vars KEY=VALUE
   ```

2. **機密情報の安全な管理**
   - KeyVaultとの連携または環境変数としての設定

## 5. データベース接続エラー

### 問題
- SSLを使った安全な接続ができない
- データベース接続文字列が正しくない

### 解決策
1. **SSL証明書の配置**
   ```bash
   # 証明書のダウンロードとコピー
   curl -o DigiCertGlobalRootCA.crt.pem https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem
   cp DigiCertGlobalRootCA.crt.pem backend/
   ```

2. **接続文字列にSSL証明書パスを含める**
   ```
   DATABASE_URL=mysql+pymysql://user:password@server.mysql.database.azure.com:3306/dbname?ssl_ca=DigiCertGlobalRootCA.crt.pem
   ```

## 6. ネットワーク設定の問題

### 問題
- コンテナ間通信エラー
- エンドポイントにアクセスできない

### 解決策
1. **適切なポート公開設定**
   ```bash
   az containerapp create ... --target-port 8000 --ingress external
   ```

2. **CORSの適切な設定**
   - フロントエンドとバックエンドのオリジンを正しく設定

## トラブルシューティングツール

1. **ヘッダー検証スクリプト**
   ```bash
   # X-Forwarded-Proto確認
   ./scripts/verify-headers.sh
   ```

2. **アプリケーションログの確認**
   ```bash
   az containerapp logs show --name $APP_NAME --resource-group $RG
   ```

3. **コンテナの状態確認**
   ```bash
   az containerapp revision list --name $APP_NAME --resource-group $RG
   ```

## デプロイの推奨ワークフロー

1. リソースグループとコンテナレジストリの設定
   ```bash
   ./scripts/deploy-azure-rg.sh
   ```

2. データベースの設定
   ```bash
   ./scripts/deploy-db.sh
   ```

3. バックエンドのデプロイ
   ```bash
   ./scripts/deploy-backend.sh
   ```

4. フロントエンドのデプロイ
   ```bash
   ./scripts/deploy-frontend.sh
   ```

5. 検証
   ```bash
   ./scripts/verify-headers.sh
   ```

この順序で行うことで、多くの一般的な問題を回避できます。 