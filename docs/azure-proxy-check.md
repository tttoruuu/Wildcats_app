# Azure Container Apps X-Forwarded-Proto ヘッダー検証ガイド

## 概要

このドキュメントでは、Azure Container AppsでデプロイされたアプリケーションがX-Forwarded-Protoヘッダーを適切に処理しているかを確認する方法を説明します。Azure Container AppsはリバースプロキシとしてHTTPSトラフィックをHTTPに変換してコンテナに転送するため、オリジナルのリクエストがHTTPSだったことを示すX-Forwarded-Protoヘッダーが重要です。

## 実装されたソリューション

以下の実装により、X-Forwarded-Protoヘッダーを適切に処理できるようになりました：

1. ヘッダー検証用エンドポイント `/headers` の追加
2. X-Forwarded-Protoヘッダー処理ミドルウェアの実装

### ヘッダー検証エンドポイント

```python
@app.get("/headers")
def get_headers(request: Request):
    """
    リクエストヘッダーを確認するためのエンドポイント
    X-Forwarded-Proto ヘッダーの存在と値を検証します
    
    - **戻り値**: リクエストヘッダー情報
    """
    headers = dict(request.headers)
    protocol = headers.get("x-forwarded-proto", "未設定")
    secure = protocol == "https"
    
    return {
        "all_headers": headers,
        "x_forwarded_proto": protocol,
        "is_secure": secure,
        "host": headers.get("host", "未設定"),
        "origin": headers.get("origin", "未設定"),
        "request_protocol": request.url.scheme
    }
```

### X-Forwarded-Proto処理ミドルウェア

```python
@app.middleware("http")
async def process_x_forwarded_proto(request: Request, call_next):
    """
    X-Forwarded-Proto ヘッダーを処理するミドルウェア
    Azure Container AppsのリバースプロキシからのHTTPSリクエストを適切に処理します
    """
    # X-Forwarded-Protoヘッダーが'https'の場合、request.url.schemeを'https'に設定
    forwarded_proto = request.headers.get("x-forwarded-proto")
    if forwarded_proto == "https":
        # FastAPIのリクエストオブジェクトのスキームを更新
        request.scope["scheme"] = "https"
    
    # 次のミドルウェアまたはエンドポイントを呼び出す
    response = await call_next(request)
    return response
```

## 検証方法

### ローカル環境での検証

1. ローカル環境で以下のコマンドを実行して、X-Forwarded-Protoヘッダーの効果を確認できます：

```bash
# X-Forwarded-Protoヘッダーを含むリクエスト
curl -v -H "X-Forwarded-Proto: https" http://localhost:8000/headers | json_pp

# 通常のリクエスト（ヘッダーなし）
curl -v http://localhost:8000/headers | json_pp
```

2. レスポンスを比較して、X-Forwarded-Protoヘッダーが適切に処理されていることを確認します：
   - `X-Forwarded-Proto: https` ヘッダーを含むリクエスト: `request_protocol` が `https` になり、`is_secure` が `true` になります
   - ヘッダーなしのリクエスト: `request_protocol` が `http` のままで、`is_secure` が `false` になります

### 本番環境(Azure)での検証

1. アプリケーションをAzure Container Appsにデプロイします：

```bash
# デプロイスクリプトを実行
./scripts/deploy-all.sh
```

2. デプロイ後、ブラウザまたはcurlで以下のエンドポイントにアクセスします：

```
https://[your-app-name].azurecontainerapps.io/headers
```

3. レスポンスを確認して、以下のことを検証します：
   - `x_forwarded_proto` の値が `https` であること
   - `request_protocol` の値が `https` であること（ミドルウェアが機能している証拠）
   - `is_secure` が `true` であること

## Azure Container Appsの設定確認

Azure Container Appsは通常、デフォルトでX-Forwarded-Protoヘッダーを追加します。しかし、この設定が正しく行われているか確認するには：

1. Azure Portalで、Container Appsのインスタンスに移動します
2. 「設定」→「ネットワーク」を選択します
3. 「受信トラフィック」セクションで、「HTTPSのみ」が選択されていることを確認します

## トラブルシューティング

X-Forwarded-Protoヘッダーが正しく処理されていない場合は、以下を確認してください：

1. ミドルウェアが正しく実装されているかを確認
2. Azure Container Appsの設定で「HTTPSのみ」になっているか確認
3. アプリケーションログでX-Forwarded-Protoヘッダーの値を確認
   ```bash
   az containerapp logs show --name backend-container --resource-group wildcats-resource-group
   ```

## 参考情報

- [Azure Container Apps のネットワーク](https://docs.microsoft.com/ja-jp/azure/container-apps/networking)
- [FastAPI ミドルウェアドキュメント](https://fastapi.tiangolo.com/tutorial/middleware/)
- [X-Forwarded-Proto MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto) 