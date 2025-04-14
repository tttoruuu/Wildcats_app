import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ArrowLeft, CheckCircle, MessageCircle, Flame, XCircle } from 'lucide-react';

export default function ConversationTipsLater() {
  const router = useRouter();

  return (
    <Layout title="会話のポイント（3回目以降）" hideHeader={true}>
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
        <h1 className="text-2xl font-bold mt-16 mb-12 text-center text-[#FF8551]">会話のポイント</h1>

        <div className="w-full max-w-md">
          {/* ステージ説明 */}
          <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-2 text-[#FF8551]">
              🌸【2回目以降】のプレ交際
            </h2>
            <p className="text-sm text-gray-700">
              「少し深い話をしつつ、将来の方向性を確認していく段階」
            </p>
          </div>

          {/* 大事なこと・心がけたいこと */}
          <div className="mb-6 bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
            <h2 className="text-sm font-semibold mb-3 flex items-center">
              <span className="mr-2 p-1.5 rounded-full bg-[#FFF0E8]">
                <CheckCircle className="w-5 h-5 text-[#FF8551]" />
              </span>
              大事なこと・心がけたいこと
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 pl-2">
              <li>「この人ともっと一緒にいたらどうなるか」を想像してみる</li>
              <li>違いがあった時にどう感じるか・乗り越えられそうかを考える</li>
              <li>結婚観・家族観・働き方など、少しずつ「深い話題」に入る</li>
              <li>相手を試すような言い方は避ける（自然な対話を意識）</li>
            </ul>
          </div>

          {/* よくある話題 */}
          <div className="mb-6 bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
            <h2 className="text-sm font-semibold mb-3 flex items-center">
              <span className="mr-2 p-1.5 rounded-full bg-[#FFF0E8]">
                <MessageCircle className="w-5 h-5 text-[#FF8551]" />
              </span>
              よくある話題
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 pl-2">
              <li>日々の暮らしのスタイル（起床時間、家事の分担感覚など）</li>
              <li>結婚後の生活イメージ（住む場所・共働き希望の有無など）</li>
              <li>お互いの家族のこと（仲の良さ・行事など）</li>
              <li>お金の使い方（貯金意識・価値の置き方）</li>
              <li>将来の夢・理想のライフスタイル</li>
            </ul>
          </div>

          {/* 盛り上がりやすい話題 */}
          <div className="mb-6 bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
            <h2 className="text-sm font-semibold mb-3 flex items-center">
              <span className="mr-2 p-1.5 rounded-full bg-[#FFF0E8]">
                <Flame className="w-5 h-5 text-[#FF8551]" />
              </span>
              盛り上がりやすい話題
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 pl-2">
              <li>「子どもができたら何を一緒にしたい？」などほっこり系未来話</li>
              <li>料理や家事についての「自分なりのこだわり・苦手なこと」</li>
              <li>「結婚しても大事にしたい趣味や時間」</li>
              <li>「パートナーにされてうれしかったこと（理想の関わり方）」</li>
            </ul>
          </div>

          {/* 避けたい話題・注意点 */}
          <div className="mb-6 bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
            <h2 className="text-sm font-semibold mb-3 flex items-center">
              <span className="mr-2 p-1.5 rounded-full bg-[#FFF0E8]">
                <XCircle className="w-5 h-5 text-[#FF8551]" />
              </span>
              避けたい話題・注意点
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 pl-2">
              <li>「どうして前の交際は終わったの？」など過去の詮索</li>
              <li>一方的な条件提示（「●●じゃなきゃ無理」と言い切る）</li>
              <li>「合わないかも…」という気持ちをその場でぶつける</li>
              <li>返答を急かす・真剣交際の打診を焦る</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
} 