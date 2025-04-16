from sqlalchemy import create_engine, MetaData, Table, Column, Integer, ForeignKey, text
import os

# 環境変数から接続情報を取得
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@db:3306/testdb")

def upgrade():
    # データベースに接続
    engine = create_engine(DATABASE_URL)
    metadata = MetaData()
    
    # 既存のpostsテーブルをリフレクト
    metadata.reflect(bind=engine, only=['posts'])
    posts = metadata.tables.get('posts')
    
    # parent_idカラムが存在するか確認
    if posts and 'parent_id' not in [c.name for c in posts.columns]:
        # parent_idカラムを追加するSQL
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE posts ADD COLUMN parent_id INT NULL"))
            conn.execute(text("ALTER TABLE posts ADD FOREIGN KEY (parent_id) REFERENCES posts(id)"))
            conn.commit()
        print("parent_idカラムがpostsテーブルに追加されました")
    else:
        print("parent_idカラムは既に存在しているか、postsテーブルが見つかりません")

if __name__ == "__main__":
    upgrade() 