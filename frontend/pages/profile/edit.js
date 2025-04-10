import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Button from '../../components/common/Button';
import apiService from '../../services/api';
import { ArrowLeft } from 'lucide-react';

export default function ProfileEdit() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // apiService.auth.getCurrentUser()を使用してユーザー情報を取得
        const userData = await apiService.auth.getCurrentUser();
        setUser(userData);
        setError('');
      } catch (err) {
        setError('ユーザー情報の取得に失敗しました。');
        console.error('ユーザー情報の取得に失敗しました。', err);
        
        // 認証エラー（401）の場合はログイン画面にリダイレクト
        if (err.response && err.response.status === 401) {
          console.log('認証エラー: トークンが無効または期限切れです。再ログインが必要です。');
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // apiService.profile.uploadProfileImage()を使用して画像をアップロード
      await apiService.profile.uploadProfileImage(selectedFile);
      
      // ユーザー情報を更新（プロフィール画像URLを取得するため）
      const updatedUser = await apiService.auth.getCurrentUser();
      setUser(updatedUser);
      
      // 成功メッセージを表示
      setSelectedFile(null);
      setSuccess('プロフィール画像が更新されました');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('画像のアップロードに失敗しました。');
      console.error('画像のアップロードに失敗しました。', err);
      
      // 認証エラー（401）の場合はログイン画面にリダイレクト
      if (err.response && err.response.status === 401) {
        console.log('認証エラー: トークンが無効または期限切れです。再ログインが必要です。');
        router.push('/auth/login');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-4 text-center">
        <p className="text-red-600 mb-4">{error || 'ユーザー情報の取得に失敗しました'}</p>
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
    <Layout title="プロフィール編集">
      <div className="px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => router.back()}
              className="text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft size={18} />
              <span>もどる</span>
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-6">プロフィール編集</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {success}
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">プロフィール画像</h3>
            <div className="flex items-center mb-4">
              {user.profile_image_url ? (
                <img
                  src={apiService.getImageUrl(user.profile_image_url)}
                  alt="プロフィール画像"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">画像なし</span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロフィール画像を選択
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`w-full mb-6 ${
                !selectedFile ? 'bg-gray-400 cursor-not-allowed' : ''
              }`}
            >
              アップロード
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 