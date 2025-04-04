# ベースイメージ
FROM python:3.10

# 作業ディレクトリ
WORKDIR /app

# 依存関係を先にコピーしてインストール（キャッシュ効率を良くするため）
COPY requirements.txt .

# パッケージインストール
RUN pip install --no-cache-dir -r requirements.txt

# 環境変数をDockerイメージに組み込む
ENV ENV=production
ENV FRONTEND_ORIGIN=http://localhost:3000

# アプリのコードをすべてコピー
COPY ./models ./models
COPY ./routers ./routers
COPY ./schemas ./schemas
COPY ./auth ./auth
COPY ./main.py ./
COPY ./database.py ./

# アプリ起動コマンド
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
