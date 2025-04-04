from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
import sys
from dotenv import load_dotenv
from pathlib import Path

# .envファイルの絶対パスを取得
current_dir = Path(__file__).resolve().parent
env_path = current_dir / ".env"

# .envファイルを読み込み
load_dotenv(dotenv_path=env_path)

# データベース接続設定
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@db:3306/testdb")

# エンジン作成とセッションの設定
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデル定義用のベースクラス
Base = declarative_base()

# データベースセッションの依存関係
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
