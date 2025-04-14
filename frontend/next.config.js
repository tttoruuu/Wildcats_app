/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['ja'],
    defaultLocale: 'ja',
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ? 
      (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_API_URL.startsWith('http:') ? 
        process.env.NEXT_PUBLIC_API_URL.replace('http:', 'https:') : 
        process.env.NEXT_PUBLIC_API_URL) :
      (process.env.NODE_ENV === 'production'
        ? 'https://backend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io'
        : 'http://localhost:8000'
    ),
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ? 
      (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_API_URL.startsWith('http:') ? 
        process.env.NEXT_PUBLIC_API_URL.replace('http:', 'https:') : 
        process.env.NEXT_PUBLIC_API_URL) :
      (process.env.NODE_ENV === 'production'
        ? 'https://backend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io'
        : 'http://localhost:8000'
    ),
    environment: process.env.NODE_ENV || 'development',
  },
  async generateBuildId() {
    return 'build-' + new Date().toISOString();
  },
}

module.exports = nextConfig