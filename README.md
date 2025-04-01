# Wildcats App 🐾

このアプリは、Next.js（フロントエンド）、FastAPI（バックエンド）、MySQL（データベース）を使用したフルスタックアプリケーションです。Dockerで簡単に環境構築できます。

---

## 📦 技術スタック

- Frontend: [Next.js](https://nextjs.org/)
- Backend: [FastAPI](https://fastapi.tiangolo.com/)
- Database: MySQL
- Container: Docker / Docker Compose

---

## 🛠 セットアップ手順（ローカル環境）

### 🔗 前提条件

- [Docker Desktop](https://www.docker.com/products/docker-desktop) をインストール済み
- [Git](https://git-scm.com/) をインストール済み

---

### 🧾 1. リポジトリをクローン

git clone https://github.com/tttoruuu/Wildcats_app.git
cd Wildcats_app

### ⚙️ 2. 環境変数を設定
各ディレクトリに .env.example ファイルが用意されています。以下のコマンドで .env を作成してください：

cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp db/.env.example db/.env
必要に応じて値を調整してください（例：データベースのパスワードなど）。

🐳 3. Dockerコンテナをビルド・起動
docker compose up --build
🌐 4. アプリにアクセス
フロントエンド: http://localhost:3000

バックエンド API: http://localhost:8000/docs（Swagger UI）

🧹 停止・クリーンアップ
docker compose down

🧑‍🏫 初めてDockerを使う方へ
docs/setup-guide.md にDockerの基本と開発環境の立ち上げ手順をわかりやすくまとめています。ぜひご覧ください。

📂 ディレクトリ構成（例）
bash
コピーする
編集する
Wildcats_app/
├── frontend/           # Next.js
├── backend/            # FastAPI
├── db/                 # MySQL 初期設定など
├── docker-compose.yml  # Docker全体構成
├── .gitignore
└── README.md
📄 ライセンス
MIT License


### 🗃 5. データベースの初期データについて

初回起動時、MySQLのデータベースには自動的に初期データ（`users` テーブルとサンプルユーザー）が登録されます。  
これらの初期データは `db/init/init.sql` に定義されています。

```sql
-- 初期データ例
INSERT INTO users (name, email) VALUES
('山田 太郎', 'yamada@example.com'),
('佐藤 花子', 'sato@example.com');

---

## ✅ この後やると完璧なこと

- `docs/setup-guide.md` の作成（Docker初心者向け）
- ER図や機能設計書があれば `docs/` フォルダに追加
- CI/CDや開発フローを後々追記

---

このREADME、プロジェクトに合わせて調整もできます。  
**気になるところやカスタマイズしたいところがあれば教えてください！**  
→ そのまま `README.md` として保存してコミットできるように整えます👍