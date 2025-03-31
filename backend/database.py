from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models.user import Base

import os
import sys
from dotenv import load_dotenv
from pathlib import Path

# .envファイルの絶対パスを取得
current_dir = Path(__file__).resolve().parent
env_path = current_dir / ".env"

# .envファイルを読み込み
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("環境変数DATABASE_URLが設定されていません")
    print(f"環境変数を探しているパス: {env_path}")
    print(f"現在の環境変数: {os.environ}")
    raise ValueError("DATABASE_URL is not set in environment variables")

engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    pool_recycle=3600
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
