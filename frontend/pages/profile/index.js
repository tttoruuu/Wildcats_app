import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../components/Layout';
import Button from '../../components/common/Button';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

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
        setError('ユーザー情報の取得に失敗しました。');
      }
    };

    fetchUser();
  }, [router]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/upload-profile-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const response = await axios.get('http://localhost:8000/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setSelectedFile(null);
    } catch (err) {
      setError('画像のアップロードに失敗しました。');
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">プロフィール画像設定</h2>
          
          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}

          <div className="mb-6">
            {user.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt="プロフィール画像"
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
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
            className={`w-full ${
              !selectedFile ? 'bg-gray-400 cursor-not-allowed' : ''
            }`}
          >
            アップロード
          </Button>
        </div>
      </div>
    </Layout>
  );
} 