import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import apiService from '../../services/api';

export default function ConversationSetup() {
  const router = useRouter();
  const { partnerId } = router.query;
  
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingCount, setMeetingCount] = useState('first');
  
  // シナリオオプション
  const scenarioOptions = [
    { value: '自己紹介', label: '自己紹介' },
    { value: '休日の過ごし方や趣味について', label: '休日の過ごし方や趣味について' },
    { value: '仕事や学びについて', label: '仕事や学びについて' },
  ];

  useEffect(() => {
    if (!partnerId) return;
    
    const fetchPartnerData = async () => {
      try {
        setLoading(true);
        // APIから会話相手の詳細データを取得
        const partnerData = await apiService.partners.getPartner(partnerId);
        setPartner(partnerData);
        setError(null);
      } catch (error) {
        console.error('パートナーデータの取得に失敗しました:', error);
        setError('相手の情報を取得できませんでした。');
        
        // 認証エラーの場合はログイン画面にリダイレクト
        if (error.response && error.response.status === 401) {
          router.push('/auth/login');
          return;
        }
        
        // APIエラー時にフォールバックとしてサンプルデータを使用
        const samplePartners = [
          { id: '1', name: 'あいさん', age: 37, hometown: '東京都', hobbies: '料理、旅行', daily_routine: '公園を散歩したり、カフェでのんびり過ごします' },
          { id: '2', name: 'ゆうりさん', age: 37, hometown: '北海道', hobbies: '読書、映画鑑賞', daily_routine: '図書館で過ごすことが多いです' },
          { id: '3', name: 'しおりさん', age: 37, hometown: '大阪府', hobbies: 'ヨガ、料理', daily_routine: '朝は早起きしてヨガをしています' },
          { id: '4', name: 'かおりさん', age: 37, hometown: '愛知県', hobbies: 'ガーデニング、写真撮影', daily_routine: '植物の手入れをしたり、近所を散策します' },
        ];
        
        const samplePartner = samplePartners.find(p => p.id === partnerId);
        if (samplePartner) {
          setPartner(samplePartner);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerData();
  }, [partnerId, router]);

  const handleMeetingCountChange = (value) => {
    setMeetingCount(value);
  };

  const handleStartPractice = () => {
    // 会話練習ページに遷移（シナリオパラメータなし）
    router.push({
      pathname: '/conversation/practice',
      query: { 
        partnerId,
        meetingCount
      }
    });
  };

  return (
    <Layout title="会話設定">
      <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4 pb-20">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold mt-8 mb-6 text-center">どのように会話練習をしますか？</h1>
          
          {/* イラスト */}
          <div className="flex justify-center mb-8">
            <img 
              src="/conversation-illust.png" 
              alt="会話練習" 
              className="w-32 h-32"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23333'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%23FFF' text-anchor='middle' alignment-baseline='middle'%3E会話%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          
          {loading ? (
            <div className="text-center py-4">読み込み中...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-300">
              <p>{error}</p>
              <button
                onClick={() => router.push('/conversation')}
                className="mt-4 text-white hover:text-gray-300"
              >
                会話相手選択に戻る
              </button>
            </div>
          ) : (
            <>
              {/* 誰と話すか */}
              <div className="mb-6">
                <label className="block text-sm mb-2">誰と話しますか？</label>
                <input
                  type="text"
                  value={partner?.name || ''}
                  className="w-full p-4 rounded-full bg-white text-gray-800 focus:outline-none"
                  readOnly
                />
              </div>
              
              {/* 何回目の会合か - 2つの選択肢に変更 */}
              <div className="mb-6">
                <label className="block text-sm mb-2">何回目のお見合いですか？</label>
                <div className="bg-white rounded-full p-1 flex">
                  <button
                    className={`flex-1 py-2 px-3 rounded-full ${meetingCount === 'first' ? 'bg-orange-300 text-white' : 'text-gray-800'}`}
                    onClick={() => handleMeetingCountChange('first')}
                  >
                    初めて
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-full ${meetingCount === 'other' ? 'bg-orange-300 text-white' : 'text-gray-800'}`}
                    onClick={() => handleMeetingCountChange('other')}
                  >
                    2回目以降
                  </button>
                </div>
              </div>
              
              {/* 練習開始ボタン */}
              <button
                onClick={handleStartPractice}
                className="w-full bg-orange-300 text-white rounded-full py-3 font-medium hover:bg-orange-400"
              >
                会話開始
              </button>
              
              {/* 戻るボタン */}
              <div className="text-center mt-4">
                <button
                  onClick={() => router.back()}
                  className="text-gray-400 hover:text-white"
                >
                  戻る
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* 画面下部のナビゲーション */}
        <div className="fixed bottom-0 w-full max-w-md py-4 bg-gray-800 border-t border-gray-700">
          <div className="flex justify-between px-12">
            <button
              onClick={() => router.push('/')}
              className="text-orange-300 flex flex-col items-center"
            >
              <span className="text-2xl">⌂</span>
              <span className="text-xs">Home</span>
            </button>
            
            <button
              onClick={() => router.push('/favorites')}
              className="text-gray-400 flex flex-col items-center"
            >
              <span className="text-2xl">♡</span>
              <span className="text-xs">いいね</span>
            </button>
            
            <button
              onClick={() => router.push('/profile')}
              className="text-gray-400 flex flex-col items-center"
            >
              <span className="text-2xl">👤</span>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 