# ビルドステージ
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ビルド時に環境変数を明示的に設定
ARG NEXT_PUBLIC_API_URL=https://backend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# 本番ランタイムステージ
FROM node:18-alpine
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# バックエンドのURLを明示的に設定
ARG NEXT_PUBLIC_API_URL=https://backend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

EXPOSE 3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/styles ./styles
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/components ./components
COPY --from=builder /app/services ./services
COPY --from=builder /app/next.config.js ./next.config.js

# 環境変数ファイルをコピー
COPY --from=builder /app/.env* ./

# NODE_ENVに基づいてコマンドを設定
CMD if [ "$NODE_ENV" = "production" ]; then \
        npm start; \
    else \
        npm run dev; \
    fi
