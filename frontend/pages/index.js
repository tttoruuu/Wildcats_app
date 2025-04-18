import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import Layout from '../components/Layout';
import { MessageSquare, CheckSquare, Users } from 'lucide-react';
import { authAPI } from '../services/api';

export default function MainPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError('');
        
        // トークンの有効性を確認
        if (!authAPI.validateToken()) {
          console.log('有効なトークンがありません。ログインページへリダイレクトします。');
          router.replace('/auth/login');
          return;
        }
        
        // authAPIからユーザー情報を取得
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('ユーザー情報の取得に失敗しました。', err);
        setError('ユーザー情報の取得に失敗しました。');
        
        // 認証エラーの場合はログインページにリダイレクト
        if (err.response && err.response.status === 401) {
          console.log('認証エラー: 再ログインが必要です。');
          router.replace('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    authAPI.logout(); // APIの関数を使用
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800 bg-[#F5F5F5]">
        読み込み中...
      </div>
    );
  }
  
  if (error && !user.username) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-800 bg-[#F5F5F5] px-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => router.push('/auth/login')}
          className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] hover:opacity-90 text-white font-medium py-2 px-4 rounded-full"
        >
          ログイン画面に戻る
        </button>
      </div>
    );
  }

  return (
    <Layout title="ホーム" hideHeader={true}>
      <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
      <div className="w-40 h-40 relative mb-4 flex justify-center mx-auto">
              <Image
                src="/images/logo.png"
                alt="Miraim ロゴ"
                width={160}
                height={160}
                className="object-contain"
              />
            </div> 

        {/* プロフィールセクション */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 bg-white">
              <Image
                src="/images/demo.png"
                alt={user.username}
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{user.username.toLowerCase()}</span>
            </div>
          </div>
          
          <button className="px-2.5 py-1.5 rounded-full border border-[#FF8551] text-[#FF8551] text-xs flex items-center gap-1 hover:bg-[#FFF1E9] transition-colors">
            <span className="text-xs"></span>
            編集する
          </button>
        </div>

        {/* メインテキスト */}
        <h2 className="text-[#FF8551] text-xl font-medium mb-8">今日は何をしますか？</h2>

        {/* メニューボタン */}
        <nav className="flex flex-col">
          <Link href="/conversation">
            <div className="flex items-center gap-3 justify-center w-full py-6 px-6 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-3xl shadow-md mb-6 transition-all hover:opacity-90">
              <MessageSquare className="w-5 h-5" />
              <span className="text-lg font-medium">会話の練習をしよう</span>
            </div>
          </Link>

          <Link href="/checklist">
            <div className="flex items-center gap-3 justify-center w-full py-6 px-6 bg-white/90 backdrop-blur-sm border border-white/40 text-[#FF8551] rounded-3xl shadow-md mb-6 transition-colors hover:bg-[#FFF1E9]">
              <CheckSquare className="w-5 h-5" />
              <span className="text-lg font-medium">チェックリストを見る</span>
            </div>
          </Link>

          <Link href="/community">
            <div className="flex items-center gap-3 justify-center w-full py-6 px-6 bg-white/90 backdrop-blur-sm border border-white/40 text-[#FF8551] rounded-3xl shadow-md mb-12 transition-colors hover:bg-[#FFF1E9]">
              <Users className="w-5 h-5" />
              <span className="text-lg font-medium">コミュニティへ行こう</span>
            </div>
          </Link>
        </nav>

        {/* ログアウト */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 text-center text-sm text-red-500 hover:text-red-600 transition-colors py-2"
        >
          ログアウト
        </button>
      </main>
    </Layout>
  );
}
