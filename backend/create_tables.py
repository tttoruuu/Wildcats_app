from database import Base, engine
from models.user import User

def create_tables():
    print("テーブルを作成します...")
    Base.metadata.create_all(bind=engine)
    print("テーブル作成完了")

if __name__ == "__main__":
    create_tables() 