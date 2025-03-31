# 開発ビルドステージ
FROM node:18 AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > .env.production

COPY . .
RUN npm install
RUN npm run build

# 本番ランタイムステージ
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app .
RUN npm install --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
