import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ImagePlus, X, Loader2, Tag as TagIcon, ChevronDown } from 'lucide-react';
import { createPostService, uploadPostImageService, getTagsService } from '../../services/post';
import Button from '../common/Button';

export default function NewPostForm({ token, onPostCreated }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);
  const tagDropdownRef = useRef(null);

  // タグの取得
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getTagsService(token);
        setAllTags(tags);
      } catch (error) {
        console.error('タグの取得に失敗しました:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, [token]);

  // ドロップダウン外のクリックを検知して閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target)) {
        setIsTagDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // タグをカテゴリーごとにグループ化
  const tagsByCategory = allTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

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

  const handleTagToggle = (tagId) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const toggleTagDropdown = () => {
    setIsTagDropdownOpen(!isTagDropdownOpen);
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
      const newPost = await createPostService(token, content, imageUrl, selectedTagIds);
      
      // フォームをリセット
      setContent('');
      setImage(null);
      setImagePreview('');
      setSelectedTagIds([]);
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

  // 選択されているタグを取得
  const getSelectedTags = () => {
    return allTags.filter(tag => selectedTagIds.includes(tag.id));
  };

  const selectedTags = getSelectedTags();

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="何を共有したいですか？"
        className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-1 focus:ring-[#FF8551] focus:border-[#FF8551]"
        rows={3}
      />
      
      {/* タグ選択UI - ドロップダウン形式 */}
      {isLoadingTags ? (
        <div className="flex items-center text-gray-500 mb-3">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          タグを読み込み中...
        </div>
      ) : (
        <div className="mb-3 relative" ref={tagDropdownRef}>
          {/* ドロップダウントリガーボタン */}
          <button
            type="button"
            onClick={toggleTagDropdown}
            className="flex items-center justify-between w-full p-2 border border-gray-200 rounded-lg text-gray-700 hover:border-[#FF8551] focus:outline-none"
          >
            <div className="flex items-center">
              <TagIcon className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">
                {selectedTags.length > 0 
                  ? `選択中のタグ: ${selectedTags.length}個` 
                  : 'タグを選択'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {/* 選択したタグの表示 */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedTags.map(tag => (
                <div 
                  key={tag.id} 
                  className="flex items-center bg-[#FF8551] text-white text-xs py-1 px-2 rounded-full"
                >
                  #{tag.name}
                  <button
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className="ml-1 text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* ドロップダウンメニュー */}
          {isTagDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {Object.entries(tagsByCategory).map(([category, tags]) => (
                <div key={category} className="p-2 border-b last:border-b-0">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">{category}</h4>
                  <div className="flex flex-wrap gap-1">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        className={`text-xs py-1 px-2 rounded-full ${
                          selectedTagIds.includes(tag.id)
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
          )}
        </div>
      )}
      
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