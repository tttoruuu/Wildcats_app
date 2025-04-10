import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        console.log('Fetching user with token:', token);
        const response = await axios.get('http://localhost:8000/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        console.log('User data fetched successfully:', response.data);
      } catch (err) {
        console.error('ユーザー情報の取得に失敗しました。', err);
        // 認証エラー（401）の場合はトークンをクリア
        if (err.response && err.response.status === 401) {
          console.log('認証エラー: トークンが無効または期限切れです。');
          localStorage.removeItem('token');
          // ログインページにリダイレクト
          router.push('/auth/login');
        }
      }
    };

    fetchUser();
  }, [router]);

  if (!user) return null;

  return (
    <header className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white p-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <Link href="/">
          <h1 className="text-xl font-bold text-center">M i r a i m</h1>
        </Link>
      </div>
    </header>
  );
} 