// 会話シミュレーション用のAPIエンドポイント
import axios from 'axios';

export default async function handler(req, res) {
  // POSTリクエストのみを受け付ける
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userInput, chatHistory, level, partnerId, meetingCount } = req.body;

    // バックエンドAPIのURLを環境変数から取得
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // トークンを取得 (フロントエンドからのリクエストに含まれていると想定)
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: '認証が必要です' });
    }

    // バックエンドAPIにリクエストを転送
    try {
      const response = await axios.post(`${apiUrl}/conversation`, {
        partnerId,
        meetingCount,
        level,
        message: userInput,
        chatHistory
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return res.status(200).json({ response: response.data.response });
    } catch (error) {
      console.error('バックエンドAPIエラー:', error);
      
      // バックエンドAPIが利用できない場合は簡易的な応答を生成
      const simpleResponses = [
        'なるほど、それは興味深いですね。',
        'それについてもっと教えていただけますか？',
        'それは素敵ですね！私も似たような経験があります。',
        'そうなんですね。どのようにして始められたのですか？',
        'それは大変でしたね。どのように乗り越えましたか？',
        'それはとても面白いですね！もっと詳しく聞かせてください。',
        'そのお話、とても素敵です。他にも何か趣味はありますか？',
        'それは素晴らしい考え方ですね。私も参考にしたいです。',
        'なるほど、その視点は考えたことがありませんでした。',
        'それはとても感動的なお話です。ありがとうございます。'
      ];
      
      const randomResponse = simpleResponses[Math.floor(Math.random() * simpleResponses.length)];
      return res.status(200).json({ response: randomResponse });
    }
  } catch (error) {
    console.error('API処理エラー:', error);
    return res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
} 