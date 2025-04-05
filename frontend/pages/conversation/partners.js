import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import apiService from '../../services/api';

export default function PartnersList() {
  const router = useRouter();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        // APIからデータを取得
        const partnersData = await apiService.partners.getPartners();
        
        if (partnersData && partnersData.length > 0) {
          setPartners(partnersData);
        } else {
          // データが空の場合は空配列を設定
          setPartners([]);
        }
        setError(null);
      } catch (error) {
        console.error('会話相手データの取得に失敗しました:', error);
        setError('会話相手の情報を取得できませんでした。');
        
        // 認証エラーの場合はログイン画面にリダイレクト
        if (error.response && error.response.status === 401) {
          router.push('/auth/login');
          return;
        }
        
        // APIエラー時にフォールバックとしてサンプルデータを表示
        setPartners([
          { id: '1', name: 'あいさん', age: 37, hometown: '東京都', hobbies: '料理、旅行', daily_routine: '公園を散歩したり、カフェでのんびり過ごします' },
          { id: '2', name: 'ゆうりさん', age: 37, hometown: '北海道', hobbies: '読書、映画鑑賞', daily_routine: '図書館で過ごすことが多いです' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [router]);

  const handleDeletePartner = async (id) => {
    // 削除確認
    if (window.confirm('本当にこの相手をリストから削除しますか？')) {
      try {
        // APIを使用して削除
        await apiService.partners.deletePartner(id);
        
        // 削除成功後、リストを更新
        setPartners(prevPartners => 
          prevPartners.filter(partner => partner.id !== id)
        );
      } catch (error) {
        console.error('会話相手の削除に失敗しました:', error);
        alert('削除に失敗しました。もう一度お試しください。');
        
        // 認証エラーの場合はログイン画面にリダイレクト
        if (error.response && error.response.status === 401) {
          router.push('/auth/login');
        }
      }
    }
  };

  return (
    <Layout title="お相手リスト">
      <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4 pb-20">
        <div className="max-w-md w-full">
          <button 
            onClick={() => router.back()}
            className="text-white bg-gray-700 rounded-full px-4 py-2 mb-8"
          >
            もどる
          </button>
          
          <h1 className="text-2xl font-bold mb-6 text-center">お相手リスト</h1>
          
          {loading ? (
            <div className="text-center py-8">読み込み中...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-300">
              <p>{error}</p>
              <button
                onClick={() => router.push('/conversation/register')}
                className="mt-4 bg-orange-300 text-white rounded-full py-2 px-6 hover:bg-orange-400"
              >
                新しく登録する
              </button>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-8">
              <p className="mb-4">登録されている会話相手がいません</p>
              <button
                onClick={() => router.push('/conversation/register')}
                className="bg-orange-300 text-white rounded-full py-2 px-6 hover:bg-orange-400"
              >
                新しく登録する
              </button>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {partners.map((partner, index) => {
                // インデックスに基づいて異なる背景色を適用
                const cardColors = [
                  "bg-blue-50", 
                  "bg-pink-50", 
                  "bg-green-50", 
                  "bg-yellow-50",
                  "bg-purple-50"
                ];
                const colorIndex = index % cardColors.length;
                const cardColor = cardColors[colorIndex];
                
                return (
                  <div 
                    key={partner.id} 
                    className={`${cardColor} text-gray-800 rounded-lg p-4 relative shadow-md border border-gray-100`}
                  >
                    <button
                      onClick={() => handleDeletePartner(partner.id)}
                      className="absolute top-2 right-2 bg-white text-gray-400 hover:text-gray-600 rounded-md px-2 py-1 text-xs border border-gray-200"
                    >
                      リストから削除
                    </button>
                    
                    <h2 className="text-lg font-medium">
                      {partner.name} ({partner.age})
                    </h2>
                    
                    <div className="mt-2">
                      <p className="text-sm">出身：{partner.hometown || '-'}</p>
                      <p className="text-sm">趣味：{partner.hobbies || '-'}</p>
                      <p className="text-sm">休日の過ごし方：{partner.daily_routine || '-'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
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