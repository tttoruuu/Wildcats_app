import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import Layout from '../components/Layout';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        console.error('ユーザー情報の取得に失敗しました。', err);
        if (err.response && err.response.status === 401) {
          console.log('認証エラー: トークンが無効または期限切れです。再ログインが必要です。');
          localStorage.removeItem('token');
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <p className="text-red-600 mb-4">ユーザー情報の取得に失敗しました</p>
        <button 
          onClick={() => router.push('/auth/login')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          ログイン画面に戻る
        </button>
      </div>
    );
  }

  return (
    <Layout title="ホーム">
      <div className="p-4">
        <h2 className="text-xl font-semibold mt-6 mb-4">今日は何をしますか？</h2>
        
        <div className="space-y-4">
          <Link href="/conversation">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium">会話の練習をしよう</h3>
            </div>
          </Link>
          
          <Link href="/checklist">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium">チェックリストを見る</h3>
            </div>
          </Link>
          
          <Link href="/community">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium">コミュニティへ行こう</h3>
            </div>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full mt-8 text-center text-sm text-gray-500 hover:text-red-500 transition-colors py-2"
          >
            ログアウト
          </button>
        </div>
      </div>
    </Layout>
  );
}
