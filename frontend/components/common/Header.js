import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
    <header className="bg-gray-800 text-white p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          {user.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt="プロフィール"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center">
              <span className="text-white text-xs">{user.username.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold">
            Hi, {user.username} <span className="text-yellow-400">👋</span>
          </h1>
          <p className="text-sm text-gray-300">{user.full_name}</p>
        </div>
      </div>
    </header>
  );
} 