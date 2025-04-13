import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ArrowLeft, CheckCircle, MessageCircle, Flame, XCircle } from 'lucide-react';

export default function ConversationTipsFirst() {
  const router = useRouter();

  return (
    <Layout title="会話のポイント（初回）" hideHeader={true}>
      <div 
        className="flex flex-col min-h-screen text-gray-800"
        style={{
          backgroundImage: `url('/images/back.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundColor: 'rgba(230, 230, 230, 0.7)',
          backgroundBlendMode: 'overlay'
        }}
      >
        {/* ヘッダー */}
        <div className="bg-transparent pt-8 px-6 p-4 flex flex-col items-center relative">
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-8 text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity"
            aria-label="戻る"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
          <h1 className="text-xl font-bold text-[#FF8551]">会話のポイント</h1>
        </div>

        {/* コンテンツエリア */}
        <div className="flex-grow px-6 py-4 overflow-y-auto">
          <div className="max-w-md mx-auto mb-24">
            {/* ステージ説明 */}
            <div className="mb-6 p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40">
              <h2 className="text-lg font-bold mb-2 text-[#FF8551]">
                🌱【第1～2回目】のプレ交際
              </h2>
              <p className="text-sm text-gray-700">
                「相手の人柄を知る・一緒にいて心地よいかを探る段階」
              </p>
            </div>

            {/* 大事なこと・心がけたいこと */}
            <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-white/40">
              <h2 className="text-sm font-semibold mb-3 flex items-center">
                <span className="mr-2 p-1.5 rounded-full bg-[#FFF0E8]">
                  <CheckCircle className="w-5 h-5 text-[#FF8551]" />
                </span>
                大事なこと・心がけたいこと
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 pl-2">
                <li>笑顔と相づちを意識して、会話を丁寧に楽しむ</li>
                <li>お互いに「無理せず話せる人か」を見極める</li>
                <li>価値観の違いを「否定」せず、まずは「受け止める」</li>
                <li>質問→共感→自分の話を返す、を意識したキャッチボール</li>
              </ul>
            </div>

            {/* よくある話題 */}
            <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-white/40">
              <h2 className="text-sm font-semibold mb-3 flex items-center">
                <span className="mr-2 p-1.5 rounded-full bg-[#FFF0E8]">
                  <MessageCircle className="w-5 h-5 text-[#FF8551]" />
                </span>
                よくある話題
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 pl-2">
                <li>休日の過ごし方、趣味・好きなこと</li>
                <li>出身地や学生時代の話</li>
                <li>好きな食べ物・お店・最近行った場所</li>
                <li>旅行・行ってみたいところ</li>
                <li>お仕事のやりがいや環境（話しやすい範囲で）</li>
              </ul>
            </div>

            {/* 盛り上がりやすい話題 */}
            <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-white/40">
              <h2 className="text-sm font-semibold mb-3 flex items-center">
                <span className="mr-2 p-1.5 rounded-full bg-[#FFF0E8]">
                  <Flame className="w-5 h-5 text-[#FF8551]" />
                </span>
                盛り上がりやすい話題
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 pl-2">
                <li>「学生時代どんなタイプでした？」系の雑談</li>
                <li>好きなテレビ番組、マンガ、ゲーム、YouTubeなどの共通項</li>
                <li>幼少期・地元のちょっとしたエピソード（ほっこり話）</li>
                <li>「お互い似てるかも」につながるネタ探し</li>
              </ul>
            </div>

            {/* 避けたい話題・注意点 */}
            <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-white/40">
              <h2 className="text-sm font-semibold mb-3 flex items-center">
                <span className="mr-2 p-1.5 rounded-full bg-[#FFF0E8]">
                  <XCircle className="w-5 h-5 text-[#FF8551]" />
                </span>
                避けたい話題・注意点
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 pl-2">
                <li>結婚観や家庭像を詰めすぎる（時期・子どもなど）</li>
                <li>ネガティブな話題（仕事の愚痴、他人の悪口）</li>
                <li>相手を評価するような質問（例：「年収は？」「持ち家ですか？」）</li>
                <li>相手の外見やスペックを軽く扱う発言</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
} 