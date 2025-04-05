# お見合い会話練習アプリ - バックエンド

## プロジェクト概要

このプロジェクトは、お見合いの際の会話を練習するためのバックエンドAPIを提供します。FastAPIを使用し、RESTful APIを実装しています。

## 開発環境のセットアップ

```bash
# 依存パッケージのインストール
pip install -r requirements.txt

# 環境変数の設定（サンプルの.envファイルをコピー）
cp .env.example .env

# データベーステーブルの作成
python create_tables.py

# 開発サーバーの起動
uvicorn main:app --reload
```

## Docker環境

Dockerを使用して開発環境を簡単に構築できます。

```bash
# Dockerコンテナのビルドと起動
docker compose up -d --build

# ログの確認
docker compose logs -f backend
```

## プロジェクト構造

```
backend/
├── alembic.ini        # Alembic設定ファイル
├── auth/              # 認証関連のモジュール
│   ├── jwt.py         # JWTトークン処理
│   └── password.py    # パスワードハッシュ処理
├── models/            # データモデル
│   ├── conversation_partner.py   # 会話相手モデル
│   ├── schemas.py     # Pydanticスキーマ
│   └── user.py        # ユーザーモデル
├── routers/           # APIルーター
│   └── conversation_partners.py  # 会話相手API
├── uploads/           # アップロードされたファイル
├── .env               # 環境変数
├── database.py        # データベース接続
├── main.py            # アプリケーションのエントリーポイント
└── requirements.txt   # 依存パッケージリスト
```

## 主要なエンドポイント

### 認証関連

| エンドポイント | メソッド | 説明 | 認証 |
|--------------|--------|------|-----|
| `/register` | POST | 新規ユーザー登録 | 不要 |
| `/login` | POST | ユーザーログイン | 不要 |
| `/me` | GET | 現在のユーザー情報を取得 | 必要 |

### 会話相手関連

| エンドポイント | メソッド | 説明 | 認証 |
|--------------|--------|------|-----|
| `/conversation-partners` | GET | 会話相手一覧の取得 | 必要 |
| `/conversation-partners` | POST | 新規会話相手の登録 | 必要 |
| `/conversation-partners/{partner_id}` | GET | 会話相手の詳細情報取得 | 必要 |
| `/conversation-partners/{partner_id}` | DELETE | 会話相手の削除 | 必要 |

### 会話シミュレーション

| エンドポイント | メソッド | 説明 | 認証 |
|--------------|--------|------|-----|
| `/conversation` | POST | 会話レスポンスの生成 | 必要 |

### その他

| エンドポイント | メソッド | 説明 | 認証 |
|--------------|--------|------|-----|
| `/upload-profile-image` | POST | プロフィール画像のアップロード | 必要 |
| `/` | GET | API稼働確認 | 不要 |

## API詳細仕様

### ユーザー登録

```
POST /register
```

リクエスト本文:
```json
{
  "username": "testuser",
  "password": "securepassword",
  "full_name": "テスト ユーザー",
  "email": "test@example.com",
  "birth_date": "1990-01-01",
  "hometown": "東京都",
  "hobbies": "読書、料理",
  "matchmaking_agency": "サンプル相談所"
}
```

レスポンス:
```json
{
  "id": 1,
  "username": "testuser",
  "full_name": "テスト ユーザー",
  "email": "test@example.com",
  "birth_date": "1990-01-01",
  "hometown": "東京都",
  "hobbies": "読書、料理",
  "matchmaking_agency": "サンプル相談所",
  "profile_image_url": null
}
```

### ログイン

```
POST /login
```

リクエスト本文:
```json
{
  "username": "testuser",
  "password": "securepassword"
}
```

レスポンス:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 会話相手登録

```
POST /conversation-partners
```

ヘッダー:
```
Authorization: Bearer {access_token}
```

リクエスト本文:
```json
{
  "name": "あいさん",
  "age": 37,
  "hometown": "東京都",
  "hobbies": "料理、旅行",
  "daily_routine": "公園を散歩したり、カフェでのんびり過ごします"
}
```

レスポンス:
```json
{
  "id": 1,
  "name": "あいさん",
  "age": 37,
  "hometown": "東京都",
  "hobbies": "料理、旅行",
  "daily_routine": "公園を散歩したり、カフェでのんびり過ごします",
  "user_id": 1
}
```

### 会話シミュレーション

```
POST /conversation
```

ヘッダー:
```
Authorization: Bearer {access_token}
```

リクエスト本文:
```json
{
  "partnerId": "1",
  "meetingCount": "first",
  "scenario": "自己紹介",
  "message": "はじめまして、私の名前は田中です。普段はIT企業で働いています。"
}
```

レスポンス:
```json
{
  "reply": "ご自己紹介ありがとうございます！私も自己紹介させてください。私はあいと申します。料理と旅行が趣味です。"
}
```

## エラーハンドリング

API呼び出しが失敗した場合、適切なHTTPステータスコードとともにエラーメッセージが返されます。

例:
```json
{
  "detail": "Incorrect username or password"
}
```

## 認証

APIの多くのエンドポイントではJWT (JSON Web Token) を使用した認証が必要です。トークンは`Authorization`ヘッダーに`Bearer {token}`の形式で指定します。 