import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function ConversationIndex() {
  const router = useRouter();
  const [selectedPartner, setSelectedPartner] = useState('');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // ローカルストレージから会話相手を取得
  useEffect(() => {
    const fetchPartners = () => {
      try {
        // ローカルストレージから会話相手のデータを取得
        const storedPartners = JSON.parse(localStorage.getItem('conversationPartners') || '[]');
        
        if (storedPartners.length > 0) {
          // 登録された会話相手がある場合はそれを使用
          setPartners(storedPartners);
        } else {
          // サンプルデータ（ローカルストレージに登録がない場合のみ表示）
          setPartners([
            { id: '1', name: 'あいさん' },
            { id: '2', name: 'ゆうりさん' },
            { id: '3', name: 'しおりさん' },
            { id: '4', name: 'かおりさん' },
            { id: '5', name: 'なつみさん' },
          ]);
        }
      } catch (error) {
        console.error('会話相手データの取得に失敗しました:', error);
        // エラー時はサンプルデータを使用
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
  }, []);

  const handleSelectPartner = (e) => {
    setSelectedPartner(e.target.value);
  };

  const handleNext = () => {
    if (selectedPartner) {
      // 選択された相手のIDをクエリパラメータとして渡す
      router.push(`/conversation/practice?partnerId=${selectedPartner}`);
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
        
        <button
          onClick={handleNext}
          disabled={!selectedPartner}
          className={`bg-orange-300 text-white rounded-full py-3 px-10 text-lg ${
            !selectedPartner ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-400'
          }`}
        >
          次へ進む
        </button>
      </div>
    </Layout>
  );
} 