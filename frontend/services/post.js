import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getPostsService = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('投稿取得エラー:', error);
    throw error;
  }
};

export const createPostService = async (token, content, imageUrl = null) => {
  try {
    const response = await axios.post(
      `${API_URL}/posts`,
      { content, image_url: imageUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('投稿作成エラー:', error);
    throw error;
  }
};

export const uploadPostImageService = async (token, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/posts/upload-image`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' 
      },
    });
    return response.data;
  } catch (error) {
    console.error('画像アップロードエラー:', error);
    throw error;
  }
};

export const likePostService = async (token, postId) => {
  try {
    const response = await axios.post(
      `${API_URL}/posts/${postId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('いいねエラー:', error);
    throw error;
  }
};

export const unlikePostService = async (token, postId) => {
  try {
    await axios.delete(`${API_URL}/posts/${postId}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error('いいね解除エラー:', error);
    throw error;
  }
}; 