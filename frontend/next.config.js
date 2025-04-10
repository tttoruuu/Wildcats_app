/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['ja'],
    defaultLocale: 'ja',
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // フロントエンドでのAPI URL設定を確実にするため、getInitialPropsを使ってpropsに追加
  async generateBuildId() {
    return 'build-' + new Date().toISOString();
  },
}

module.exports = nextConfig 