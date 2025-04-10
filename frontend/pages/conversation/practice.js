import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { ArrowLeft } from 'lucide-react';

export default function ConversationPractice() {
  const router = useRouter();
  const { partnerId, meetingCount, scenario, rallyCount } = router.query;
  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [level, setLevel] = useState(1);
  const [currentRallyCount, setCurrentRallyCount] = useState(0);
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);
  const [maxRallyCount, setMaxRallyCount] = useState(8);

  useEffect(() => {
    if (rallyCount) {
      const parsedRallyCount = parseInt(rallyCount);
      if (!isNaN(parsedRallyCount) && parsedRallyCount >= 5 && parsedRallyCount <= 12) {
        setMaxRallyCount(parsedRallyCount);
      }
    }
  }, [rallyCount]);

  useEffect(() => {
    if (meetingCount) {
      const newLevel = meetingCount === 'first' ? 1 : 2;
      setLevel(newLevel);
    }
  }, [meetingCount]);

  useEffect(() => {
    if (!partnerId) return;

    const fetchPartner = async () => {
      try {
        // apiService.jsを使用してデータを取得
        const partner = await apiService.partners.getPartner(partnerId);
        setPartner(partner);
        
        // 初期メッセージを追加（会合回数とレベルに基づく）
        let initialMessage = '';
        
        if (meetingCount === 'first') {
          initialMessage = level === 1
            ? 'はじめまして、初めてお会いできて嬉しいです。どうぞよろしくお願いします。😊'
            : 'はじめまして、お会いできて嬉しいです。お互いのことを知っていければと思います。趣味や興味のあることなど、お話できたら嬉しいです。どうぞよろしくお願いします。😊';
        } else {
          initialMessage = level === 1
            ? 'また会えて嬉しいです。最近はいかがお過ごしですか？'
            : 'また会えて嬉しいです。前回はとても楽しかったです。今日はどんなお話ができるか楽しみにしていました。😊';
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
        
        // 初期メッセージを追加（会合回数とレベルに基づく）
        let initialMessage = '';
        
        if (meetingCount === 'first') {
          initialMessage = level === 1
            ? 'はじめまして、初めてお会いできて嬉しいです。どうぞよろしくお願いします。😊'
            : 'はじめまして、お会いできて嬉しいです。お互いのことを知っていければと思います。趣味や興味のあることなど、お話できたら嬉しいです。どうぞよろしくお願いします。😊';
        } else {
          initialMessage = level === 1
            ? 'また会えて嬉しいです。最近はいかがお過ごしですか？'
            : 'また会えて嬉しいです。前回はとても楽しかったです。今日はどんなお話ができるか楽しみにしていました。😊';
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
  }, [partnerId, router, meetingCount, level]);

  // スクロールを最下部に自動調整
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ラリー数をカウントして制限に達したらフィードバックボタンを表示
  useEffect(() => {
    // ユーザーとパートナーのメッセージペアをカウント（初期メッセージは除く）
    // ユーザーのメッセージ数をカウント（パートナーの初期メッセージ以外）
    const userMessageCount = messages.filter(msg => msg.sender === 'user').length;
    
    // 最初のメッセージはカウントしない
    if (userMessageCount > 0) {
      // ラリー数 = ユーザーのメッセージ数（パートナーの応答があると仮定）
      setCurrentRallyCount(userMessageCount);
    }

    // 設定されたラリー数に達したらフィードバックボタンを表示
    if (userMessageCount >= maxRallyCount) {
      setShowFeedbackButton(true);
    }
  }, [messages, maxRallyCount]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sending) return;
    
    // ラリー数が最大に達している場合は送信しない
    if (currentRallyCount >= maxRallyCount) {
      return;
    }

    try {
      setSending(true);
      
      // ユーザーのメッセージを追加
      const userMessage = { sender: 'user', text: inputMessage.trim() };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      try {
        // トークンを取得
        const token = localStorage.getItem('token');
        console.log('認証トークン確認:', token ? `${token.substring(0, 10)}...` : 'トークンなし');
        
        // 会話履歴をAPIで使用できる形式に変換
        const formattedHistory = messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
        
        console.log('API呼び出し準備:', { 
          inputMessage: inputMessage.trim(),
          historyLength: formattedHistory.length,
          partnerId,
          meetingCount,
          level
        });
        
        // ChatGPT APIを利用するエンドポイントを呼び出し
        const response = await axios.post('/api/chat', {
          userInput: inputMessage.trim(),
          chatHistory: formattedHistory,
          level,
          partnerId,
          meetingCount
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // タイムアウトを30秒に設定
        });
        
        console.log('API応答:', response.data);
        
        if (response.data.response) {
          const partnerMessage = { sender: 'partner', text: response.data.response };
          setMessages(prev => [...prev, partnerMessage]);
        }
      } catch (error) {
        console.error('ChatGPT APIリクエストに失敗しました', error);
        
        // エラーメッセージを詳細に表示
        let errorMsg = 'APIリクエストに失敗しました。';
        
        if (error.response) {
          // サーバーからのレスポンスがある場合
          const statusCode = error.response.status;
          const errorDetail = error.response.data?.error || error.response.data?.detail || '';
          
          if (statusCode === 401) {
            // 認証エラーの場合はログイン画面にリダイレクト
            localStorage.removeItem('token');
            router.push('/auth/login');
            return;
          }
          
          errorMsg = `エラー(${statusCode}): ${errorDetail}`;
          console.error('詳細なエラー情報:', errorDetail);
        } else if (error.request) {
          // リクエストは送信されたがレスポンスがない場合
          errorMsg = 'サーバーからの応答がありません。ネットワーク接続を確認してください。';
          console.error('リクエストエラー:', error.request);
        } else {
          // リクエスト設定時のエラー
          errorMsg = `リクエストエラー: ${error.message}`;
          console.error('その他のエラー:', error.message);
        }
        
        // エラーメッセージをシステムメッセージとして表示
        const systemMessage = { 
          sender: 'system', 
          text: errorMsg
        };
        setMessages(prev => [...prev, systemMessage]);
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

  const handleGetFeedback = () => {
    // フィードバックページに遷移
    router.push({
      pathname: '/conversation/feedback',
      query: { 
        partnerId,
        meetingCount,
        rallyCount: maxRallyCount
      }
    });
  };

  if (loading) {
    return (
      <Layout title="会話練習" hideHeader={true}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] text-gray-800 px-6 py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8551] mx-auto"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </Layout>
    );
  }

  if (!partner) {
    return (
      <Layout title="会話練習" hideHeader={true}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] text-gray-800 px-6 py-4">
          <p className="mb-4">会話相手が見つかりませんでした</p>
          <button
            onClick={() => router.push('/conversation')}
            className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-2 px-6 hover:opacity-90 shadow-sm"
          >
            戻る
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${partner.name}との会話`} hideHeader={true}>
      <div className="flex flex-col min-h-screen bg-[#F5F5F5] text-gray-800">
        {/* ヘッダー */}
        <div className="bg-transparent pt-4 p-4 flex items-center">
          <button
            onClick={() => router.push('/conversation')}
            className="mr-4 text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">{partner.name}</h1>
            <p className="text-xs text-gray-500">
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
                      ? 'bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white'
                      : message.sender === 'system'
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 backdrop-blur-sm border border-white/40 text-gray-800 shadow-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {/* ラリー数表示 */}
            <div className="text-center text-sm text-gray-500 mt-2">
              会話ラリー数: {currentRallyCount} / {maxRallyCount}
            </div>
            
            {/* フィードバックボタン */}
            {showFeedbackButton && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleGetFeedback}
                  className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-2 px-6 hover:opacity-90 shadow-sm"
                >
                  フィードバックをもらう
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 入力エリア */}
        <div className="bg-white/90 p-4 border-t border-gray-100 shadow-sm">
          <div className="max-w-md mx-auto flex">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={showFeedbackButton ? "ラリー数の上限に達しました" : "メッセージを入力..."}
              className={`flex-grow bg-[#FAFAFA] text-gray-800 rounded-l-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#FF8551] border border-gray-200 ${showFeedbackButton ? 'opacity-50 cursor-not-allowed' : ''}`}
              rows="2"
              disabled={showFeedbackButton}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sending || showFeedbackButton}
              className={`bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-r-xl px-4 ${
                !inputMessage.trim() || sending || showFeedbackButton
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90'
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