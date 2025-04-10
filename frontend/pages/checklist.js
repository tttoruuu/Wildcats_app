import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';
import { HomeIcon, User, List, Trash2, Calendar, ArrowLeft, X } from 'lucide-react';

export default function Checklist() {
  const router = useRouter();
  const [checklistItems, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem('feedbackChecklist') || '[]');
    setChecklistItems(storedData);
    setLoading(false);
  }, []);

  // チェックリストから項目を削除
  const removeItem = (id) => {
    const newItems = checklistItems.filter(item => item.id !== id);
    setChecklistItems(newItems);
    localStorage.setItem('feedbackChecklist', JSON.stringify(newItems));
    setShowDeleteModal(false);
  };

  // 削除確認モーダルを表示
  const confirmDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  // カテゴリーごとにアイテムをグループ化
  const groupedItems = checklistItems.reduce((groups, item) => {
    const category = item.category || 'その他';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <Layout title="チェックリスト">
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
        <div className="bg-transparent pt-6 pb-4 px-6 flex flex-col items-center relative">
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-6 text-[#FF8551]"
            aria-label="戻る"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="mt-8">
            <h1 className="text-xl font-bold text-[#FF8551]">CHECK LIST📋</h1>
            <p className="text-xs text-gray-500 mt-1">フィードバックを振り返ろう</p>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="flex-grow px-6 py-4 overflow-y-auto mb-16">
          <div className="max-w-md mx-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8551] mx-auto"></div>
                <p className="mt-4 text-gray-600">読み込み中...</p>
              </div>
            ) : checklistItems.length === 0 ? (
              <div className="text-center py-8 bg-white/90 rounded-2xl shadow-sm p-6 border border-white/40">
                <List className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="mt-4 text-gray-600">チェックリストが空です</p>
                <p className="mt-2 text-sm text-gray-500">
                  フィードバックページでチェックした項目がここに表示されます
                </p>
                <button
                  onClick={() => router.push('/conversation')}
                  className="mt-6 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-2 px-6 shadow-sm hover:opacity-90 transition-all"
                >
                  会話練習へ戻る
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-600 bg-white/80 rounded-xl py-2 px-4 inline-block">
                    <span className="font-semibold text-[#FF8551]">{checklistItems.length}</span> 件の項目が登録されています
                  </p>
                </div>

                {/* カテゴリーごとに表示 */}
                {Object.keys(groupedItems).map((category) => (
                  <div key={category} className="mb-5 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-3 border border-white/40">
                    <h2 className="text-sm font-semibold mb-2 px-1 pb-2 border-b border-gray-100">
                      {category}
                    </h2>
                    <ul className="list-none space-y-2">
                      {groupedItems[category].map((item) => (
                        <li key={item.id} className="flex items-start justify-between bg-[#FAFAFA] rounded-xl py-1.5 px-3 shadow-sm border border-gray-100/50">
                          <div className="flex items-start flex-1">
                            <input
                              type="checkbox"
                              checked={true}
                              readOnly
                              className="mr-2 mt-0.5 h-4 w-4 rounded border-gray-300 text-[#FFAB7D] focus:ring-[#FFAB7D] accent-[#FFAB7D]"
                            />
                            <div>
                              <p className="text-xs leading-tight text-gray-700">
                                {item.text}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => confirmDelete(item.id)}
                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="削除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* 削除確認モーダル */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-11/12 max-w-sm mx-auto shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">確認</h3>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-5">この項目を削除してもよろしいですか？</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => removeItem(itemToDelete)}
                  className="px-4 py-2 bg-[#FF8551] text-white rounded-lg hover:bg-[#FF9E77] text-sm transition-colors"
                >
                  削除する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 