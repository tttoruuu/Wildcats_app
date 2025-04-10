from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import shutil
import os
from dotenv import load_dotenv
from database import SessionLocal, engine, Base, get_db
from models.user import User
from models.conversation_partner import ConversationPartner
from models.post import Post
from models.like import Like
from models import schemas
from auth.password import get_password_hash, verify_password
from auth.jwt import create_access_token, get_current_user
from routers import conversation_partners, posts
from fastapi.responses import JSONResponse
import random

# データベースのテーブルを作成
Base.metadata.create_all(bind=engine)

load_dotenv()  # .env読み込み

ENV = os.getenv("ENV", "development")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# CORS設定: 全てのオリジンを許可（セキュリティが問題ない開発環境では有効）
origins = ["*"]  # すべてのオリジンを許可

# 本番環境用に特定のオリジンも追加（両方の方法を試す）
if ENV == "production" and FRONTEND_ORIGIN != "http://localhost:3000":
    specific_origins = [
        FRONTEND_ORIGIN,
        "http://frontend:3000",
        "http://localhost:3000",
        "https://frontend-container.wonderfulbeach-7a1caae1.japaneast.azurecontainerapps.io",
    ]
else:
    specific_origins = [
        "http://localhost:3000",
        "http://frontend:3000",
    ]

app = FastAPI(
    title="お見合い会話練習API",
    description="お見合いの会話練習をサポートするRESTful API",
    version="1.0.0",
)

print("ENV:", ENV)
print("FRONTEND_ORIGIN:", FRONTEND_ORIGIN)

# CORS設定 - ワイルドカード "*" を使って全てのオリジンを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allow_headers=["*"],
    max_age=86400,  # プリフライトリクエストのキャッシュ時間（秒）
    expose_headers=["*"],
)

# デバッグ用
print("CORS allow_origins:", origins)

# 会話相手APIルーターの追加
app.include_router(conversation_partners.router)

# 投稿APIルーターの追加
app.include_router(posts.router)

# データベースセッションの依存関係
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 画像アップロード用のディレクトリ作成
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    """
    APIが稼働中であることを確認するためのエンドポイント
    
    - **戻り値**: APIが稼働中であることを示すメッセージ
    """
    return {"message": "FastAPI is alive!"}

@app.get("/users")
def read_users(db: Session = Depends(get_db)):
    """
    (開発用) 全ユーザーリストを取得するエンドポイント
    
    - **戻り値**: 登録されている全ユーザーのリスト
    """
    users = db.query(User).all()
    return users

@app.post("/users")
def create_user(name: str, email: str, db: Session = Depends(get_db)):
    """
    (開発用) 新規ユーザーを作成するエンドポイント
    
    - **クエリパラメータ**:
        - name (str): ユーザー名
        - email (str): メールアドレス
    - **戻り値**: 作成されたユーザー情報
    """
    db_user = User(name=name, email=email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/env")
def get_env():
    """
    (開発用) 環境変数情報を取得するエンドポイント
    
    - **戻り値**: 現在の環境変数情報
    """
    return {
        "ENV": ENV,
        "FRONTEND_ORIGIN": FRONTEND_ORIGIN
    }

#
# 認証関連のエンドポイント
#

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    新規ユーザー登録を行うエンドポイント
    
    - **入力データ**:
        - username (str): ユーザー名
        - password (str): パスワード
        - full_name (str): 氏名
        - email (str): メールアドレス
        - birth_date (date, optional): 生年月日
        - hometown (str, optional): 出身地
        - hobbies (str, optional): 趣味
        - matchmaking_agency (str, optional): 所属結婚相談所名
    - **戻り値**: 作成されたユーザー情報（パスワードを除く）
    - **エラー**: ユーザー名が既に登録されている場合 (400)
    """
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        password_hash=hashed_password,
        full_name=user.full_name,
        email=user.email,
        birth_date=user.birth_date,
        hometown=user.hometown,
        hobbies=user.hobbies,
        matchmaking_agency=user.matchmaking_agency
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    ユーザーログインを行うエンドポイント
    
    - **入力データ**:
        - username (str): ユーザー名
        - password (str): パスワード
    - **戻り値**: アクセストークンとトークンタイプ
    - **エラー**: 認証失敗時 (401)
    """
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    現在ログイン中のユーザー情報を取得するエンドポイント
    
    - **認証**: Bearer トークン認証が必要
    - **戻り値**: 現在認証されているユーザーの情報
    - **エラー**: 認証エラー (401)
    """
    return current_user

@app.post("/upload-profile-image")
def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    プロフィール画像をアップロードするエンドポイント
    
    - **認証**: Bearer トークン認証が必要
    - **入力データ**:
        - file: アップロードする画像ファイル
    - **戻り値**: アップロードされたファイル名
    - **エラー**: 認証エラー (401)
    """
    # ファイルの拡張子を取得
    file_extension = os.path.splitext(file.filename)[1]
    # 新しいファイル名を生成（ユーザーID + 拡張子）
    new_filename = f"{current_user.id}{file_extension}"
    # 保存先のパスを生成
    file_path = os.path.join(UPLOAD_DIR, new_filename)
    
    # ファイルを保存
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # ユーザーのプロフィール画像URLを更新
    current_user.profile_image_url = f"/uploads/{new_filename}"
    db.commit()
    
    return {"filename": new_filename}

#
# 会話シミュレーション関連のエンドポイント
#

@app.post("/conversation")
async def simulate_conversation(
    data: dict,
    current_user: User = Depends(get_current_user)
):
    """
    会話シミュレーションを行うエンドポイント
    
    - **認証**: Bearer トークン認証が必要
    - **入力データ**:
        - partnerId (str): 会話相手のID
        - meetingCount (str): 会話回数 ('first', 'other')
        - level (int): 難易度レベル (1 または 2)
        - message (str): ユーザーからのメッセージ
        - chatHistory (list): チャット履歴
    - **戻り値**: 会話相手からの応答メッセージ
    - **エラー**: 認証エラー (401)
    """
    # パラメータの取得
    partner_id = data.get('partnerId', '')
    meeting_count = data.get('meetingCount', '')
    level = data.get('level', 1)
    message = data.get('message', '')
    chat_history = data.get('chatHistory', [])
    
    # リクエストデータをデバッグ用に出力
    print(f"会話シミュレーションリクエスト: partnerId={partner_id}, meetingCount={meeting_count}, level={level}")
    print(f"ユーザーメッセージ: {message}")
    print(f"チャット履歴: {len(chat_history)}件")
    
    # 緊急フォールバック応答 (APIでエラーが起きた場合の対応)
    fallback_responses = [
        "申し訳ありません、少し考え中です...また話しかけてみてください。",
        "ごめんなさい、うまく言葉が見つかりません。別の話題はどうですか？",
        "少し疲れてしまいました。少し休憩してから続けましょうか？"
    ]
    
    try:
        import openai
        import os
        import random
        from dotenv import load_dotenv
        from openai import OpenAI
        
        # .envファイルから環境変数を読み込む（コンテナ内の環境変数が優先される）
        load_dotenv()
        
        # OpenAI APIキーを設定
        api_key = os.environ.get("OPENAI_API_KEY")
        
        # APIキー情報をデバッグ用に安全に出力
        if api_key:
            masked_key = api_key[:5] + "..." + api_key[-5:] if len(api_key) > 10 else "***" 
            print(f"OpenAI APIキー: {masked_key}")
            
            # APIキーの形式を確認
            import re
            if re.match(r'^sk-[A-Za-z0-9]+$', api_key):
                print("APIキー形式: 有効")
            else:
                print(f"APIキー形式が不正な可能性があります。キーの長さ: {len(api_key)}")
        else:
            print("OpenAI APIキーが設定されていません")
            raise HTTPException(
                status_code=500,
                detail="サーバー設定エラー: OpenAI APIキーが設定されていません。サーバー管理者に連絡してください。"
            )
            
        # OpenAIクライアントを初期化
        try:
            client = OpenAI(api_key=api_key)
            print("OpenAIクライアント初期化成功")
        except Exception as e:
            print(f"OpenAIクライアント初期化エラー: {type(e).__name__}: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"OpenAIクライアント初期化エラー: {str(e)}"
            )
        
        # 相手の情報を取得
        partner_info = "あなたは日本人の女性です。"
        try:
            # partner_idから相手の情報を取得する処理
            # 実際の実装ではデータベースから取得
            pass
        except:
            # エラー時はデフォルト情報を使用
            if partner_id == "1":
                partner_info += "名前はあいさん、24歳、看護師、明るく社交的な性格です。"
            elif partner_id == "2":
                partner_info += "名前はゆうりさん、28歳、デザイナー、冷静で論理的な性格です。"
            elif partner_id == "3":
                partner_info += "名前はしおりさん、22歳、学生、好奇心旺盛な性格です。"
            elif partner_id == "4":
                partner_info += "名前はかおりさん、30歳、会社員、優しくて思いやりがある性格です。"
            elif partner_id == "5":
                partner_info += "名前はなつみさん、26歳、フリーランス、創造的で自由な発想の持ち主です。"
            else:
                partner_info += "名前はあいさん、24歳、看護師、明るく社交的な性格です。"
        
        # 会話の状況を設定
        situation = ""
        if meeting_count == "first":
            situation = "これは初めてのお見合いです。"
        else:
            situation = "これは2回目以降のお見合いです。以前に一度会ったことがあります。"
        
        # 難易度レベルに応じたプロンプト設定
        level_instruction = ""
        if level == 1:
            level_instruction = "簡単な日本語で話してください。長い文章は避け、シンプルな言葉を使ってください。"
        else:
            level_instruction = "自然な日本語で会話してください。より自然で流暢な表現を使ってください。"
        
        # システムプロンプトの構築
        system_prompt = f"""
あなたはお見合い相手のロールプレイを行います。以下の設定に基づいて応答してください。

{partner_info}
{situation}
{level_instruction}

- 優しく丁寧に、時に冗談を交えながら応答してください
- 自然な会話の流れを意識してください
- 質問には適切に答え、時には相手に質問を返してください
- 絵文字を適度に使って、感情を表現してください
- 回答は必ず日本語で行ってください
- 一般的な知識や経験を交えて話し、より自然な人間らしい会話を心がけてください
- 長すぎる回答は避け、80-120文字程度を目安にしてください
"""
        
        # 会話履歴の整形
        messages = [{"role": "system", "content": system_prompt}]
        
        # チャット履歴を追加
        for msg in chat_history:
            role = msg.get("role", "")
            content = msg.get("content", "")
            if role and content:
                messages.append({"role": role, "content": content})
        
        # 最新のユーザーメッセージを追加
        messages.append({"role": "user", "content": message})
        
        # ChatGPT APIを呼び出して応答を生成
        try:
            print("OpenAI APIリクエスト開始...")
            print(f"送信するプロンプト内容: {messages[0]['content'][:100]}...")
            print(f"メッセージ数: {len(messages)}")
            
            # タイムアウト時間を設定（秒単位）- 長めに設定
            timeout_seconds = 120
            
            # API呼び出しを実行
            print(f"OpenAI API呼び出し開始... タイムアウト: {timeout_seconds}秒")
            start_time = __import__('time').time()
            
            try:
                # ヘッダー設定とリトライ回数を調整
                client.api_key = api_key
                client.timeout = timeout_seconds
                client.max_retries = 3  # リトライ回数を増やす
                
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=150,
                    timeout=timeout_seconds
                )
                
                end_time = __import__('time').time()
                print(f"OpenAI API呼び出し完了: {end_time - start_time:.2f}秒")
                
                if response and response.choices:
                    assistant_message = response.choices[0].message.content
                    print(f"OpenAI API応答: {assistant_message}")
                    return {"response": assistant_message}
                else:
                    print("OpenAI API応答が空です")
                    return {"response": random.choice(fallback_responses)}
                    
            except Exception as e:
                print(f"OpenAI API呼び出しエラー: {type(e).__name__}: {str(e)}")
                return {"response": random.choice(fallback_responses)}
                
        except Exception as e:
            print(f"会話シミュレーションエラー: {type(e).__name__}: {str(e)}")
            return {"response": random.choice(fallback_responses)}
            
    except Exception as e:
        print(f"予期せぬエラー: {type(e).__name__}: {str(e)}")
        return {"response": random.choice(fallback_responses)}

# ヘルスチェックエンドポイント
@app.get("/healthcheck")
def health_check():
    """
    サーバーの状態を確認するシンプルなヘルスチェックエンドポイント
    """
    return {"status": "ok", "time": __import__('datetime').datetime.now().isoformat()}