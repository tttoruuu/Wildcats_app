import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { ArrowLeft, X } from 'lucide-react';
import axios from 'axios';

export default function PartnersList() {
  const router = useRouter();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    partnerId: null,
    partnerName: ''
  });

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        
        // トークンの確認
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('トークンがありません、ログイン画面にリダイレクトします');
          router.push('/auth/login');
          return;
        }
        
        // APIからデータを取得
        const partnersData = await apiService.partners.getPartners();
        console.log('会話相手データ取得:', partnersData && Array.isArray(partnersData) ? partnersData.length + '件' : 'データなし');
        
        if (partnersData && Array.isArray(partnersData)) {
          setPartners(partnersData);
        } else {
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
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [router]);

  const openConfirmModal = (id, name) => {
    setConfirmModal({
      isOpen: true,
      partnerId: id,
      partnerName: name
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      partnerId: null,
      partnerName: ''
    });
  };

  const handleDeletePartner = async () => {
    try {
      // APIを使用して削除
      await apiService.partners.deletePartner(confirmModal.partnerId);
      
      // 削除成功後、リストを更新
      setPartners(prevPartners => 
        prevPartners.filter(partner => partner.id !== confirmModal.partnerId)
      );
      
      // モーダルを閉じる
      closeConfirmModal();
    } catch (error) {
      console.error('会話相手の削除に失敗しました:', error);
      alert('削除に失敗しました。もう一度お試しください。');
      
      // 認証エラーの場合はログイン画面にリダイレクト
      if (error.response && error.response.status === 401) {
        router.push('/auth/login');
      }
    }
  };

  return (
    <Layout title="お相手リスト" hideHeader={true}>
      <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] text-gray-800 px-6 py-4 pb-20">
        <div className="max-w-md w-full">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => router.back()}
              className="text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft size={18} />
              <span>もどる</span>
            </button>
          </div>
          
          <h1 className="text-2xl font-bold mb-4 text-center text-[#FF8551]">お相手リスト</h1>
          
          <div className="flex justify-center mb-6">
            <button
              onClick={() => router.push('/conversation/register')}
              className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-2 px-6 hover:opacity-90 shadow-sm"
            >
              新しく登録
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">読み込み中...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <button
                onClick={() => router.push('/conversation/register')}
                className="mt-4 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-2 px-6 hover:opacity-90 shadow-sm"
              >
                新しく登録する
              </button>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-8">
              <p className="mb-4">登録されている会話相手がいません</p>
              <button
                onClick={() => router.push('/conversation/register')}
                className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-2 px-6 hover:opacity-90 shadow-sm"
              >
                新しく登録する
              </button>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {partners.map((partner, index) => {
                return (
                  <div 
                    key={partner.id} 
                    className="bg-white/90 backdrop-blur-sm border border-white/40 text-gray-800 rounded-2xl p-4 relative shadow-sm"
                  >
                    <h2 className="text-lg font-medium text-[#FF8551]">
                      {partner.name} <span className="text-gray-600">({partner.age})</span>
                    </h2>
                    
                    <div className="mt-2 space-y-1">
                      <p className="text-sm"><span className="font-medium">出身：</span>{partner.hometown || '-'}</p>
                      <p className="text-sm"><span className="font-medium">趣味：</span>{partner.hobbies || '-'}</p>
                      <p className="text-sm"><span className="font-medium">休日の過ごし方：</span>{partner.daily_routine || '-'}</p>
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => openConfirmModal(partner.id, partner.name)}
                        className="text-xs bg-white text-gray-500 hover:text-red-500 border border-gray-200 rounded-full px-3 py-1 transition-colors"
                      >
                        リストから解除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 確認モーダル */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-xs w-full mx-4 shadow-lg">
              <div className="flex justify-end">
                <button onClick={closeConfirmModal} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-[#FF8551] mb-2">リストから解除しますか？</h3>
                <p className="text-sm text-gray-600">
                  {confirmModal.partnerName}さんをリストから解除します。この操作は取り消せません。
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleDeletePartner}
                  className="bg-red-500 text-white rounded-full py-2 px-4 hover:bg-red-600 transition-colors"
                >
                  解除する
                </button>
                <button
                  onClick={closeConfirmModal}
                  className="border border-gray-300 text-gray-700 rounded-full py-2 px-4 hover:bg-gray-100 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 