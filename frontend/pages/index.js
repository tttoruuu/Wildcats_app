// pages/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { Home as HomeIcon, User } from "lucide-react"
import Layout from '../components/Layout';

export default function MainPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: ''
  });
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
    return <div className="min-h-screen flex items-center justify-center text-white">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-[#2C2C2C]">
      <main className="max-w-[430px] mx-auto px-6 py-8">
        {/* プロフィールセクション */}
        <div className="flex items-center gap-4 mb-12">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src="/images/profile/yusuke.jpg"
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl text-white flex items-center gap-2">
              Hi, {user.username}! <span className="text-2xl">👋</span>
            </h1>
            <p className="text-gray-400">{user.lastName} {user.firstName}</p>
          </div>
        </div>

        {/* メインテキスト */}
        <h2 className="text-white text-xl mb-8">今日は何をしますか？</h2>

        {/* メニューボタン */}
        <nav className="space-y-4">
          <Link href="/conversation">
            <div className="block w-full p-6 text-center bg-white rounded-2xl hover:bg-gray-100 transition-colors">
              会話の練習をしよう
            </div>
          </Link>
          <Link href="/checklist">
            <div className="block w-full p-6 text-center bg-white rounded-2xl hover:bg-gray-100 transition-colors">
              チェックリストを見る
            </div>
          </Link>
          <Link href="/community">
            <div className="block w-full p-6 text-center bg-white rounded-2xl hover:bg-gray-100 transition-colors">
              コミュニティへ行こう
            </div>
          </Link>
        </nav>

        {/* ログアウト */}
        <button
          onClick={handleLogout}
          className="w-full mt-8 text-center text-sm text-gray-400 hover:text-red-500 transition-colors py-2"
        >
          ログアウト
        </button>

        {/* ナビゲーションバー */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#2C2C2C] py-4">
          <div className="max-w-[430px] mx-auto px-6">
            <div className="flex justify-between">
              <Link href="/" className="flex flex-col items-center">
                <HomeIcon className="w-6 h-6 text-[#F4A261]" />
                <span className="text-sm text-[#F4A261] mt-1">Home</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center">
                <User className="w-6 h-6 text-white" />
                <span className="text-sm text-white mt-1">Profile</span>
              </Link>
            </div>
          </div>
        </nav>
      </main>
    </div>
  );
}
