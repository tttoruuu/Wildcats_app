import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { Users, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function RegisterPartner() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    hometown: '',
    hobbies: '',
    daily_routine: '',
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
      // デバッグ情報を表示
      console.log('API_BASE_URL: ', apiService.baseUrl || 'undefined');
      
      // トークンの確認
      const token = localStorage.getItem('token');
      console.log('Token exists: ', !!token);
      if (!token) {
        console.log('トークンが存在しません。ログイン画面にリダイレクトします。');
        router.push('/auth/login');
        return;
      }
      
      // トークンの簡易検証
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload:', payload);
          if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            const now = new Date();
            console.log('Token expires:', expDate.toISOString());
            console.log('Token expired:', expDate < now);
            if (expDate < now) {
              console.log('トークンの期限が切れています。ログインし直してください。');
              localStorage.removeItem('token');
              router.push('/auth/login');
              return;
            }
          }
        }
      } catch (e) {
        console.error('トークン検証エラー:', e);
        localStorage.removeItem('token');
        router.push('/auth/login');
        return;
      }
      
      console.log('Submitting form data: ', formData);
      
      // Mixed Contentエラー回避のための直接HTTPS変換対策
      try {
        // 通常のAPI呼び出しを試す
        await apiService.partners.createPartner(formData);
        console.log('Partner registered successfully');
        router.push('/conversation');
      } catch (apiError) {
        console.error('標準APIでのエラー:', apiError);
        
        // Mixed Contentエラーが原因と思われる場合、直接axiosでHTTPSリクエストを試みる
        if (apiError.message && (
            apiError.message.includes('Mixed Content') || 
            apiError.message.includes('blocked') || 
            apiError.message === 'Network Error')) {
          
          console.log('Mixed Contentエラーの可能性があります。直接HTTPSで再試行します。');
          
          // バックエンドのURLを強制的にHTTPSに変換
          const backendUrl = apiService.baseUrl || 'https://backend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io';
          const httpsUrl = backendUrl.replace('http:', 'https:');
          console.log('直接HTTPSで試行:', httpsUrl);
          
          const response = await axios.post(`${httpsUrl}/conversation-partners`, formData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          
          console.log('HTTPS直接リクエスト成功:', response.status);
          router.push('/conversation');
          return;
        }
        
        // 他のエラーは通常のエラーハンドリングへ
        throw apiError;
      }
    } catch (err) {
      console.error('会話相手の登録に失敗しました', err);
      
      // 詳細なエラーログ
      if (err.response) {
        console.error('Error response:', {
          status: err.response.status,
          statusText: err.response.statusText,
          headers: err.response.headers,
          data: err.response.data
        });
      } else if (err.request) {
        console.error('Error request:', err.request);
      } else {
        console.error('Error message:', err.message);
      }
      
      setError('会話相手の登録に失敗しました。もう一度お試しください。');
      if (err.response && err.response.status === 401) {
        apiService.auth.logout();
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="会話相手の登録" hideHeader={true}>
      <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] text-gray-800 px-6 py-4">

        {/* 上部ヘッダーエリア */}
        <div className="w-full max-w-md mt-4 mb-2">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-[#FF8551] text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={18} className="mr-1" />
            もどる
          </button>
        </div>

        <div className="w-full max-w-md text-center mb-6 mt-2 flex items-center justify-center gap-2">
          <Users className="w-6 h-6 text-[#FF8551]" />
          <h1 className="text-lg font-bold text-[#FF8551]">
            お見合いの相手について教えてください
          </h1>
        </div>

        {error && (
          <div className="w-full max-w-md bg-red-500 text-white p-3 rounded-2xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">名前を教えてください</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 text-gray-800 bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8551] shadow-sm"
              placeholder="Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">おいくつですか</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full p-3 text-gray-800 bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8551] shadow-sm"
              placeholder="40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">出身地はどこですか？</label>
            <input
              type="text"
              name="hometown"
              value={formData.hometown}
              onChange={handleChange}
              required
              className="w-full p-3 text-gray-800 bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8551] shadow-sm"
              placeholder="愛知県"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">趣味はなんですか</label>
            <textarea
              name="hobbies"
              value={formData.hobbies}
              onChange={handleChange}
              required
              className="w-full p-3 text-gray-800 bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8551] shadow-sm"
              placeholder="カメラが好きで風景写真をとったりする"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">休日はどのように過ごしていますか</label>
            <textarea
              name="daily_routine"
              value={formData.daily_routine}
              onChange={handleChange}
              required
              className="w-full p-3 text-gray-800 bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8551] shadow-sm"
              placeholder="写真を撮りに出かけたり、カフェに行くことが多い 映画鑑賞も好き"
              rows="3"
            />
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-[#FF8551] to-[#FFA46D] w-full text-white rounded-full py-3 px-6 shadow-md ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {loading ? '登録中...' : '情報を登録する'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
