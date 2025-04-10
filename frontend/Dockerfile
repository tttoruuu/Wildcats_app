# ビルドステージ
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 本番ランタイムステージ
FROM node:18-alpine
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
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
