import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Heart } from 'lucide-react';
import { likePostService, unlikePostService } from '../../services/post';

export default function Post({ post, token, onLikeUpdate }) {
  const [isLiked, setIsLiked] = useState(post.is_liked_by_user);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(post.created_at), {
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
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
          <h3 className="font-medium text-gray-800">{post.user_full_name}</h3>
          <p className="text-xs text-gray-500">@{post.username}</p>
        </div>
        <span className="ml-auto text-xs text-gray-400">{formattedDate}</span>
      </div>

      {/* 投稿内容 */}
      <p className="text-gray-700 mb-3 whitespace-pre-line">{post.content}</p>

      {/* 投稿画像（あれば表示） */}
      {post.image_url && (
        <div className="relative w-full h-60 mb-3 rounded-lg overflow-hidden">
          <Image
            src={post.image_url}
            alt="Post image"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* いいねボタン */}
      <div className="flex items-center">
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
      </div>
    </div>
  );
} 