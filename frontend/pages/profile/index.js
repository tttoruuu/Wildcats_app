import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import apiService from '../../services/api';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // apiService.auth.getCurrentUser()を使用してユーザー情報を取得
        const userData = await apiService.auth.getCurrentUser();
        setUser(userData);
        setError('');
      } catch (err) {
        console.error('ユーザー情報の取得に失敗しました。', err);
        setError('ユーザー情報の取得に失敗しました。');
        
        // 認証エラー（401）の場合はログイン画面にリダイレクト
        if (err.response && err.response.status === 401) {
          console.log('認証エラー: トークンが無効または期限切れです。再ログインが必要です。');
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    // ユーザー情報を取得
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    // apiService.auth.logout()を使用してログアウト処理
    apiService.auth.logout();
    router.push('/auth/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">読み込み中...</div>;
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-4 text-center bg-[#F5F5F5]">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => router.push('/auth/login')}
          className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] hover:opacity-90 text-white font-medium py-2 px-6 rounded-full shadow-sm"
        >
          ログイン画面に戻る
        </button>
      </div>
    );
  }

  return (
    <Layout title="プロフィール">
      <div className="px-6 py-4 bg-[#F5F5F5] min-h-screen">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 mb-4 border border-white/40">
          <div className="flex items-center space-x-4 mb-6">
            {user.profile_image_url ? (
              <img
                src={apiService.getImageUrl(user.profile_image_url)}
                alt="プロフィール画像"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#FF8551]/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#FFF0E8] flex items-center justify-center border-2 border-[#FF8551]/30">
                <span className="text-[#FF8551]">{user.username.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.full_name}</h2>
              <p className="text-[#FF8551]">@{user.username}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Link href="/profile/user-info">
              <div className="bg-[#FFF5F0] rounded-xl p-4 hover:bg-[#FFEBE0] transition-colors border border-[#FF8551]/10">
                <h3 className="text-lg font-medium text-[#FF8551]">ユーザー情報の詳細を見る</h3>
              </div>
            </Link>
            
            <Link href="/profile/edit">
              <div className="bg-[#FFF5F0] rounded-xl p-4 hover:bg-[#FFEBE0] transition-colors border border-[#FF8551]/10">
                <h3 className="text-lg font-medium text-[#FF8551]">プロフィールを編集する</h3>
              </div>
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 rounded-xl p-4 hover:bg-red-100 transition-colors text-left border border-red-100"
            >
              <h3 className="text-lg font-medium">ログアウト</h3>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 