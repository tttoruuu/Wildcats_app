import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import Post from '../components/community/Post';
import NewPostForm from '../components/community/NewPostForm';
import { getPostsService } from '../services/post';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function CommunityPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/auth/login');
      return;
    }
    setToken(storedToken);
    fetchPosts(storedToken);
  }, [router]);

  const fetchPosts = async (userToken) => {
    try {
      setError(null);
      const postsData = await getPostsService(userToken);
      setPosts(postsData);
    } catch (err) {
      console.error('投稿の取得に失敗しました', err);
      setError('投稿の読み込みに失敗しました。ネットワーク接続を確認してください。');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts(token);
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const handleNewPost = (newPost) => {
    // 新規投稿を先頭に追加
    setPosts([
      {
        ...newPost,
        username: newPost.username || '現在のユーザー', // APIから返ってこない場合
        user_full_name: newPost.user_full_name || '名前未設定',
        user_profile_image_url: newPost.user_profile_image_url || '/images/demo.png'
      },
      ...posts
    ]);
  };

  const handleLikeUpdate = (postId, isLiked) => {
    // いいねの状態を更新
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            is_liked_by_user: isLiked,
            likes_count: isLiked ? post.likes_count + 1 : post.likes_count - 1
          }
        : post
    ));
  };

  return (
    <>
      <Head>
        <title>コミュニティ | Miraim</title>
      </Head>

      <Layout hideHeader={true}>
        <div className="max-w-md mx-auto px-4 py-6 bg-[#F5F5F5] min-h-screen">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackClick}
              className="p-2 text-gray-600 hover:text-[#FF8551]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-[#FF8551]">コミュニティ</h1>
            <button
              onClick={handleRefresh}
              className={`p-2 text-gray-600 hover:text-[#FF8551] ${refreshing ? 'animate-spin' : ''}`}
              disabled={refreshing}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* 新規投稿フォーム */}
          {token && <NewPostForm token={token} onPostCreated={handleNewPost} />}

          {/* 投稿一覧 */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8551]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
              {error}
              <button
                onClick={handleRefresh}
                className="block mx-auto mt-2 text-[#FF8551] underline"
              >
                再試行する
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-500 mb-2">投稿がありません</p>
              <p className="text-sm text-gray-400">
                最初の投稿を作成してコミュニティを盛り上げましょう！
              </p>
            </div>
          ) : (
            <div>
              {posts.map(post => (
                <Post
                  key={post.id}
                  post={post}
                  token={token}
                  onLikeUpdate={handleLikeUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
} 