// 会話シミュレーション用のAPIエンドポイント
import axios from 'axios';

export default async function handler(req, res) {
  // POSTリクエストのみを受け付ける
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userInput, chatHistory, level, partnerId, meetingCount } = req.body;

    // リクエストデータをデバッグ用に出力
    console.log('リクエストデータ:', { 
      userInput, 
      chatHistory: Array.isArray(chatHistory) ? chatHistory.length : 'undefined',
      level, 
      partnerId, 
      meetingCount 
    });

    // バックエンドAPIのURLを環境に応じて適切に設定
    const backendUrl = (() => {
      // 基本URL
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('ベースAPI URL:', baseUrl);
      
      // 1. 本番環境での設定
      if (process.env.NODE_ENV === 'production') {
        // Kubernetes環境
        if (baseUrl.includes('svc.cluster.local')) {
          return baseUrl;
        }
        // その他の本番環境 - そのまま使用
        return baseUrl;
      }
      
      // 2. 開発環境での設定
      // Docker開発環境内からのアクセス (サーバーサイド)
      if (process.env.KUBERNETES_SERVICE_HOST || !baseUrl.includes('backend:8000')) {
        return baseUrl;
      }
      
      // ブラウザからアクセスの場合 - backend:8000 -> localhost:8000 に置換
      return baseUrl.replace('http://backend:8000', 'http://localhost:8000');
    })();
    
    console.log('使用するバックエンドURL:', backendUrl);
    
    // トークンを取得 (フロントエンドからのリクエストに含まれていると想定)
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: '認証が必要です' });
    }

    // バックエンドAPIにリクエストを転送
    console.log('バックエンドAPIリクエスト送信...');
    console.log('認証ヘッダー:', `Bearer ${token.substring(0, 10)}...`);
    
    const requestData = {
      partnerId,
      meetingCount,
      level,
      message: userInput,
      chatHistory: limitChatHistory(chatHistory)
    };
    console.log('リクエストデータ:', JSON.stringify(requestData).substring(0, 100) + '...');
    
    // 会話履歴を最適化する関数（コンテキストを維持しつつ履歴を短くする）
    function limitChatHistory(history) {
      if (!history || !Array.isArray(history)) return [];
      
      // 履歴が短い場合はそのまま返す
      if (history.length <= 6) return history;
      
      console.log(`会話履歴を最適化: ${history.length}件 → 最新の6件に限定`);
      
      // 最新の6件に限定 (新しい3組の会話ペア)
      return history.slice(-6);
    }
    
    // タイムアウトを120秒に延長し、再試行オプションを追加
    const axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 120000, // 120秒のタイムアウト
      // アクセスエラー時の再試行設定
      validateStatus: function (status) {
        return status >= 200 && status < 600; // すべてのステータスコードを許可して自前でハンドリング
      }
    };
    
    console.log('Axiosリクエスト設定:', JSON.stringify(axiosConfig));
    
    // バックエンドAPIにリクエスト送信
    const endpointPath = '/conversation';  // 元の会話APIエンドポイントを使用
    console.log(`${backendUrl}${endpointPath} へリクエスト送信中...`);
    
    let retryCount = 0;
    const maxRetries = 2; // 最大2回再試行に増やす
    
    // 応答を受け取るまで試行する関数
    const makeRequestWithRetry = async () => {
      try {
        const response = await axios.post(`${backendUrl}${endpointPath}`, requestData, axiosConfig);
        
        if (response.status !== 200) {
          throw { 
            response, 
            message: `サーバーからエラーレスポンスを受信: ${response.status}` 
          };
        }
        
        console.log('バックエンドAPIレスポンス:', response.data);
        return response;
      } catch (error) {
        console.error(`API呼び出しエラー (試行 ${retryCount + 1}/${maxRetries + 1}):`, error.message);
        
        if (retryCount < maxRetries && 
            (error.code === 'ECONNABORTED' || 
             error.code === 'ETIMEDOUT' || 
             !error.response)) {
          // タイムアウトまたは接続エラーの場合、再試行
          retryCount++;
          console.log(`再試行 ${retryCount}/${maxRetries}...`);
          return await makeRequestWithRetry();
        }
        
        // 再試行回数を超えた場合はエラーを投げる
        throw error;
      }
    };
    
    try {
      const response = await makeRequestWithRetry();
      return res.status(200).json({ response: response.data.response });
    } catch (error) {
      // 全ての再試行が失敗した場合のフォールバック処理
      console.error('すべての再試行が失敗しました:', error.message);
      
      // エラーの詳細情報をログに出力
      let errorDetail = '不明なエラー';
      if (error.response) {
        console.error('エラーステータス:', error.response.status);
        console.error('エラーヘッダー:', JSON.stringify(error.response.headers));
        console.error('エラーデータ:', JSON.stringify(error.response.data));
        errorDetail = error.response.data?.detail || error.response.data?.error || '詳細不明のサーバーエラー';
      } else if (error.request) {
        errorDetail = 'サーバーからの応答がありません';
      } else {
        errorDetail = error.message;
      }
      console.error('詳細なエラー情報:', errorDetail);
      
      // フォールバック応答を返す
      const fallbackResponses = [
        "申し訳ありません、サーバーが混雑しているようです。少し時間をおいてもう一度お試しください。",
        "ネットワークに問題が発生しています。時間をおいて再度お試しください。",
        "一時的な通信エラーが発生しました。しばらくしてからもう一度お試しください。"
      ];
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return res.status(200).json({ response: fallbackResponse });
    }
  } catch (error) {
    console.error('API処理エラー:', error);
    return res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
} 