# SQLAlchemyとAlembicを使ったマイグレーションガイド

## 目次

1. [マイグレーションとは](#マイグレーションとは)
2. [基本的なコマンド](#基本的なコマンド)
3. [マイグレーションの作成](#マイグレーションの作成)
4. [マイグレーションの適用](#マイグレーションの適用)
5. [マイグレーションの巻き戻し](#マイグレーションの巻き戻し)
6. [マイグレーション履歴の確認](#マイグレーション履歴の確認)
7. [実践的な使用例](#実践的な使用例)
8. [デプロイ時の注意点](#デプロイ時の注意点)
9. [よくある問題と解決策](#よくある問題と解決策)

## マイグレーションとは

データベースマイグレーションとは、データベースのスキーマ（構造）を段階的に変更し、そのバージョンを管理する仕組みです。これにより、以下のメリットが得られます：

- データベースの変更履歴を追跡できる
- チーム間でデータベース構造の変更を共有できる
- 本番環境へのデプロイが安全になる
- 必要に応じて過去のバージョンに戻すことができる

Alembicは、SQLAlchemyと連携して動作するマイグレーションツールです。モデル定義の変更を検出し、それをSQLに変換して適用するための仕組みを提供します。

## 基本的なコマンド

### マイグレーション関連のコマンド一覧

```bash
# マイグレーションの現在の状態を確認
docker compose exec backend alembic current

# マイグレーション履歴を確認
docker compose exec backend alembic history

# 新しいマイグレーションを作成（自動検出）
docker compose exec backend alembic revision --autogenerate -m "変更の説明"

# マイグレーションを最新バージョンに適用
docker compose exec backend alembic upgrade head

# 特定のバージョンにマイグレーション
docker compose exec backend alembic upgrade <revision_id>

# 1つ前のバージョンに戻す
docker compose exec backend alembic downgrade -1

# 特定のバージョンに戻す
docker compose exec backend alembic downgrade <revision_id>
```

## マイグレーションの作成

モデルを変更した後（フィールドの追加・削除・変更など）、以下のコマンドで新しいマイグレーションを作成します：

```bash
docker compose exec backend alembic revision --autogenerate -m "ユーザーモデルにbioフィールドを追加"
```

このコマンドを実行すると、Alembicは以下の処理を行います：

1. 現在のデータベース構造（または前回のマイグレーション）とモデル定義を比較
2. 差分を検出して、マイグレーションファイルを生成
3. ファイルには `upgrade()` と `downgrade()` 関数が含まれ、それぞれ変更の適用と取り消しの方法が記述される

生成されたマイグレーションファイルは `backend/migrations/versions/` ディレクトリに保存されます。ファイル名には一意のIDと説明が含まれます。

### マイグレーションファイルの構造

```python
"""ユーザーモデルにbioフィールドを追加

Revision ID: a1b2c3d4e5f6
Revises: 98765432abcd
Create Date: 2023-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'     # 現在のリビジョンID
down_revision = '98765432abcd' # 前のリビジョンID
branch_labels = None
depends_on = None


def upgrade():
    # 変更を適用するコード
    op.add_column('users', sa.Column('bio', sa.String(length=500), nullable=True))


def downgrade():
    # 変更を取り消すコード
    op.drop_column('users', 'bio')
```

### 注意点

- マイグレーションを作成する前に、モデルの変更を完了させておいてください
- 自動生成されたマイグレーションファイルを確認し、必要に応じて調整してください
- 複雑な変更（テーブル名の変更やデータの移行など）は、自動生成だけでは対応できないことがあります

## マイグレーションの適用

作成したマイグレーションをデータベースに適用するには、以下のコマンドを使用します：

```bash
# 最新バージョンまで適用
docker compose exec backend alembic upgrade head

# 特定のバージョンまで適用
docker compose exec backend alembic upgrade <revision_id>

# 相対的なバージョン指定（例：2つ進める）
docker compose exec backend alembic upgrade +2
```

### 実行時の処理

1. Alembicは現在適用されているマイグレーションのバージョンを確認
2. 指定されたバージョンまでの未適用マイグレーションを順番に実行
3. 各マイグレーションの `upgrade()` 関数が呼び出される
4. 適用済みのバージョン情報を記録するテーブル（`alembic_version`）が更新される

## マイグレーションの巻き戻し

不具合があった場合や変更を元に戻したい場合は、以下のコマンドでマイグレーションを巻き戻すことができます：

```bash
# 1つ前のバージョンに戻す
docker compose exec backend alembic downgrade -1

# 特定のバージョンに戻す
docker compose exec backend alembic downgrade <revision_id>

# 初期状態（マイグレーション適用前）に戻す
docker compose exec backend alembic downgrade base
```

### 注意点

- 巻き戻し操作はデータを削除する可能性があります（例：カラム削除の巻き戻しはデータの復元はしません）
- 本番環境で巻き戻す場合は、事前にデータのバックアップを取ることを強く推奨します

## マイグレーション履歴の確認

現在のマイグレーション状態と履歴を確認するには、以下のコマンドを使用します：

```bash
# 現在適用されているマイグレーションのバージョンを確認
docker compose exec backend alembic current

# マイグレーション履歴を表示
docker compose exec backend alembic history

# 詳細な履歴情報を表示
docker compose exec backend alembic history -v
```

## 実践的な使用例

### 例1: 新しいフィールドの追加

ユーザーモデルに新しいフィールド（bio）を追加する場合：

1. モデルの変更

```python
# models/user.py
class User(Base):
    __tablename__ = "users"
    # 既存のフィールド
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    # 新しいフィールドを追加
    bio = Column(String(500), nullable=True)
```

2. マイグレーションの作成

```bash
docker compose exec backend alembic revision --autogenerate -m "ユーザーモデルにbioフィールドを追加"
```

3. マイグレーションの適用

```bash
docker compose exec backend alembic upgrade head
```

### 例2: テーブルの作成

まったく新しいモデル（例：Post）を追加する場合：

1. モデルの定義

```python
# models/post.py
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
```

2. モデルをenv.pyにインポート

```python
# migrations/env.py
from models.user import User
from models.post import Post  # 新しいモデルをインポート
from database import Base
```

3. マイグレーションの作成と適用

```bash
docker compose exec backend alembic revision --autogenerate -m "Postテーブルを追加"
docker compose exec backend alembic upgrade head
```

## デプロイ時の注意点

本番環境にデプロイする際は、以下の点に注意してください：

1. **マイグレーションの実行順序**：アプリケーション起動前にマイグレーションを実行します

```bash
# デプロイスクリプトの例
alembic upgrade head
uvicorn main:app --host 0.0.0.0 --port 8000
```

2. **CI/CDパイプラインへの組み込み**：自動デプロイ時にマイグレーションを実行するステップを追加します

```yaml
# GitHub Actions の例
jobs:
  deploy:
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run migrations
        run: alembic upgrade head
      - name: Deploy application
        run: # デプロイ手順
```

3. **バックアップの作成**：重要な変更の前にはデータベースのバックアップを取ります

```bash
# MySQLのバックアップ例
mysqldump -u root -p --all-databases > backup.sql
```

## よくある問題と解決策

### 問題1: マイグレーションが検出されない

**症状**: `--autogenerate` オプションを使用してもマイグレーションが生成されない

**解決策**:
- モデルが正しくインポートされていることを確認する
- `env.py` の `target_metadata = Base.metadata` が設定されていることを確認する
- 変更したモデルがインポートされ、`Base`を継承していることを確認する

### 問題2: マイグレーション適用時のエラー

**症状**: `alembic upgrade` コマンド実行時にエラーが発生する

**解決策**:
- エラーメッセージを確認し、該当するマイグレーションファイルを修正する
- 複雑な変更の場合は、自動生成されたマイグレーションを手動で調整する
- 問題のあるマイグレーションをスキップする場合は、特定のバージョンにアップグレードする

### 問題3: 複数の環境での管理

**症状**: 開発環境と本番環境でマイグレーションを個別に管理したい

**解決策**:
- 環境ごとに異なる `alembic.ini` を用意する
- 環境変数で接続情報を切り替える
- ブランチを分けて管理する

---

このドキュメントを参考に、マイグレーションを適切に管理し、データベースの変更を安全に行ってください。質問や不明点があれば、開発チームにお問い合わせください。 