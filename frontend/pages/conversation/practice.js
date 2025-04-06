import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../components/Layout';
import apiService from '../../services/api';

export default function ConversationPractice() {
  const router = useRouter();
  const { partnerId, meetingCount } = router.query;
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
        // apiService.jsを使用してデータを取得
        const partner = await apiService.partners.getPartner(partnerId);
        setPartner(partner);
        
        // 初期メッセージを追加（会合回数に基づく）
        let initialMessage = 'こんにちは！今日はどんなことについて話しましょうか？';
        
        if (meetingCount === 'first') {
          initialMessage = 'はじめまして！お会いできて嬉しいです。まずは自己紹介からお願いします。';
        } else if (meetingCount === 'other') {
          initialMessage = 'また会えましたね！最近どうでしたか？';
        }

        setMessages([
          {
            sender: 'partner',
            text: initialMessage,
          },
        ]);
      } catch (err) {
        console.error('会話相手の情報取得に失敗しました', err);
        
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth/login');
        } else {
          // エラー時はダミーデータを使用
          useDummyData();
        }
      } finally {
        setLoading(false);
      }
    };

    // APIが実装されていない場合はダミーデータを使用
    const useDummyData = () => {
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
        
        // 初期メッセージを追加（会合回数に基づく）
        let initialMessage = 'こんにちは！今日はどんなことについて話しましょうか？';
        
        if (meetingCount === 'first') {
          initialMessage = 'はじめまして！お会いできて嬉しいです。まずは自己紹介からお願いします。';
        } else if (meetingCount === 'other') {
          initialMessage = 'また会えましたね！最近どうでしたか？';
        }
        
        setMessages([
          {
            sender: 'partner',
            text: initialMessage,
          },
        ]);
      }
    };

    try {
      fetchPartner();
    } catch (error) {
      useDummyData();
      setLoading(false);
    }
  }, [partnerId, router, meetingCount]);

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

      try {
        // APIを使用して会話レスポンスを取得
        const response = await apiService.conversation.simulateConversation(
          partnerId,
          meetingCount,
          inputMessage.trim()
        );
        
        const partnerMessage = { sender: 'partner', text: response.reply };
        setMessages(prev => [...prev, partnerMessage]);
      } catch (error) {
        console.error('会話APIリクエストに失敗しました', error);
        
        // APIエラー時はシミュレーションで応答
        setTimeout(() => {
          // 会話の状況に応じた応答を生成
          let partnerResponses;
          
          if (meetingCount === 'first') {
            partnerResponses = [
              'ご自己紹介ありがとうございます！私も自己紹介させてください。',
              'なるほど、趣味や好きなことについてもう少し教えていただけますか？',
              'お仕事はどのようなことをされているんですか？',
              '初めてのお見合いでも会話が弾んで嬉しいです。',
              'そうなんですね。私も同じような経験があります。',
            ];
          } else {
            // それ以外の場合
            partnerResponses = [
              'なるほど、それは興味深いですね。もう少し詳しく教えていただけますか？',
              'それについては私も考えたことがあります。私の意見としては...',
              'そうなんですね！私も似たような経験があります。',
              'それは素晴らしいですね。他にはどんなことに興味がありますか？',
              'そのテーマについて、もう少し違う視点から考えてみるのはどうでしょう？',
              '前回お会いした時からどのような変化がありましたか？',
              'お互いのことをもっと知れて嬉しいです。',
            ];
          }
          
          // 単純な実装ではランダムに選択
          const randomResponse = partnerResponses[Math.floor(Math.random() * partnerResponses.length)];
          const partnerMessage = { sender: 'partner', text: randomResponse };
          
          setMessages(prev => [...prev, partnerMessage]);
        }, 1000);
      } finally {
        setSending(false);
      }
    } catch (err) {
      console.error('メッセージ送信に失敗しました', err);
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