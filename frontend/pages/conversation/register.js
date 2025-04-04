import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../components/Layout';

export default function RegisterPartner() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    hometown: '',
    hobbies: '',
    dailyRoutine: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // バックエンドAPIが実装されるまで、ローカルストレージに保存
      const partnersData = JSON.parse(localStorage.getItem('conversationPartners') || '[]');
      const newPartner = {
        id: Date.now().toString(), // 一意のIDを生成
        ...formData
      };
      partnersData.push(newPartner);
      localStorage.setItem('conversationPartners', JSON.stringify(partnersData));

      /* コメントアウト：バックエンドAPIが実装されたら有効化
      await axios.post(
        'http://localhost:8000/conversation-partners',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      */

      // 登録成功後、会話練習機能のトップ画面に遷移
      router.push('/conversation');
    } catch (err) {
      console.error('会話相手の登録に失敗しました', err);
      setError('会話相手の登録に失敗しました。もう一度お試しください。');
      
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="会話相手の登録">
      <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mt-8 mb-6 text-center">お見合いの相手について教えてください</h1>
        
        {error && (
          <div className="w-full max-w-md bg-red-500 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 mb-8">
          <div>
            <label className="block text-sm mb-2">名前を教えてください</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 text-gray-800 bg-white rounded-md focus:outline-none"
              placeholder="Name"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">おいくつですか</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full p-3 text-gray-800 bg-white rounded-md focus:outline-none"
              placeholder="40"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">出身地はどこですか？</label>
            <input
              type="text"
              name="hometown"
              value={formData.hometown}
              onChange={handleChange}
              required
              className="w-full p-3 text-gray-800 bg-white rounded-md focus:outline-none"
              placeholder="愛知県"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">趣味はなんですか</label>
            <textarea
              name="hobbies"
              value={formData.hobbies}
              onChange={handleChange}
              required
              className="w-full p-3 text-gray-800 bg-white rounded-md focus:outline-none"
              placeholder="カメラが好きで風景写真をとったりする"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">休日はどのように過ごしていますか</label>
            <textarea
              name="dailyRoutine"
              value={formData.dailyRoutine}
              onChange={handleChange}
              required
              className="w-full p-3 text-gray-800 bg-white rounded-md focus:outline-none"
              placeholder="写真を撮りに出かけたり、カフェに行くことが多い 映画鑑賞も好き"
              rows="3"
            />
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-orange-300 w-full text-white rounded-full py-3 px-6 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-400'
              }`}
            >
              {loading ? '登録中...' : '情報を登録する'}
            </button>
          </div>
        </form>
        
        <div className="fixed bottom-0 w-full max-w-md py-4 bg-gray-800">
          <div className="flex justify-between px-12">
            <button
              onClick={() => router.push('/')}
              className="text-orange-300 flex flex-col items-center"
            >
              <span className="text-2xl">⌂</span>
              <span className="text-xs">Home</span>
            </button>
            
            <button
              onClick={() => router.push('/favorites')}
              className="text-gray-400 flex flex-col items-center"
            >
              <span className="text-2xl">♡</span>
              <span className="text-xs">いいね</span>
            </button>
            
            <button
              onClick={() => router.push('/profile')}
              className="text-gray-400 flex flex-col items-center"
            >
              <span className="text-2xl">👤</span>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 