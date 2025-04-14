import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ArrowLeft } from 'lucide-react';

export default function TipsSelection() {
  const router = useRouter();

  return (
    <Layout title="会話のTips選択" hideHeader={true}>
      <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] text-gray-800 px-6 py-4">
        <div className="w-full max-w-md mt-8 relative">
          <button 
            onClick={() => router.back()}
            className="text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-0"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold mt-16 mb-12 text-center text-[#FF8551]">会話のTipsを選択</h1>
        
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <p className="text-gray-700">ご覧になりたい会話のTipsを選択してください</p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => router.push('/conversation/tips-first')}
              className="w-full bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full py-3 px-6 text-center shadow-sm hover:opacity-90 transition-all"
            >
              初回
            </button>

            <button
              onClick={() => router.push('/conversation/tips-later')}
              className="w-full bg-white text-[#FF8551] border border-[#FF8551]/70 rounded-full py-3 px-6 text-center shadow-sm hover:bg-[#FFF1E9] transition-colors"
            >
              2回目以降
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 