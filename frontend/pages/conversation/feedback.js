import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import Link from 'next/link';
import { HomeIcon, User, Star, Check, CheckCircle, XCircle, Heart, BookOpen, List, ArrowLeft } from 'lucide-react';

export default function ConversationFeedback() {
  const router = useRouter();
  const { partnerId, meetingCount, rallyCount, conversation } = router.query;
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkboxes, setCheckboxes] = useState({});
  // 会話履歴を保持するための状態
  const [messages, setMessages] = useState([]);
  // フィードバック情報
  const [feedback, setFeedback] = useState(null);
  // フィードバック読み込み状態
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  
  // チェックされた項目を保存するための状態
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    // URLクエリから会話履歴が渡されていれば、それを解析して状態に設定
    if (conversation) {
      try {
        const parsedConversation = JSON.parse(conversation);
        setMessages(parsedConversation);
      } catch (err) {
        console.error('会話履歴の解析に失敗しました', err);
      }
    }
  }, [conversation]);

  // パートナー情報とフィードバックの取得
  useEffect(() => {
    if (!partnerId || !messages.length) return;

    const fetchPartnerAndFeedback = async () => {
      try {
        setLoading(true);
        setLoadingFeedback(true);
        
        // パートナー情報を取得
        let partnerData;
        try {
          partnerData = await apiService.partners.getPartner(partnerId);
          setPartner(partnerData);
          setError(null);
        } catch (partnerError) {
          console.error('会話相手の情報取得に失敗しました', partnerError);

          if (partnerError.response && partnerError.response.status === 401) {
            localStorage.removeItem('token');
            router.push('/auth/login');
            return;
          } else {
            setError('相手の情報を取得できませんでした。');
            // データ取得失敗時は空データを設定
            setPartner(null);
          }
        }
        
        // フィードバック生成
        try {
          // フィードバックを生成
          const feedbackData = await apiService.conversation.generateFeedback(
            messages,
            partnerId,
            meetingCount
          );
          
          // フィードバックのステートを更新
          setFeedback(feedbackData);
          
          // フィードバック項目から自動的にチェックボックスを設定
          const newCheckboxes = {};
          // 良かった点を自動的にチェック
          feedbackData.encouragement.forEach((point, i) => {
            newCheckboxes[`0-${i}`] = false;
          });
          // 改善点をチェック
          feedbackData.advice.forEach((point, i) => {
            newCheckboxes[`1-${i}`] = false;
          });
          setCheckboxes(newCheckboxes);
          
          // チェックされた項目のリストも更新
          const items = [];
          setCheckedItems(items);
          
        } catch (feedbackError) {
          console.error('フィードバック生成に失敗しました:', feedbackError);
          setError('フィードバックの生成中にエラーが発生しました。');
        }
        
      } catch (err) {
        console.error('フィードバック全体の処理に失敗しました', err);
        setError('フィードバックの生成中にエラーが発生しました。');
      } finally {
        setLoading(false);
        setLoadingFeedback(false);
      }
    };

    fetchPartnerAndFeedback();
  }, [partnerId, messages, meetingCount, router]);

  const handleCheckboxChange = (categoryIndex, itemIndex, text) => {
    const key = `${categoryIndex}-${itemIndex}`;
    
    // チェックボックスの状態を更新
    setCheckboxes(prev => {
      const newState = {
        ...prev,
        [key]: !prev[key]
      };
      
      // チェックされた項目のリストを更新
      const newCheckedItems = [...checkedItems];
      
      if (newState[key]) {
        // 追加
        newCheckedItems.push({ 
          id: key, 
          category: feedbackItems[categoryIndex].title, 
          text: text,
          date: new Date().toISOString()
        });
      } else {
        // 削除
        const index = newCheckedItems.findIndex(item => item.id === key);
        if (index !== -1) {
          newCheckedItems.splice(index, 1);
        }
      }
      
      console.log('チェック項目更新:', newCheckedItems.length, 'アイテム');
      setCheckedItems(newCheckedItems);
      return newState;
    });
  };
  
  // チェックリストに登録する関数
  const saveToChecklist = () => {
    // ローカルストレージに保存（実際のアプリではAPIに送信する）
    const existingData = JSON.parse(localStorage.getItem('feedbackChecklist') || '[]');
    const newData = [...existingData, ...checkedItems];
    localStorage.setItem('feedbackChecklist', JSON.stringify(newData));
    
    // チェックリスト画面（まだ存在しない場合は作成する必要あり）に遷移
    router.push('/checklist');
  };
  
  // スコアに基づいた評価メッセージを取得
  const getEvaluationMessage = (score) => {
    if (score >= 90) return { emoji: '😊', message: 'すごく自然な会話だった〜！その調子！' };
    if (score >= 70) return { emoji: '😎', message: '落ち着いて話せていてGood！とてもスムーズな会話だったよ。' };
    if (score >= 50) return { emoji: '🤔', message: '会話の流れはいい感じ！もう少し深掘りしてみよう！' };
    if (score >= 30) return { emoji: '😅', message: '緊張してたけど頑張ってたね！次はリラックスしてみよう！' };
    return { emoji: '😮', message: '面白い発言で場が盛り上がったね！意外性がいい感じ！' };
  };
  
  // 評価メッセージを取得
  const evaluation = feedback ? getEvaluationMessage(feedback.score) : { emoji: '🤔', message: '会話の流れはいい感じ！' };

  const feedbackItems = feedback ? [
    {
      title: '良かった点',
      icon: <Heart className="w-5 h-5 text-[#FF8551]" />,
      points: feedback.encouragement
    },
    {
      title: '改善点',
      icon: <XCircle className="w-5 h-5 text-[#FF8551]" />,
      points: feedback.advice
    }
  ] : [
    {
      title: '良かった点',
      icon: <Heart className="w-5 h-5 text-[#FF8551]" />,
      points: [
        '質問に丁寧に答えていた',
        '会話を続けようとする姿勢が良かった', 
        '自己開示ができていた'
      ]
    },
    {
      title: '改善点',
      icon: <XCircle className="w-5 h-5 text-[#FF8551]" />,
      points: [
        '質問のバリエーションを増やすと良い',
        '相手の話に共感を示すとより良い',
        'もう少し会話を深掘りしてみよう'
      ]
    }
  ];
  return (
    <Layout title="会話フィードバック" hideHeader={true}>
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
            onClick={() => router.back()}
            className="text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-0"
            aria-label="戻る"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
          <h1 className="text-2xl font-bold mt-16 mb-8 text-center text-[#FF8551]">FEEDBACK📝</h1>
        </div>

        {/* スコア表示 */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-[#FF8551]/90 to-[#FFA46D]/90 backdrop-blur-sm">
            <div className="text-center text-white">
              <p className="text-base sm:text-xl font-semibold flex items-center justify-center">
                <span className="mr-3 text-2xl sm:text-4xl">{evaluation.emoji}</span> 
                {evaluation.message}
              </p>
            </div>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="w-full max-w-md">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8551] mx-auto"></div>
              <p className="mt-4 text-gray-600">情報を読み込み中...</p>
            </div>
          ) : loadingFeedback ? (
            <div className="space-y-4">
              {/* スケルトンローダー */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-white/40 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-4 h-4 rounded-full bg-gray-200"></div>
                    ))}
                  </div>
                </div>
                <div className="h-20 bg-gray-100 rounded-xl"></div>
              </div>
              
              {/* フィードバック項目のスケルトン */}
              {[1, 2].map(i => (
                <div key={i} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-white/40 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-100 rounded-xl"></div>
                    <div className="h-8 bg-gray-100 rounded-xl"></div>
                    <div className="h-8 bg-gray-100 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* フィードバック各項目 - エラー状態の表示を追加 */}
              {error ? (
                <div className="my-5 p-4 bg-red-50 rounded-xl border border-red-100 text-red-600 text-sm">
                  <p className="mb-2 font-medium">エラーが発生しました</p>
                  <p>{error}</p>
                  <p className="mt-3 text-xs">もう一度試すか、後でやり直してください。</p>
                </div>
              ) : (
                feedbackItems.map((item, index) => (
                  <div key={index} className="mb-5 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-white/40">
                    <h2 className="text-sm font-semibold mb-3 flex items-center">
                      <span className="mr-2 p-1.5 rounded-full bg-[#FFF0E8]">{item.icon}</span>
                      {item.title}
                    </h2>
                    <ul className="list-none space-y-3">
                      {item.points.map((point, i) => (
                        <li key={i} className="flex items-start bg-[#FAFAFA] rounded-xl py-2.5 px-4 shadow-sm border border-gray-100/50">
                          <input
                            type="checkbox"
                            id={`checkbox-${index}-${i}`}
                            checked={!!checkboxes[`${index}-${i}`]}
                            onChange={() => handleCheckboxChange(index, i, point)}
                            className="mr-3 mt-0.5 h-4 w-4 rounded border-gray-300 text-[#FFAB7D] focus:ring-[#FFAB7D] accent-[#FFAB7D]"
                          />
                          <label 
                            htmlFor={`checkbox-${index}-${i}`}
                            className="text-sm leading-snug text-gray-700"
                          >
                            {point}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}

              {/* 説明文 */}
              <p className="text-center text-sm text-gray-600 my-4">
                あとで見直したいフィードバックにチェックを入れよう！
              </p>

              {/* 選択中の項目数を表示 */}
              <div className="my-4 text-center">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-[#FFAB7D]">{checkedItems.length}</span> 件の項目が選択されています
                </p>
              </div>

              {/* ボタンエリア */}
              <div className="flex flex-col gap-3 my-8">
                <button
                  onClick={saveToChecklist}
                  className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-3 px-6 shadow-sm hover:opacity-90 transition-all flex items-center justify-center"
                >
                  <List className="w-4 h-4 mr-2" />
                  <span className="text-sm whitespace-nowrap">チェックリストに登録</span>
                </button>
                <button
                  onClick={() => {
                    // meetingCountに基づいて適切なページに遷移
                    if (meetingCount === 'first') {
                      router.push('/conversation/tips-first');
                    } else {
                      router.push('/conversation/tips-later');
                    }
                  }}
                  className="bg-white/90 text-[#FF8551] border border-[#FF8551]/70 rounded-full py-3 px-6 shadow-sm hover:bg-[#FFF1E9] transition-colors flex items-center justify-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="text-sm whitespace-nowrap">押さえておくべきポイント</span>
                </button>
                <button
                  onClick={() => router.push({
                    pathname: '/conversation/practice',
                    query: { partnerId, meetingCount, rallyCount, conversation }
                  })}
                  className="bg-white/90 text-[#FF8551] border border-[#FF8551]/70 rounded-full py-3 px-6 shadow-sm hover:bg-[#FFF1E9] transition-colors flex items-center justify-center"
                >
                  <span className="text-sm whitespace-nowrap">もう一度練習する</span>
                </button>
              </div>

              {/* 会話履歴セクション */}
              <div className="mt-4 mb-24">
                <div className="flex items-center mb-4">
                  <h2 className="text-sm font-semibold flex items-center">
                    <span className="mr-2 p-1.5 rounded-full bg-[#FFF0E8]">
                      <BookOpen className="w-5 h-5 text-[#FF8551]" />
                    </span>
                    会話履歴
                  </h2>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-white/40">
                  <div className="space-y-4 max-h-96 overflow-y-auto p-2">
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
                                : 'bg-white/90 border border-white/40 text-gray-800 shadow-sm'
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
