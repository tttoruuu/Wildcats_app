import axios from 'axios';

// APIのベースURL - 環境に応じて適切に設定
const API_BASE_URL = (() => {
  // 1. サーバーサイドでの実行
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || 'http://backend:8000';
  }
  
  // 2. クライアントサイドでの実行
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
})();

console.log('Using API URL:', API_BASE_URL);

// 認証済みAPIクライアントの作成
const getAuthenticatedClient = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (!token) {
    console.error('トークンが存在しません');
    throw new Error('認証が必要です');
  }

  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    timeout: 120000, // タイムアウトを120秒に延長
  });

  // レスポンスインターセプターを追加
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // 401エラーで、かつリトライされていない場合
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // トークンをクリア
          localStorage.removeItem('token');
          // ログインページにリダイレクト
          window.location.href = '/auth/login';
        } catch (refreshError) {
          console.error('トークンの更新に失敗しました:', refreshError);
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// 認証関連のAPI
export const authAPI = {
  // ユーザー登録
  register: async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      console.log('API URL:', API_BASE_URL);
      
      // シンプルなCORSリクエスト - credentials無しでCORSエラーを回避
      const response = await axios.post(`${API_BASE_URL}/register`, userData, {
        withCredentials: false,  // クレデンシャルを使用しない
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Register error details:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // ログイン
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password }, {
        withCredentials: false,  // クレデンシャルを使用しない
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const { access_token, token_type } = response.data;
      // トークンをローカルストレージに保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', access_token);
      }
      return { access_token, token_type };
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // ログアウト
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
  
  // 現在のユーザー情報を取得
  getCurrentUser: async () => {
    try {
      console.log('現在のユーザー情報を取得中...');
      const client = getAuthenticatedClient();
      const response = await client.get('/me');
      console.log('ユーザー情報取得成功:', response.data);
      return response.data;
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
      if (error.response?.status === 401) {
        // 認証エラーの場合、トークンを削除
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
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
  simulateConversation: async (partnerId, meetingCount, level, message, chatHistory = []) => {
    try {
      console.log('会話シミュレーション開始:', { partnerId, meetingCount, level, message });
      const client = getAuthenticatedClient();
      const response = await client.post('/conversation', {
        partnerId,
        meetingCount,
        level,
        message,
        chatHistory
      });
      console.log('会話シミュレーション成功:', response.data);
      return response.data;
    } catch (error) {
      console.error('会話シミュレーションエラー:', error);
      if (error.response) {
        console.error('エラーレスポンス:', error.response.data);
        console.error('エラーステータス:', error.response.status);
      }
      throw error.response?.data || { detail: 'ネットワークエラーが発生しました' };
    }
  },
  
  // 会話内容からフィードバックを生成
  generateFeedback: async (messages, partnerId, meetingCount, level) => {
    try {
      console.log('フィードバック生成開始:', { messagesCount: messages.length, partnerId, meetingCount, level });
      
      // APIが実装されていないため、モックデータを返す
      // 実際のバックエンドAPIができたらこの部分を修正する
      console.log('モックフィードバックを生成します');
      
      // 会話履歴に基づいた簡易分析 (生成AIを使うのが理想)
      const userMessages = messages.filter(msg => msg.sender === 'user');
      const userMessageCount = userMessages.length;
      const questionCount = userMessages.filter(msg => 
        msg.text.includes('？') || msg.text.includes('?') || 
        msg.text.includes('ですか') || msg.text.includes('何') || 
        msg.text.includes('どう')).length;
      
      return {
        summary: `${userMessageCount}回の発言で、自然な会話ができていました。質問の数や内容から会話を深める意識が見られます。`,
        rating: Math.min(5, Math.max(3, Math.floor(userMessageCount / 2))),
        goodPoints: [
          '相手の話に興味を示し、質問を投げかけていました',
          '自分の経験や考えをうまく表現できていました',
          '会話の流れを自然に保てていました',
          questionCount > 2 ? '適切な質問で会話を発展させていました' : '基本的なコミュニケーションができていました'
        ],
        improvementPoints: [
          '質問のバリエーションをもう少し増やすと良いでしょう',
          '時々相手の質問に直接答えずに話題を変えることがありました',
          '会話の深まりをもう少し意識すると良いでしょう',
          questionCount < 3 ? '相手の話に対してもう少し質問を増やすと良いでしょう' : '質問の内容をさらに深めると良いでしょう'
        ],
        practicePoints: [
          '相手の話をさらに深堀りする質問を心がけましょう',
          '自分の考えに加えて、具体的なエピソードも交えると効果的です',
          '相手の話に共感や理解を示す表現を増やしましょう',
          userMessageCount < 5 ? 'もう少し積極的に会話に参加すると良いでしょう' : '会話のバランスを意識して話すと良いでしょう'
        ]
      };
    } catch (error) {
      console.error('フィードバック生成エラー:', error);
      // エラー時はデフォルトのフィードバックを返す
      return {
        summary: "会話の分析に基づいたフィードバックを生成しました。",
        rating: 4,
        goodPoints: [
          '相手の話に興味を示し、質問を投げかけていました',
          '自分の経験や考えをうまく表現できていました',
          '会話の流れを自然に保てていました'
        ],
        improvementPoints: [
          '質問のバリエーションをもう少し増やすと良いでしょう',
          '時々相手の質問に直接答えずに話題を変えることがありました',
          '会話の深まりをもう少し意識すると良いでしょう'
        ],
        practicePoints: [
          '相手の話をさらに深堀りする質問を心がけましょう',
          '自分の考えに加えて、具体的なエピソードも交えると効果的です',
          '相手の話に共感や理解を示す表現を増やしましょう'
        ]
      };
    }
  },
};

// プロフィール関連のAPI
export const profileAPI = {
  // プロフィール画像のアップロード
  uploadProfileImage: async (file) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
      console.error('Profile image upload error:', error);
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