import { useEffect } from 'react';
import Post from './Post';
import { getPostRepliesService } from '../../services/post';

export default function ReplyList({
  parentId,
  token,
  replies,
  setReplies,
  repliesLoaded,
  setRepliesLoaded,
  onLikeUpdate,
  onTagClick
}) {
  // 返信を取得
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        if (!repliesLoaded) {
          const repliesData = await getPostRepliesService(token, parentId);
          setReplies(repliesData);
          setRepliesLoaded(true);
        }
      } catch (err) {
        console.error('返信の取得に失敗しました', err);
      }
    };

    fetchReplies();
  }, [parentId, token, repliesLoaded, setReplies, setRepliesLoaded]);

  // 返信がない場合
  if (replies.length === 0 && repliesLoaded) {
    return <p className="text-gray-500 text-sm text-center py-2">返信はまだありません</p>;
  }

  // ローディング表示
  if (replies.length === 0 && !repliesLoaded) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#FF8551]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pl-2">
      {replies.map(reply => (
        <Post
          key={reply.id}
          post={reply}
          token={token}
          onLikeUpdate={onLikeUpdate}
          onTagClick={onTagClick}
          isReply={true}
        />
      ))}
    </div>
  );
} 