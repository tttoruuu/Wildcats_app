import "../styles/globals.css";
import getConfig from 'next/config';

export default function App({ Component, pageProps }) {
  // 環境変数をクライアントサイドで利用できるようにする
  const { publicRuntimeConfig } = getConfig() || {};
  
  // API URLをpropsに追加 (環境に応じて適切に設定)
  const apiUrl = (() => {
    // 1. 開発環境設定
    if (process.env.NODE_ENV !== 'production') {
      return publicRuntimeConfig?.apiUrl || 
             process.env.NEXT_PUBLIC_API_URL || 
             'http://localhost:8000';
    }
    
    // 2. 本番環境設定
    return publicRuntimeConfig?.apiUrl || 
           process.env.NEXT_PUBLIC_API_URL || 
           'https://backend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io';
  })();
  
  pageProps.apiUrl = apiUrl;
  
  // 開発用ログ
  if (typeof window !== 'undefined') {
    console.log('API URL from _app.js:', pageProps.apiUrl);
  }
  
  return <Component {...pageProps} />;
}
