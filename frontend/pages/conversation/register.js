import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { Users, ArrowLeft } from 'lucide-react';

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
      await apiService.partners.createPartner(formData);
      router.push('/conversation');
    } catch (err) {
      console.error('会話相手の登録に失敗しました', err);
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
