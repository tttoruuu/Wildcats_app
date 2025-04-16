import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow, addHours } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { likePostService, unlikePostService } from '../../services/post';
import ReplyForm from './ReplyForm';
import ReplyList from './ReplyList';

export default function Post({ post, token, onLikeUpdate, onTagClick, isReply = false }) {
  const [isLiked, setIsLiked] = useState(post.is_liked_by_user);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLoading, setIsLoading] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);

  // UTCの時間に9時間加算して日本時間に調整
  const postDateJST = addHours(new Date(post.created_at), 9);
  const formattedDate = formatDistanceToNow(postDateJST, {
    addSuffix: true,
    locale: ja
  });

  const handleLikeToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isLiked) {
        await unlikePostService(token, post.id);
        setLikesCount(prev => prev - 1);
      } else {
        await likePostService(token, post.id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      
      // 親コンポーネントに通知
      if (onLikeUpdate) {
        onLikeUpdate(post.id, !isLiked);
      }
    } catch (error) {
      console.error('いいね処理エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagClick = (tagId) => {
    if (onTagClick) {
      onTagClick(tagId);
    }
  };

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
    if (!showReplyForm) {
      setShowReplies(true);
    }
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReplyAdded = (newReply) => {
    // 新しい返信を追加して表示
    setReplies([newReply, ...replies]);
    // 返信数を更新
    post.replies_count = (post.replies_count || 0) + 1;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 mb-4 ${isReply ? 'border-l-4 border-orange-200' : ''}`}>
      {/* 投稿者情報 */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3 border border-gray-200">
          <Image
            src={post.user_profile_image_url || "/images/demo.png"}
            alt={post.username}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium text-gray-800">@{post.username}</p>
        </div>
        <span className="ml-auto text-xs text-gray-400">{formattedDate}</span>
      </div>

      {/* 投稿内容 */}
      <p className="text-gray-700 mb-3 whitespace-pre-line">{post.content}</p>

      {/* タグ表示 */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.id)}
              className="text-xs py-1 px-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}

      {/* 投稿画像（あれば表示） */}
      {post.image_url && (
        <div className="relative w-full h-60 mb-3 rounded-lg overflow-hidden">
          <Image
            src={post.image_url}
            alt="Post image"
            fill
            className="object-cover"
            unoptimized={true}
          />
        </div>
      )}

      {/* アクションボタン */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLikeToggle}
          disabled={isLoading}
          className="flex items-center text-gray-600 hover:text-[#FF8551] transition-colors"
        >
          <Heart
            className={`w-5 h-5 mr-1 ${
              isLiked ? 'fill-[#FF8551] text-[#FF8551]' : 'fill-none'
            }`}
          />
          <span className="text-sm">{likesCount}</span>
        </button>

        {/* 返信ボタン */}
        {!isReply && (
          <button
            onClick={toggleReplyForm}
            className="flex items-center text-gray-600 hover:text-[#FF8551] transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-1" />
            <span className="text-sm">返信</span>
          </button>
        )}

        {/* 返信を表示するボタン（返信が存在する場合） */}
        {!isReply && post.replies_count > 0 && (
          <button
            onClick={toggleReplies}
            className="flex items-center text-gray-600 hover:text-[#FF8551] transition-colors ml-auto"
          >
            <span className="text-sm mr-1">{post.replies_count}件の返信</span>
            {showReplies ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* 返信フォーム */}
      {showReplyForm && !isReply && (
        <div className="mt-4 border-t pt-3">
          <ReplyForm 
            token={token} 
            parentId={post.id} 
            onReplyAdded={handleReplyAdded} 
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* 返信一覧 */}
      {!isReply && showReplies && post.replies_count > 0 && (
        <div className="mt-4 border-t pt-3">
          <ReplyList 
            parentId={post.id} 
            token={token} 
            replies={replies}
            setReplies={setReplies}
            repliesLoaded={repliesLoaded}
            setRepliesLoaded={setRepliesLoaded}
            onLikeUpdate={onLikeUpdate}
            onTagClick={onTagClick}
          />
        </div>
      )}
    </div>
  );
} 