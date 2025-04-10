import "../styles/globals.css";
import getConfig from 'next/config';

export default function App({ Component, pageProps }) {
  // 環境変数をクライアントサイドで利用できるようにする
  const { publicRuntimeConfig } = getConfig() || {};
  
  // API URLをpropsに追加
  pageProps.apiUrl = publicRuntimeConfig?.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'https://backend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io';
  
  // 開発用ログ
  if (typeof window !== 'undefined') {
    console.log('API URL from _app.js:', pageProps.apiUrl);
  }
  
  return <Component {...pageProps} />;
}
