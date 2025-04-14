from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
import os
from datetime import datetime, timedelta
from typing import Optional

# JWTの設定
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24時間

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="認証情報が無効です",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_expired_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="トークンの有効期限が切れています",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user_not_found_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="ユーザーが見つかりませんでした",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        print(f"トークン検証開始: {token[:10]}...")
        
        # トークンのデコードを試みる
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # ユーザー名（sub）の確認
        username: str = payload.get("sub")
        if username is None:
            print("トークンにユーザー名が含まれていません")
            raise credentials_exception
        
        print(f"トークンのデコード成功: ユーザー {username}")
        
        # トークンの有効期限を確認
        exp = payload.get("exp")
        if exp is None:
            print("トークンに有効期限が設定されていません")
            raise credentials_exception
            
        # 現在の時刻と有効期限を比較
        current_time = datetime.utcnow().timestamp()
        exp_time = datetime.fromtimestamp(exp)
        
        print(f"トークン有効期限: {exp_time}, 現在時刻: {datetime.utcnow()}")
        
        # 有効期限が切れている場合
        if current_time > exp:
            time_diff = current_time - exp
            print(f"トークンの有効期限切れ: {exp_time} (期限切れから {time_diff:.2f} 秒経過)")
            raise token_expired_exception
        
        # 残り有効期間を計算
        remaining_time = exp - current_time
        print(f"トークン残り有効期間: {remaining_time:.2f} 秒 ({remaining_time/60:.2f} 分)")
            
    except JWTError as e:
        print(f"JWTデコードエラー: {str(e)}")
        raise credentials_exception
    
    # ユーザーの検索
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        print(f"ユーザー {username} がデータベースに見つかりません")
        raise user_not_found_exception
    
    print(f"ユーザー {username} の認証に成功しました")
    return user 