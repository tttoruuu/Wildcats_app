import { useState, useRef } from 'react';
import Image from 'next/image';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { createPostService, uploadPostImageService } from '../../services/post';
import Button from '../common/Button';

export default function NewPostForm({ token, onPostCreated }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('画像サイズは5MB以下にしてください');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('画像ファイルのみアップロードできます');
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !image) {
      alert('テキストか画像を投稿してください');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      
      // 画像がある場合はアップロード
      if (image) {
        setIsUploading(true);
        const uploadResult = await uploadPostImageService(token, image);
        imageUrl = uploadResult.image_url;
        setIsUploading(false);
      }
      
      // 投稿作成
      const newPost = await createPostService(token, content, imageUrl);
      
      // フォームをリセット
      setContent('');
      setImage(null);
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // 親コンポーネントに通知
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error('投稿作成エラー:', error);
      alert('投稿の作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="何を共有したいですか？"
        className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-1 focus:ring-[#FF8551] focus:border-[#FF8551]"
        rows={3}
      />
      
      {imagePreview && (
        <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={handleImageRemove}
            className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            ref={fileInputRef}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-[#FF8551] transition-colors p-2 rounded-full"
            disabled={isSubmitting || isUploading}
          >
            <ImagePlus className="w-5 h-5" />
          </button>
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting || isUploading || (!content.trim() && !image)}
          className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white px-4 py-2 rounded-full"
        >
          {isSubmitting || isUploading ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isUploading ? '画像アップロード中...' : '投稿中...'}
            </div>
          ) : '投稿する'}
        </Button>
      </div>
    </form>
  );
} 