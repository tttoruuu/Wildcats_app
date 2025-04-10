import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { ArrowLeft, ChevronDown } from 'lucide-react';

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
      <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] text-gray-800 px-6 py-4">
        <div className="w-full max-w-md mt-8 relative">
          <button 
            onClick={() => router.push('/')}
            className="text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-0"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold mt-16 mb-12 text-center text-[#FF8551]">誰との会話を練習する？</h1>
        
        <div className="flex justify-center space-x-4 w-full max-w-md mb-12">
          <Link href="/conversation/register">
            <div className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-3 px-6 text-center shadow-sm hover:opacity-90 transition-all">
              新しく登録
            </div>
          </Link>
          
          <Link href="/conversation/partners">
            <div className="bg-white/90 text-[#FF8551] border border-[#FF8551]/70 rounded-full py-3 px-6 text-center shadow-sm hover:bg-[#FFF1E9] transition-colors">
              名簿を見る
            </div>
          </Link>
        </div>
        
        <div className="w-full max-w-md px-4">
          {loading ? (
            <div className="text-center mb-12">読み込み中...</div>
          ) : error ? (
            <div className="text-center mb-12 text-red-500">
              <p>{error}</p>
              <button
                onClick={() => router.push('/conversation/register')}
                className="mt-4 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-2 px-6 hover:opacity-90 shadow-sm"
              >
                新しく登録する
              </button>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center mb-12">
              <p className="mb-4">登録されている会話相手がいません</p>
              <button
                onClick={() => router.push('/conversation/register')}
                className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-2 px-6 hover:opacity-90 shadow-sm"
              >
                新しく登録する
              </button>
            </div>
          ) : (
            <div className="flex justify-center mb-12 relative">
              <select
                value={selectedPartner}
                onChange={handleSelectPartner}
                className="w-full max-w-xs p-4 pr-10 bg-white/90 backdrop-blur-sm rounded-2xl focus:outline-none border border-white/40 shadow-sm text-gray-800 focus:border-[#FF8551] focus:ring-[#FF8551] appearance-none"
              >
                <option value="">会話する相手を選択</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>
        
        {!loading && !error && partners.length > 0 && (
          <button
            onClick={handleNext}
            disabled={!selectedPartner}
            className={`bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-3 px-10 text-lg shadow-sm ${
              !selectedPartner ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            次へ進む
          </button>
        )}
      </div>
    </Layout>
  );
} 

console.log("UI変更を確認中");
