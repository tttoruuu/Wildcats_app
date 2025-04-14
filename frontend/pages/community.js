import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import Post from '../components/community/Post';
import NewPostForm from '../components/community/NewPostForm';
import { getPostsService, getTagsService } from '../services/post';
import { ArrowLeft, RefreshCw, X, Filter, ChevronDown } from 'lucide-react';

export default function CommunityPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const filterDropdownRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/auth/login');
      return;
    }
    setToken(storedToken);
    fetchPosts(storedToken, null);
    fetchTags(storedToken);
  }, [router]);

  // ドロップダウン外のクリックを検知して閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowTagFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchPosts = async (userToken, tagId) => {
    try {
      setError(null);
      setLoading(true);
      const postsData = await getPostsService(userToken, tagId);
      setPosts(postsData);
    } catch (err) {
      console.error('投稿の取得に失敗しました', err);
      setError('投稿の読み込みに失敗しました。ネットワーク接続を確認してください。');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchTags = async (userToken) => {
    try {
      const tagsData = await getTagsService(userToken);
      // タグをカテゴリーごとにグループ化
      const tagsByCategory = tagsData.reduce((acc, tag) => {
        if (!acc[tag.category]) {
          acc[tag.category] = [];
        }
        acc[tag.category].push(tag);
        return acc;
      }, {});
      setTags(tagsByCategory);
    } catch (err) {
      console.error('タグの取得に失敗しました', err);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts(token, selectedTagId);
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const handleTagClick = (tagId) => {
    setSelectedTagId(tagId);
    fetchPosts(token, tagId);
    setShowTagFilter(false);
  };

  const handleClearTagFilter = () => {
    setSelectedTagId(null);
    fetchPosts(token, null);
  };

  const handleToggleTagFilter = () => {
    setShowTagFilter(!showTagFilter);
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

  // 選択中のタグを取得
  const getSelectedTagName = () => {
    if (!selectedTagId) return null;
    
    for (const category in tags) {
      const foundTag = tags[category].find(tag => tag.id === selectedTagId);
      if (foundTag) return foundTag.name;
    }
    return null;
  };

  const selectedTagName = getSelectedTagName();

  // 全てのタグを1つの配列に結合
  const getAllTags = () => {
    const allTags = [];
    for (const category in tags) {
      allTags.push(...tags[category]);
    }
    return allTags;
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
            <div className="flex">
              <button
                onClick={handleToggleTagFilter}
                className="p-2 text-gray-600 hover:text-[#FF8551] mr-1"
              >
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={handleRefresh}
                className={`p-2 text-gray-600 hover:text-[#FF8551] ${refreshing ? 'animate-spin' : ''}`}
                disabled={refreshing}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* タグフィルター表示 */}
          {selectedTagName && (
            <div className="mb-4 flex items-center">
              <span className="text-sm text-gray-700 mr-2">フィルター:</span>
              <div className="flex items-center bg-[#FF8551] text-white text-xs py-1 px-2 rounded-full">
                #{selectedTagName}
                <button
                  onClick={handleClearTagFilter}
                  className="ml-1 text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* タグフィルター選択UI - ドロップダウンメニュー */}
          <div className="relative" ref={filterDropdownRef}>
            {showTagFilter && (
              <div className="absolute top-0 right-0 z-20 w-full mb-4 bg-white rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-3 border-b">
                  <h3 className="font-medium text-gray-800">タグでフィルタリング</h3>
                  <button
                    onClick={handleToggleTagFilter}
                    className="text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-3 max-h-80 overflow-y-auto">
                  {Object.entries(tags).map(([category, categoryTags]) => (
                    <div key={category} className="mb-3">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">{category}</h4>
                      <div className="flex flex-wrap gap-1">
                        {categoryTags.map(tag => (
                          <button
                            key={tag.id}
                            onClick={() => handleTagClick(tag.id)}
                            className={`text-xs py-1 px-2 rounded-full ${
                              selectedTagId === tag.id
                                ? 'bg-[#FF8551] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            #{tag.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
} 