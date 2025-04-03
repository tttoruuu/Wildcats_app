from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import shutil
import os
from dotenv import load_dotenv
from database import SessionLocal, engine, Base
from models.user import User
from models import schemas, auth

# データベースのテーブルを作成
Base.metadata.create_all(bind=engine)

load_dotenv()  # .env読み込み

ENV = os.getenv("ENV", "development")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

origins = [FRONTEND_ORIGIN]

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    return {"message": "FastAPI is alive!"}

@app.get("/users")
def read_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@app.post("/users")
def create_user(name: str, email: str, db: Session = Depends(get_db)):
    db_user = User(name=name, email=email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/env")
def get_env():
    return {
        "ENV": ENV,
        "FRONTEND_ORIGIN": FRONTEND_ORIGIN
    }

print("ENV:", ENV)
print("FRONTEND_ORIGIN:", FRONTEND_ORIGIN)
print("CORS allow_origins:", origins)

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth.get_password_hash(user.password)
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
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not auth.verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: User = Depends(auth.get_current_user)):
    return current_user

@app.post("/upload-profile-image")
def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
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