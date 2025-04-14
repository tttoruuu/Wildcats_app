from sqlalchemy.orm import Session
from models.post import Tag

def create_initial_tags(db: Session):
    """投稿タグの初期データを作成します"""
    
    # 既存のタグをチェック
    if db.query(Tag).count() > 0:
        print("タグは既に存在しているためスキップします")
        return
    
    # デート関連のタグ
    date_tags = [
        {"name": "初デート", "category": "デートに関して"},
        {"name": "お断りされた", "category": "デートに関して"},
        {"name": "断った", "category": "デートに関して"},
        {"name": "デート中止", "category": "デートに関して"},
        {"name": "交際終了", "category": "デートに関して"},
    ]
    
    # メンタル関連のタグ
    mental_tags = [
        {"name": "立ち直った話", "category": "メンタルに関して"},
        {"name": "メンタルきつい", "category": "メンタルに関して"},
        {"name": "自信がない", "category": "メンタルに関して"},
        {"name": "嬉しかったこと", "category": "メンタルに関して"},
        {"name": "成長を感じた", "category": "メンタルに関して"},
    ]
    
    # 雑談・その他のタグ
    other_tags = [
        {"name": "相談したい", "category": "雑談・その他"},
        {"name": "婚活疲れ", "category": "雑談・その他"},
        {"name": "仲人とのやりとり", "category": "雑談・その他"},
        {"name": "婚活あるある", "category": "雑談・その他"},
        {"name": "息抜き", "category": "雑談・その他"},
    ]
    
    # 全タグリスト
    all_tags = date_tags + mental_tags + other_tags
    
    # タグをデータベースに追加
    for tag_data in all_tags:
        tag = Tag(**tag_data)
        db.add(tag)
    
    db.commit()
    print(f"{len(all_tags)}個のタグを作成しました")

def init_db(db: Session):
    """初期データを作成します"""
    create_initial_tags(db) 