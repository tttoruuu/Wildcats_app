import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import Link from 'next/link';
import { HomeIcon, User, Star, Check, CheckCircle, XCircle, Heart, BookOpen, List, ArrowLeft } from 'lucide-react';

export default function ConversationFeedback() {
  const router = useRouter();
  const { partnerId, meetingCount, rallyCount } = router.query;
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkboxes, setCheckboxes] = useState({});
  
  // チェックされた項目を保存するための状態
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    if (!partnerId) return;

    const fetchPartner = async () => {
      try {
        const partner = await apiService.partners.getPartner(partnerId);
        setPartner(partner);
        setError(null);
      } catch (err) {
        console.error('会話相手の情報取得に失敗しました', err);

        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth/login');
        } else {
          setError('相手の情報を取得できませんでした。');
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
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [partnerId, router]);

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

  const feedbackItems = [
    {
      title: '良かった点',
      icon: <Heart className="w-5 h-5 text-[#FF8551]" />,
      points: [
        '相手の話に興味を示し、質問を投げかけていました',
        '自分の経験や考えをうまく表現できていました',
        '会話の流れを自然に保てていました'
      ]
    },
    {
      title: '改善点',
      icon: <XCircle className="w-5 h-5 text-[#FF8551]" />,
      points: [
        '質問のバリエーションをもう少し増やすと良いでしょう',
        '時々相手の質問に直接答えずに話題を変えることがありました',
        '会話の深まりをもう少し意識すると良いでしょう'
      ]
    },
    {
      title: '今後の練習ポイント',
      icon: <BookOpen className="w-5 h-5 text-[#FF8551]" />,
      points: [
        '相手の話をさらに深堀りする質問を心がけましょう',
        '自分の考えに加えて、具体的なエピソードも交えると効果的です',
        '相手の話に共感や理解を示す表現を増やしましょう'
      ]
    }
  ];
  return (
    <Layout title="会話フィードバック" hideHeader={true}>
      <div 
        className="flex flex-col min-h-screen text-gray-800"
        style={{
          backgroundImage: `url('/images/back.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundColor: 'rgba(230, 230, 230, 0.7)',
          backgroundBlendMode: 'overlay'
        }}
      >
        {/* ヘッダー */}
        <div className="bg-transparent pt-8 px-6 p-4 flex flex-col items-center relative">
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-8 text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity"
            aria-label="戻る"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
          <h1 className="text-xl font-bold text-[#FF8551]">FEEDBACK📝</h1>
          <div className="flex items-center justify-center mt-6 p-2 rounded-full w-full max-w-md bg-gradient-to-r from-[#FF8551]/90 to-[#FFA46D]/90 backdrop-blur-sm">
            <div className="text-center text-white">
              <p className="text-sm font-semibold">すごく自然な会話でした！</p>
              <p className="text-xs mt-0.5">次はもう少し踏み込んだ質問にチャレンジしてみましょう</p>
            </div>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="flex-grow px-6 py-4 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8551] mx-auto"></div>
                <p className="mt-4 text-gray-600">情報を読み込み中...</p>
              </div>
            ) : (
              <>
                {/* 評価 */}
                <div className="mb-5">
                  <h2 className="text-md font-semibold mb-2 flex items-center">
                    <Star className="mr-2 text-yellow-400 w-5 h-5" />
                    会話の評価
                  </h2>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-white/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">全体評価</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 text-yellow-400"
                            fill={star <= 5 ? "#FBBF24" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#FFFAF0] rounded-xl p-3 text-xs leading-tight text-gray-700 border border-amber-100/50">
                      <p>
                        {rallyCount || 0}回のラリーを通して、自然な会話の流れを作ることができていました。
                        相手に興味を示し、適切な質問をすることで会話を発展させることができています。
                      </p>
                    </div>
                  </div>
                </div>

                {/* フィードバック各項目 */}
                {feedbackItems.map((item, index) => (
                  <div key={index} className="mb-5 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-white/40">
                    <h2 className="text-sm font-semibold mb-2 flex items-center">
                      <span className="mr-2 p-1 rounded-full bg-[#FFF0E8]">{item.icon}</span>
                      {item.title}
                    </h2>
                    <ul className="list-none space-y-2">
                      {item.points.map((point, i) => (
                        <li key={i} className="flex items-start bg-[#FAFAFA] rounded-xl py-1.5 px-3 shadow-sm border border-gray-100/50">
                          <input
                            type="checkbox"
                            id={`checkbox-${index}-${i}`}
                            checked={!!checkboxes[`${index}-${i}`]}
                            onChange={() => handleCheckboxChange(index, i, point)}
                            className="mr-2 mt-0.5 h-4 w-4 rounded border-gray-300 text-[#FFAB7D] focus:ring-[#FFAB7D] accent-[#FFAB7D]"
                          />
                          <label 
                            htmlFor={`checkbox-${index}-${i}`}
                            className="text-xs leading-tight text-gray-700"
                          >
                            {point}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* 選択中の項目数を表示 */}
                <div className="my-4 text-center">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-[#FFAB7D]">{checkedItems.length}</span> 件の項目が選択されています
                  </p>
                </div>

                {/* ボタンエリア */}
                <div className="flex justify-between mt-8 mb-24">
                  <button
                    onClick={() => router.push({
                      pathname: '/conversation/practice',
                      query: { partnerId, meetingCount, rallyCount }
                    })}
                    className="bg-white/90 text-[#FF8551] border border-[#FF8551]/70 rounded-full py-2.5 px-6 shadow-sm hover:bg-[#FFF1E9] transition-colors flex items-center"
                  >
                    <span className="text-sm whitespace-nowrap">もう一度練習する</span>
                  </button>
                  <button
                    onClick={saveToChecklist}
                    className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-2.5 px-6 shadow-sm hover:opacity-90 transition-all flex items-center"
                  >
                    <List className="w-4 h-4 mr-1" />
                    <span className="text-sm whitespace-nowrap">チェックリストに登録</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
