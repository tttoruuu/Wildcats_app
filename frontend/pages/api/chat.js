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

    // バックエンドAPIのURLを環境変数から取得
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log('バックエンドAPI URL:', apiUrl);
    
    // Docker内での接続のためにURLを調整
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? apiUrl 
      : apiUrl.replace('localhost', 'backend'); // Dockerコンテナ内ではサービス名で通信
    
    console.log('使用するバックエンドURL:', backendUrl);
    
    // トークンを取得 (フロントエンドからのリクエストに含まれていると想定)
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: '認証が必要です' });
    }

    // バックエンドAPIにリクエストを転送
    try {
      console.log('バックエンドAPIリクエスト送信...');
      console.log('認証ヘッダー:', `Bearer ${token.substring(0, 10)}...`);
      
      const requestData = {
        partnerId,
        meetingCount,
        level,
        message: userInput,
        chatHistory
      };
      console.log('リクエストデータ:', JSON.stringify(requestData).substring(0, 100) + '...');
      
      const response = await axios.post(`${backendUrl}/conversation`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30秒のタイムアウト
      });
      
      console.log('バックエンドAPIレスポンス:', response.data);
      return res.status(200).json({ response: response.data.response });
    } catch (error) {
      console.error('バックエンドAPIエラー:', error.message);
      
      // エラーを詳細に解析
      let errorDetail = '不明なエラー';
      if (error.response) {
        // サーバーからのレスポンスがある場合
        errorDetail = error.response.data?.detail || error.response.data?.error || '詳細不明のサーバーエラー';
        console.error('エラーレスポンス詳細:', errorDetail);
        return res.status(error.response.status).json({ error: errorDetail });
      } else if (error.request) {
        // リクエストは送信されたがレスポンスがない場合
        errorDetail = 'サーバーからの応答がありません';
        console.error('リクエストエラー:', errorDetail);
        return res.status(500).json({ error: errorDetail });
      } else {
        // その他のエラー
        errorDetail = error.message;
        console.error('その他のエラー:', errorDetail);
        return res.status(500).json({ error: errorDetail });
      }
    }
  } catch (error) {
    console.error('API処理エラー:', error);
    return res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
} 