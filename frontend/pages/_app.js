import "../styles/globals.css";
import getConfig from 'next/config';

export default function App({ Component, pageProps }) {
  // 環境変数をクライアントサイドで利用できるようにする
  const { publicRuntimeConfig } = getConfig() || {};
  
  // API URLをpropsに追加 (環境に応じて適切に設定)
  const apiUrl = (() => {
    // 環境変数の取得ロジックをより明確に
    const envApiUrl = typeof process !== 'undefined' 
                      ? process.env.NEXT_PUBLIC_API_URL 
                      : null;
    const configApiUrl = publicRuntimeConfig?.apiUrl;
    
    console.log('環境情報:', {
      NODE_ENV: process.env.NODE_ENV,
      envApiUrl,
      configApiUrl
    });
    
    // 1. 開発環境設定
    if (process.env.NODE_ENV !== 'production') {
      console.log('開発環境を使用します');
      return configApiUrl || envApiUrl || 'http://localhost:8000';
    }
    
    // 2. 本番環境設定
    console.log('本番環境を使用します');
    const productionUrl = configApiUrl || 
                         envApiUrl || 
                         'https://backend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io';
    
    console.log('本番APIのURL:', productionUrl);
    return productionUrl;
  })();
  
  pageProps.apiUrl = apiUrl;
  
  // 開発用ログ
  if (typeof window !== 'undefined') {
    console.log('API URL from _app.js:', pageProps.apiUrl);
  }
  
  return <Component {...pageProps} />;
}
