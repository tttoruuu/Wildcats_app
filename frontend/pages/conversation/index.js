import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import apiService from '../../services/api';

export default function ConversationIndex() {
  const router = useRouter();
  const [selectedPartner, setSelectedPartner] = useState('');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // APIから会話相手を取得
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        // APIから会話相手のデータを取得
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
        
        // APIエラー時はサンプルデータを使用
        setPartners([
          { id: '1', name: 'あいさん' },
          { id: '2', name: 'ゆうりさん' },
          { id: '3', name: 'しおりさん' },
          { id: '4', name: 'かおりさん' },
          { id: '5', name: 'なつみさん' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [router]);

  const handleSelectPartner = (e) => {
    setSelectedPartner(e.target.value);
  };

  const handleNext = () => {
    if (selectedPartner) {
      // 選択された相手のIDをクエリパラメータとして渡し、セットアップページに遷移
      router.push(`/conversation/setup?partnerId=${selectedPartner}`);
    }
  };

  return (
    <Layout title="会話練習">
      <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mt-16 mb-12 text-center">誰との会話を練習する？</h1>
        
        <div className="flex justify-center space-x-4 w-full mb-12">
          <Link href="/conversation/register">
            <div className="bg-orange-300 text-white rounded-full py-3 px-6 text-center shadow-md">
              新しく登録
            </div>
          </Link>
          
          <Link href="/conversation/partners">
            <div className="bg-orange-300 text-white rounded-full py-3 px-6 text-center shadow-md">
              名簿を見る
            </div>
          </Link>
        </div>
        
        <div className="w-full max-w-md">
          {loading ? (
            <div className="text-center mb-12">読み込み中...</div>
          ) : error ? (
            <div className="text-center mb-12 text-red-300">
              <p>{error}</p>
              <button
                onClick={() => router.push('/conversation/register')}
                className="mt-4 bg-orange-300 text-white rounded-full py-2 px-6 hover:bg-orange-400"
              >
                新しく登録する
              </button>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center mb-12">
              <p className="mb-4">登録されている会話相手がいません</p>
              <button
                onClick={() => router.push('/conversation/register')}
                className="bg-orange-300 text-white rounded-full py-2 px-6 hover:bg-orange-400"
              >
                新しく登録する
              </button>
            </div>
          ) : (
            <select
              value={selectedPartner}
              onChange={handleSelectPartner}
              className="w-full p-4 text-gray-800 bg-white rounded-md focus:outline-none mb-12"
            >
              <option value="">会話する相手を選択</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name}
                </option>
              ))}
            </select>
          )}
        </div>
        
        {!loading && !error && partners.length > 0 && (
          <button
            onClick={handleNext}
            disabled={!selectedPartner}
            className={`bg-orange-300 text-white rounded-full py-3 px-10 text-lg ${
              !selectedPartner ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-400'
            }`}
          >
            次へ進む
          </button>
        )}
      </div>
    </Layout>
  );
} 