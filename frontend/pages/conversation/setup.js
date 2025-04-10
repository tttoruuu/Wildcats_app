import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function ConversationSetup() {
  const router = useRouter();
  const { partnerId } = router.query;

  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingCount, setMeetingCount] = useState('first');
  const [rallyCount, setRallyCount] = useState(8);

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
        const partnerData = await apiService.partners.getPartner(partnerId);
        setPartner(partnerData);
        setError(null);
      } catch (error) {
        console.error('パートナーデータの取得に失敗しました:', error);
        setError('相手の情報を取得できませんでした。');

        if (error.response && error.response.status === 401) {
          router.push('/auth/login');
          return;
        }

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

  const handleRallyCountChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 5 && value <= 12) {
      setRallyCount(value);
    }
  };

  const handleStartPractice = () => {
    router.push({
      pathname: '/conversation/practice',
      query: {
        partnerId,
        meetingCount,
        rallyCount
      }
    });
  };

  return (
    <Layout title="会話設定" hideHeader={true}>
      <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] text-gray-800 px-6 py-4 pb-20">
        <div className="max-w-md w-full">
          <div className="mt-8 mb-4">
            <button
              onClick={() => router.back()}
              className="text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft size={18} />
              <span>もどる</span>
            </button>
          </div>



          {/* イラスト（中央配置） */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-white/40 p-2 flex items-center justify-center">
              <Image
                src="/images/setup.png"
                alt="会話設定イラスト"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-6 text-center text-[#FF8551]">
            どのように会話練習をしますか？
          </h1>
          {loading ? (
            <div className="text-center py-4">読み込み中...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              <p>{error}</p>
              <button
                onClick={() => router.push('/conversation')}
                className="mt-4 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-2 px-6 hover:opacity-90 shadow-sm"
              >
                会話相手選択に戻る
              </button>
            </div>
          ) : (
            <>
              {/* 相手 */}
              <div className="mb-6">
                <label className="block text-sm mb-2 font-medium">誰と話しますか？</label>
                <input
                  type="text"
                  value={partner?.name || ''}
                  className="w-full p-4 rounded-xl bg-white/90 backdrop-blur-sm text-gray-800 focus:outline-none border border-white/40 shadow-sm"
                  readOnly
                />
              </div>

              {/* 会合の回数 */}
              <div className="mb-6">
                <label className="block text-sm mb-2 font-medium">何回目のお見合いですか？</label>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-1 flex border border-white/40 shadow-sm">
                  <button
                    className={`flex-1 py-2 px-3 rounded-xl ${meetingCount === 'first' ? 'bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white' : 'text-gray-800'}`}
                    onClick={() => handleMeetingCountChange('first')}
                  >
                    初めて
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-xl ${meetingCount === 'other' ? 'bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white' : 'text-gray-800'}`}
                    onClick={() => handleMeetingCountChange('other')}
                  >
                    2回目以降
                  </button>
                </div>
              </div>

              {/* ラリー数スライダー */}
              <div className="mb-6">
                <label className="block text-sm mb-2 font-medium">会話のラリー数 (5〜12回):</label>
                <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm">
                  <input
                    type="range"
                    min="5"
                    max="12"
                    value={rallyCount}
                    onChange={handleRallyCountChange}
                    className="w-full mr-4 accent-[#FF8551]"
                  />
                  <span className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full px-4 py-2 w-12 text-center">
                    {rallyCount}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  ※設定した回数の会話が終わると自動的にフィードバック画面へ進みます
                </p>
              </div>

              {/* 開始ボタン */}
              <button
                onClick={handleStartPractice}
                className="w-full bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-3 font-medium hover:opacity-90 shadow-sm"
              >
                会話開始
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
