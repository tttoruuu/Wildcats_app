# お見合い会話練習アプリ - フロントエンド

## プロジェクト概要

このプロジェクトは、お見合いの際の会話を練習するためのアプリケーションです。ユーザーは会話相手を登録し、様々なシナリオで会話練習を行うことができます。

## 開発環境のセットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

## プロジェクト構造

```
frontend/
├── components/       # 共通コンポーネント
├── pages/            # Next.jsのページコンポーネント
│   ├── auth/         # 認証関連ページ
│   ├── conversation/ # 会話練習関連ページ
│   ├── profile/      # プロフィール関連ページ
│   └── index.js      # トップページ
├── services/         # APIサービス
│   └── api.js        # APIクライアント
├── styles/           # スタイルファイル
└── public/           # 静的ファイル
```

## 主要機能

1. **ユーザー認証**
   - 登録
   - ログイン
   - プロフィール管理

2. **会話相手管理**
   - 会話相手の登録
   - 会話相手の一覧表示
   - 会話相手の削除

3. **会話練習**
   - 会話シナリオの選択
   - 会話相手との対話
   - 会話履歴の表示

## APIサービスの使い方

apiService.jsを使って、バックエンドAPIと通信します。

### 例: 認証

```javascript
import apiService from '../services/api';

// ログイン
const handleLogin = async (username, password) => {
  try {
    const result = await apiService.auth.login(username, password);
    console.log('ログイン成功:', result);
  } catch (error) {
    console.error('ログイン失敗:', error);
  }
};

// ユーザー情報取得
const fetchUserInfo = async () => {
  try {
    const user = await apiService.auth.getCurrentUser();
    console.log('ユーザー情報:', user);
  } catch (error) {
    console.error('ユーザー情報取得失敗:', error);
  }
};
```

### 例: 会話相手の管理

```javascript
import apiService from '../services/api';

// 会話相手一覧の取得
const fetchPartners = async () => {
  try {
    const partners = await apiService.partners.getPartners();
    console.log('会話相手一覧:', partners);
  } catch (error) {
    console.error('会話相手取得失敗:', error);
  }
};

// 会話相手の登録
const createPartner = async (partnerData) => {
  try {
    const newPartner = await apiService.partners.createPartner(partnerData);
    console.log('新規会話相手:', newPartner);
  } catch (error) {
    console.error('会話相手登録失敗:', error);
  }
};
```

### 例: 会話シミュレーション

```javascript
import apiService from '../services/api';

// 会話メッセージの送信と応答受信
const sendMessage = async (partnerId, meetingCount, scenario, message) => {
  try {
    const response = await apiService.conversation.simulateConversation(
      partnerId,
      meetingCount,
      scenario,
      message
    );
    console.log('相手からの応答:', response.reply);
  } catch (error) {
    console.error('会話シミュレーション失敗:', error);
  }
};
```

## ローカルストレージの利用

認証トークンやユーザーデータはローカルストレージに保存されます：

- `token`: 認証トークン
- `conversationPartners`: 会話相手の情報（APIフォールバック用）

## エラーハンドリング

APIリクエストではtry-catchを使用してエラーをハンドリングします。認証エラー（401）が発生した場合、自動的にログアウト処理が行われ、ログイン画面にリダイレクトされます。 