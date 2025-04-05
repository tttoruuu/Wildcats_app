# お見合い会話練習アプリ

## 📝 プロジェクト概要

このプロジェクトは、お見合いの際の会話を練習するためのWebアプリケーションです。ユーザーは架空の会話相手を登録し、様々なシナリオで会話練習を行うことができます。フロントエンドはNext.js、バックエンドはFastAPI、データベースはMySQLを使用しています。

## 🛠️ システム構成

```
docker-next-fastapi-mysql/
├── frontend/        # Next.jsフロントエンド
├── backend/         # FastAPIバックエンド
├── mysql/           # MySQLデータベース
└── docker-compose.yml  # Docker設定
```

## 🚀 主要機能

1. **ユーザー管理**
   - ユーザー登録・ログイン
   - プロフィール管理

2. **会話相手管理**
   - 会話相手の登録
   - 会話相手の一覧表示・削除

3. **会話練習**
   - 会話シナリオの選択
   - 会う回数の選択（初めて、2-3回目、それ以上）
   - 会話シミュレーション

## 🏁 クイックスタート

以下の手順で開発環境をセットアップできます：

```bash
# リポジトリのクローン
git clone <repository-url>
cd docker-next-fastapi-mysql

# Dockerコンテナのビルドと起動
docker compose up -d --build

# ログの確認
docker compose logs -f
```

セットアップ後に以下のURLでアクセスできます：

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000
- Swagger UI (API仕様書): http://localhost:8000/docs

## 🧩 アーキテクチャ

![システムアーキテクチャ](docs/architecture.png)

- **フロントエンド**: Next.js + Tailwind CSS
- **バックエンド**: FastAPI + SQLAlchemy
- **データベース**: MySQL
- **認証**: JWT (JSON Web Token)

## 👥 開発ワークフロー

1. **フロントエンド開発者**
   - `frontend/`ディレクトリで作業
   - APIクライアント（`frontend/services/api.js`）を使用してバックエンドと通信
   - 詳細は`frontend/README.md`を参照

2. **バックエンド開発者**
   - `backend/`ディレクトリで作業
   - APIエンドポイントを実装
   - 詳細は`backend/README.md`を参照

## 📡 API概要

主要なAPIエンドポイント：

| カテゴリ | エンドポイント | 説明 |
|----------|--------------|------|
| 認証 | `/register`, `/login` | ユーザー登録・ログイン |
| ユーザー | `/me` | ユーザー情報取得 |
| 会話相手 | `/conversation-partners` | 会話相手の管理 |
| 会話 | `/conversation` | 会話シミュレーション |

## ⚙️ 環境変数

### バックエンド (`.env`ファイル)

```
ENV=development
FRONTEND_ORIGIN=http://localhost:3000
```

### フロントエンド

特に設定は不要ですが、APIのエンドポイントは`frontend/services/api.js`で定義されています。

## 🐳 Docker環境

- `docker-compose.yml`ファイルで定義された3つのコンテナ：
  - `frontend`: Next.jsアプリケーション
  - `backend`: FastAPIアプリケーション
  - `db`: MySQLデータベース

### コマンド

```bash
# コンテナの起動
docker compose up -d

# コンテナの停止
docker compose down

# コンテナのビルドと起動
docker compose up -d --build

# ログの表示
docker compose logs -f [サービス名]
```

## 🔍 トラブルシューティング

- **フロントエンドが起動しない**: `docker compose logs frontend`でログを確認
- **バックエンドが起動しない**: `docker compose logs backend`でログを確認
- **APIエラー**: Swagger UI（http://localhost:8000/docs）でAPIを手動テスト
- **データベース接続エラー**: 環境変数を確認

## 🔗 参考リソース

- [FastAPI公式ドキュメント](https://fastapi.tiangolo.com/)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [SQLAlchemyドキュメント](https://docs.sqlalchemy.org/)

## 📦 ディレクトリ構造と役割

```
docker-next-fastapi-mysql/
├── frontend/           # Next.jsフロントエンド
│   ├── components/     # 共通コンポーネント
│   ├── pages/          # ページコンポーネント
│   ├── services/       # APIサービスクライアント
│   └── styles/         # スタイルシート
├── backend/            # FastAPIバックエンド
│   ├── auth/           # 認証関連
│   ├── models/         # データモデル
│   ├── routers/        # APIルーター
│   ├── schemas/        # データスキーマ
│   └── main.py         # エントリーポイント
└── docs/               # ドキュメント
```