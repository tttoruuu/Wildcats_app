import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import apiService from '../../services/api';

export default function ConversationFeedback() {
  const router = useRouter();
  const { partnerId, meetingCount, rallyCount } = router.query;
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!partnerId) return;
    
    const fetchPartner = async () => {
      try {
        // apiService.jsを使用してデータを取得
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
          // ダミーデータを使用
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

  // ダミーフィードバックデータ（実際のアプリでは会話の内容から生成するべきです）
  const feedbackItems = [
    {
      title: '良かった点',
      points: [
        '相手の話に興味を示し、質問を投げかけていました',
        '自分の経験や考えをうまく表現できていました',
        '会話の流れを自然に保てていました'
      ]
    },
    {
      title: '改善点',
      points: [
        '質問のバリエーションをもう少し増やすと良いでしょう',
        '時々相手の質問に直接答えずに話題を変えることがありました',
        '会話の深まりをもう少し意識すると良いでしょう'
      ]
    },
    {
      title: '今後の練習ポイント',
      points: [
        '相手の話をさらに深堀りする質問を心がけましょう',
        '自分の考えに加えて、具体的なエピソードも交えると効果的です',
        '相手の話に共感や理解を示す表現を増やしましょう'
      ]
    }
  ];

  return (
    <Layout title="会話フィードバック">
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
            <h1 className="text-lg font-semibold">会話フィードバック</h1>
            {partner && (
              <p className="text-xs text-gray-400">
                {partner.name}との会話（ラリー数: {rallyCount || '-'}回）
              </p>
            )}
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {loading ? (
              <div className="text-center py-8">
                <p>読み込み中...</p>
              </div>
            ) : (
              <>
                {/* 会話評価 */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">会話の評価</h2>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span>全体評価</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-xl text-yellow-400">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">
                      {rallyCount}回のラリーを通して、自然な会話の流れを作ることができていました。
                      相手に興味を示し、適切な質問をすることで会話を発展させることができています。
                    </p>
                  </div>
                </div>

                {/* フィードバック項目 */}
                {feedbackItems.map((item, index) => (
                  <div key={index} className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <ul className="list-disc list-inside space-y-2">
                        {item.points.map((point, i) => (
                          <li key={i} className="text-sm text-gray-300">{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                {/* ボタンエリア */}
                <div className="flex justify-between mt-8 mb-12">
                  <button
                    onClick={() => router.push({
                      pathname: '/conversation/practice',
                      query: { partnerId, meetingCount, rallyCount }
                    })}
                    className="bg-gray-600 text-white rounded-full py-2 px-6 hover:bg-gray-500"
                  >
                    もう一度練習する
                  </button>
                  <button
                    onClick={() => router.push('/conversation')}
                    className="bg-orange-500 text-white rounded-full py-2 px-6 hover:bg-orange-600"
                  >
                    相手を選び直す
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