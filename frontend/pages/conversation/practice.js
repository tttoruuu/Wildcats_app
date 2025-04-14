import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { ArrowLeft } from 'lucide-react';

export default function ConversationPractice() {
  const router = useRouter();
  const { partnerId, meetingCount, scenario, rallyCount, conversation } = router.query;
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
  const [error, setError] = useState('');

  useEffect(() => {
    if (rallyCount) {
      const parsedRallyCount = parseInt(rallyCount);
      if (!isNaN(parsedRallyCount) && parsedRallyCount >= 5 && parsedRallyCount <= 12) {
        setMaxRallyCount(parsedRallyCount);
      }
    }
  }, [rallyCount]);

  // URLクエリから会話履歴を復元
  useEffect(() => {
    if (conversation) {
      try {
        const parsedConversation = JSON.parse(conversation);
        if (Array.isArray(parsedConversation) && parsedConversation.length > 0) {
          setMessages(parsedConversation);
          // ラリー数も復元
          const userMessageCount = parsedConversation.filter(msg => msg.sender === 'user').length;
          setCurrentRallyCount(userMessageCount);
          // ラリー数が上限に達していたらフィードバックボタンを表示
          if (userMessageCount >= maxRallyCount) {
            setShowFeedbackButton(true);
          }
        }
      } catch (err) {
        console.error('会話履歴の解析に失敗しました', err);
      }
    }
  }, [conversation, maxRallyCount]);

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
        
        // 会話履歴がURLから復元されていない場合のみ初期メッセージを設定
        if (messages.length === 0) {
          // 話題のリストを定義
          const level1Topics = [
            '趣味や休日の過ごし方について教えていただけますか？',
            '出身はどちらですか？学生時代の思い出などあれば教えてください。',
            'ご家族のことについて少し教えていただけますか？',
            '最近行かれた素敵なお店などはありますか？',
            '旅行で行ってみたい場所はありますか？',
            'お仕事でのやりがいについて教えていただけますか？',
            '好きな食べ物や行きつけのお店などはありますか？'
          ];
          
          const level2Topics = [
            '日々の暮らしのスタイルについて、朝は何時頃起きることが多いですか？',
            '理想の結婚生活について、住みたい場所や共働きについてどう考えていますか？',
            'ご家族との関係はどのような感じですか？家族の行事などはありますか？',
            'お金の使い方について少し聞かせていただけますか？貯金はどのくらい意識されていますか？',
            '将来の夢や理想のライフスタイルについて聞かせていただけませんか？',
            'もし子どもができたら、一緒にどんなことをしたいですか？何か考えていることはありますか？',
            '料理や家事について、こだわりや逆に苦手なことはありますか？',
            '結婚後も大事にしたい趣味や時間ってありますか？',
            'パートナーとの理想の関わり方について、どのようなことをされると嬉しいと感じますか？'
          ];
          
          // 会合回数とレベルに基づいてランダムな話題を選択
          let randomTopic = '';
          let initialMessage = '';
          if (meetingCount === 'first') {
            randomTopic = level === 1
              ? level1Topics[Math.floor(Math.random() * level1Topics.length)]
              : level2Topics[Math.floor(Math.random() * level2Topics.length)];
              
            let greeting = level === 1
              ? 'はじめまして、お会いできて嬉しいです。'
              : 'はじめまして、お会いできて嬉しいです。お互いのことを知っていければと思います。';
              
            initialMessage = `${greeting} ${randomTopic} 😊`;
          } else {
            randomTopic = level === 1
              ? level1Topics[Math.floor(Math.random() * level1Topics.length)]
              : level2Topics[Math.floor(Math.random() * level2Topics.length)];
              
            let greeting = level === 1
              ? 'また会えて嬉しいです。'
              : 'また会えて嬉しいです。前回はとても楽しかったです。今日はもっとお話しできるのを楽しみにしていました。';
              
            initialMessage = `${greeting} ${randomTopic} 😊`;
          }

          setMessages([
            {
              sender: 'partner',
              text: initialMessage,
            },
          ]);
        }
      } catch (err) {
        console.error('会話相手の情報取得に失敗しました', err);
        
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth/login');
        } else {
          // APIエラー時は空データを設定
          setPartner(null);
          setError('会話相手の情報を取得できませんでした。');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
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
        const response = await apiService.conversation.simulateConversation(
          partnerId,
          meetingCount,
          level,
          inputMessage.trim(),
          formattedHistory
        );

        console.log('API応答:', response);

        // APIが正常応答を返したか確認
        if (response && response.response) {
          // サーバーからのフォールバックレスポンスかどうかをチェック
          const fallbackKeywords = [
            "サーバーが混雑", "通信エラー", "ネットワークに問題", "時間をおいて", 
            "少し考え中", "うまく言葉が見つかりません", "少し疲れてしまいました"
          ];
          
          const isLikelyFallback = fallbackKeywords.some(keyword => 
            response.response.includes(keyword)
          );
          
          if (isLikelyFallback) {
            console.warn('フォールバック応答を検出:', response.response);
          }
          
          const partnerMessage = { 
            sender: 'partner', 
            text: response.response,
            isFallback: isLikelyFallback
          };
          setMessages(prev => [...prev, partnerMessage]);
        } else {
          console.error('API応答フォーマットが不正です:', response);
          throw new Error('API応答フォーマットが不正です');
        }
      } catch (error) {
        console.error('ChatGPT APIリクエストに失敗しました', error);
        
        // エラーの詳細情報をログに出力
        let errorDetail = '不明なエラー';
        if (error.response) {
          // サーバーからのエラーレスポンス
          errorDetail = error.response.data?.error || '詳細不明のサーバーエラー';
        } else if (error.request) {
          // リクエスト送信後、レスポンスが返ってこない
          errorDetail = 'サーバーからの応答がありません';
        } else {
          // その他のエラー
          errorDetail = error.message;
        }
        console.error('詳細なエラー情報:', errorDetail);
        
        // エラーメッセージを画面に表示
        const errorMessage = { 
          sender: 'system', 
          text: `エラーが発生しました: ${errorDetail}。もう一度お試しください。` 
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setSending(false);
      }
    } catch (err) {
      console.error('メッセージ送信に失敗しました', err);
      setSending(false);
    }
  };

  const handleGetFeedback = () => {
    // 会話履歴をJSON文字列に変換して渡す
    const messagesJson = JSON.stringify(messages);
    
    // フィードバックページに遷移
    router.push({
      pathname: '/conversation/feedback',
      query: { 
        partnerId,
        meetingCount,
        rallyCount: maxRallyCount,
        conversation: messagesJson
      }
    });
  };

  if (loading) {
    return (
      <Layout title="会話練習" hideHeader={true}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] text-gray-800 px-4 sm:px-6 py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8551] mx-auto"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </Layout>
    );
  }

  if (!partner) {
    return (
      <Layout title="会話練習" hideHeader={true}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] text-gray-800 px-4 sm:px-6 py-4">
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
      <div 
        className="flex flex-col items-center min-h-screen bg-[#F5F5F5] text-gray-800 px-4 sm:px-6 py-4"
        style={{
          backgroundImage: `url('/images/back.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundBlendMode: 'overlay'
        }}
      >
        {/* ヘッダー */}
        <div className="w-full max-w-md mt-8 relative">
          <button
            onClick={() => router.push('/conversation')}
            className="text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-0"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
          <div className="text-center mt-10">
            <h1 className="text-xl font-semibold text-gray-800">{partner.name}</h1>
            <p className="text-sm text-gray-500">
              {partner.age}歳 • {partner.gender === 'female' ? '女性' : partner.gender === 'male' ? '男性' : 'その他'} • {partner.occupation}
            </p>
          </div>
        </div>

        {/* メッセージエリア */}
        <div className="w-full max-w-md flex-grow mt-4 overflow-y-auto">
          <div className="space-y-4">
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
              <div className="flex justify-center mt-4 mb-4">
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
        <div className="w-full max-w-md bg-white/90 p-4 rounded-xl border border-white/40 shadow-sm mb-4">
          <div className="flex">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
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