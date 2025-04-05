import axios from 'axios';

// APIのベースURL
const API_BASE_URL = 'http://localhost:8000';

// 認証済みAPIクライアントの作成
const getAuthenticatedClient = () => {
  const token = localStorage.getItem('token');
  
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// 認証関連のAPI
export const authAPI = {
  // ユーザー登録
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // ログイン
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
      const { access_token, token_type } = response.data;
      // トークンをローカルストレージに保存
      localStorage.setItem('token', access_token);
      return { access_token, token_type };
    } catch (error) {
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // ログアウト
  logout: () => {
    localStorage.removeItem('token');
  },
  
  // 現在のユーザー情報を取得
  getCurrentUser: async () => {
    try {
      const client = getAuthenticatedClient();
      const response = await client.get('/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // 認証エラーの場合、トークンを削除
        localStorage.removeItem('token');
      }
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
};

// 会話相手関連のAPI
export const partnerAPI = {
  // 会話相手一覧を取得
  getPartners: async () => {
    try {
      const client = getAuthenticatedClient();
      const response = await client.get('/conversation-partners');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // 特定の会話相手の詳細を取得
  getPartner: async (partnerId) => {
    try {
      const client = getAuthenticatedClient();
      const response = await client.get(`/conversation-partners/${partnerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // 会話相手を登録
  createPartner: async (partnerData) => {
    try {
      const client = getAuthenticatedClient();
      const response = await client.post('/conversation-partners', partnerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // 会話相手を削除
  deletePartner: async (partnerId) => {
    try {
      const client = getAuthenticatedClient();
      await client.delete(`/conversation-partners/${partnerId}`);
      return true;
    } catch (error) {
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
};

// 会話シミュレーション関連のAPI
export const conversationAPI = {
  // 会話のシミュレーション
  simulateConversation: async (partnerId, meetingCount, scenario, message) => {
    try {
      const client = getAuthenticatedClient();
      const response = await client.post('/conversation', {
        partnerId,
        meetingCount,
        scenario,
        message,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
};

// プロフィール関連のAPI
export const profileAPI = {
  // プロフィール画像のアップロード
  uploadProfileImage: async (file) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw { detail: '認証が必要です' };
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/upload-profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
};

// サポート用ヘルパー関数
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};

// APIサービスを単一のオブジェクトとしてエクスポート
const apiService = {
  auth: authAPI,
  partners: partnerAPI,
  conversation: conversationAPI,
  profile: profileAPI,
  getImageUrl,
};

export default apiService; 