import { useState } from 'react';
import { X } from 'lucide-react';
import { createPostService } from '../../services/post';

export default function ReplyForm({ token, parentId, onReplyAdded, onCancel }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('返信内容を入力してください');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // 返信を投稿（親投稿IDを指定）
      const newReply = await createPostService(token, {
        content: content.trim(),
        parent_id: parentId
      });
      
      // フォームをリセット
      setContent('');
      
      // 親コンポーネントに通知
      if (onReplyAdded) {
        onReplyAdded(newReply);
      }
      
      // 返信フォームを閉じるオプション
      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      console.error('返信の投稿に失敗しました', err);
      setError('返信の投稿に失敗しました。再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">返信を投稿</h3>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="返信を入力..."
          className="w-full p-2 border rounded-lg text-sm mb-2 resize-none focus:border-[#FF8551] focus:ring-1 focus:ring-[#FF8551] focus:outline-none"
          rows={2}
          maxLength={500}
        />
        
        {error && (
          <p className="text-red-500 text-xs mb-2">{error}</p>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={`
              py-1 px-3 rounded-full text-xs font-medium text-white
              ${isSubmitting || !content.trim() 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-[#FF8551] hover:bg-[#E07B50]'}
            `}
          >
            {isSubmitting ? '送信中...' : '返信する'}
          </button>
        </div>
      </form>
    </div>
  );
} 