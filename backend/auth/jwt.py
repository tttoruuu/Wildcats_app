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
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24時間に変更

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
    try:
        print(f"トークン受信: {token[:10]}...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
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
            
        current_time = datetime.utcnow().timestamp()
        if current_time > exp:
            print(f"トークンの有効期限切れ: {datetime.fromtimestamp(exp)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="トークンの有効期限が切れています",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
    except JWTError as e:
        print(f"JWTデコードエラー: {str(e)}")
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        print(f"ユーザー {username} がデータベースに見つかりません")
        raise credentials_exception
    print(f"ユーザー {username} の認証に成功しました")
    return user 