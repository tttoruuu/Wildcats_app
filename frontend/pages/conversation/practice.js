import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../components/Layout';

export default function ConversationPractice() {
  const router = useRouter();
  const { partnerId } = router.query;
  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!partnerId) return;

    const fetchPartner = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // APIエンドポイントはバックエンドの実装に合わせて変更
        const response = await axios.get(`http://localhost:8000/conversation-partners/${partnerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPartner(response.data);
        
        // 初期メッセージを追加
        setMessages([
          {
            sender: 'partner',
            text: 'こんにちは！今日はどんなことについて話しましょうか？',
          },
        ]);
      } catch (err) {
        console.error('会話相手の情報取得に失敗しました', err);
        
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth/login');
        } else {
          router.push('/conversation');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [partnerId, router]);

  // ダミーデータ（バックエンドAPI実装までの仮実装）
  useEffect(() => {
    if (partnerId && loading && !partner) {
      // ID に基づいてダミーデータから相手を検索
      const dummyPartners = [
        { id: '1', name: 'あいさん', age: 24, gender: 'female', occupation: '看護師', personality: '明るく社交的' },
        { id: '2', name: 'ゆうりさん', age: 28, gender: 'female', occupation: 'デザイナー', personality: '冷静で論理的' },
        { id: '3', name: 'しおりさん', age: 22, gender: 'female', occupation: '学生', personality: '好奇心旺盛' },
        { id: '4', name: 'かおりさん', age: 30, gender: 'female', occupation: '会社員', personality: '優しくて思いやりがある' },
        { id: '5', name: 'なつみさん', age: 26, gender: 'female', occupation: 'フリーランス', personality: '創造的で自由な発想の持ち主' },
      ];
      
      const foundPartner = dummyPartners.find(p => p.id === partnerId);
      if (foundPartner) {
        setPartner(foundPartner);
        // 初期メッセージを追加
        setMessages([
          {
            sender: 'partner',
            text: 'こんにちは！今日はどんなことについて話しましょうか？',
          },
        ]);
      }
      setLoading(false);
    }
  }, [partnerId, loading, partner]);

  // スクロールを最下部に自動調整
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    try {
      setSending(true);
      
      // ユーザーのメッセージを追加
      const userMessage = { sender: 'user', text: inputMessage.trim() };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      // 実際の実装では、APIを呼び出してChatGPTからの応答を取得
      // ここではシンプルな応答をシミュレート
      setTimeout(() => {
        const partnerResponses = [
          'なるほど、それは興味深いですね。もう少し詳しく教えてもらえますか？',
          'それについては私も考えたことがあります。私の意見としては...',
          'そうなんですね！私も似たような経験があります。',
          'それは素晴らしいですね。他にはどんなことに興味がありますか？',
          'そのテーマについて、もう少し違う視点から考えてみるのはどうでしょう？',
        ];
        
        const randomResponse = partnerResponses[Math.floor(Math.random() * partnerResponses.length)];
        const partnerMessage = { sender: 'partner', text: randomResponse };
        
        setMessages(prev => [...prev, partnerMessage]);
        setSending(false);
      }, 1000);

      // 実際のAPIリクエスト例（バックエンド実装時に有効化）
      /*
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/conversation',
        {
          partnerId,
          message: inputMessage.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const partnerMessage = { sender: 'partner', text: response.data.reply };
      setMessages(prev => [...prev, partnerMessage]);
      */
    } catch (err) {
      console.error('メッセージの送信に失敗しました', err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Layout title="会話練習">
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
          <p>読み込み中...</p>
        </div>
      </Layout>
    );
  }

  if (!partner) {
    return (
      <Layout title="会話練習">
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
          <p className="mb-4">会話相手が見つかりませんでした</p>
          <button
            onClick={() => router.push('/conversation')}
            className="bg-orange-300 text-white rounded-full py-2 px-6 hover:bg-orange-400"
          >
            戻る
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${partner.name}との会話`}>
      <div className="flex flex-col min-h-screen bg-gray-800 text-white">
        {/* ヘッダー */}
        <div className="bg-gray-900 p-4 flex items-center border-b border-gray-700">
          <button
            onClick={() => router.push('/conversation')}
            className="mr-4 text-gray-400 hover:text-white"
          >
            ←
          </button>
          <div>
            <h1 className="text-lg font-semibold">{partner.name}</h1>
            <p className="text-xs text-gray-400">
              {partner.age}歳 • {partner.gender === 'female' ? '女性' : partner.gender === 'male' ? '男性' : 'その他'} • {partner.occupation}
            </p>
          </div>
        </div>

        {/* メッセージエリア */}
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="max-w-md mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 入力エリア */}
        <div className="bg-gray-900 p-4 border-t border-gray-700">
          <div className="max-w-md mx-auto flex">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="メッセージを入力..."
              className="flex-grow bg-gray-700 text-white rounded-l-lg p-3 focus:outline-none"
              rows="2"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sending}
              className={`bg-orange-500 text-white rounded-r-lg px-4 ${
                !inputMessage.trim() || sending
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-orange-600'
              }`}
            >
              送信
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 