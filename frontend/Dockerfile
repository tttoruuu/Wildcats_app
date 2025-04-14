# ビルドステージ
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ビルド時に環境変数を設定（デフォルト値あり）
ARG NEXT_PUBLIC_API_URL=http://backend:8000
ARG NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

# 本番ランタイムステージ
FROM node:18-alpine
WORKDIR /app

# ビルドされたアプリケーションをコピー
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/styles ./styles
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/components ./components
COPY --from=builder /app/services ./services
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.env* ./

# アプリケーションを実行
CMD ["npm", "start"]
