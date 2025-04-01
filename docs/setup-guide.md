# 🐳 Dockerセットアップガイド（Wildcats App）

このドキュメントは、Dockerを使ったことがない方向けに、Wildcats Appをローカルで動かす手順を丁寧に説明したセットアップガイドです。

---

## 1. Dockerって何？

Dockerは「アプリを動かすための環境まるごとパッケージ」にできる便利なツールです。  
自分のPCでも、他の人のPCでも、同じようにアプリを動かせるようになります。

---

## 2. 必要なツールをインストール

### ✅ Docker Desktop（必須）

- 公式サイト: https://www.docker.com/products/docker-desktop/
- 自分のOSに合ったバージョンをインストールしてください
- インストール後、一度再起動しておくと確実です

---

## 3. リポジトリをクローンする

git clone https://github.com/tttoruuu/Wildcats_app.git
cd Wildcats_app

## 4. .env ファイルを作成する
このプロジェクトでは、**環境変数ファイル（.env）**が各フォルダに分かれています。
それぞれ .env.example を元に .env を作成します。

cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp db/.env.example db/.env

## 5. Dockerでアプリを起動する
以下のコマンド1つで、フロントエンド / バックエンド / DB が一括で起動します：

docker compose up --build
初回はビルドに数分かかることがあります

 --いつbuild する？
　Dockerfile を変更したとき（例：パッケージ追加など）
　requirements.txt や package.json を変更したとき
　.dockerignore を追加・編集したとき
　＊コード変更のみならリアルタイムで反映されている

起動後、自動的に以下のURLにアクセスできます：

サービス名	アクセスURL
Frontend（Next.js）	http://localhost:3000
Backend（FastAPI）	http://localhost:8000/docs

## 6. アプリを止めたいとき
docker compose down
これで全てのコンテナが停止します。

7. よくあるトラブルと対処法
## 7. よくあるトラブルと対処法

| トラブル内容 | 原因 | 解決策 |
|--------------|------|--------|
| `port is already in use` | すでにそのポートを使っているアプリがある | 別のアプリを終了する or ポート番号を変更 |
| `Cannot connect to database` | `.env` の設定ミス | DBのユーザー名・パスワードが合っているか確認 |
| 起動が遅い | 初回は時間がかかる | 2回目以降は早くなります |
| `command not found: docker` | Docker未インストール | Docker Desktopをインストールしてください |
	Docker Desktopをインストールしてください
🎉 お疲れさまでした！
以上でセットアップは完了です！何か分からないことがあれば、チームに気軽に聞いてください。

## 8. データベースの中身を確認したいとき

MySQLに入ってテーブルやデータを直接確認することもできます。

# コンテナに入る
docker exec -it mysql-db mysql -u root -p
# パスワードは .env で設定した MYSQL_ROOT_PASSWORD（例: rootpass）

# 中に入ったら以下のように操作できます
USE app_db;
SHOW TABLES;
SELECT * FROM users;

