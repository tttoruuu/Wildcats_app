from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import os
import shutil
from datetime import datetime
import uuid

from database import get_db
from models.user import User
from models.post import Post, Tag, post_tag
from models.like import Like
from schemas.post import PostCreate, PostResponse, PostWithUserResponse, LikeCreate, LikeResponse, TagResponse, TagCreate
from auth.jwt import get_current_user

router = APIRouter(
    prefix="/posts",
    tags=["posts"],
    responses={404: {"description": "Not found"}},
)

# タグ一覧を取得
@router.get("/tags", response_model=List[TagResponse])
def get_tags(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Tag)
    if category:
        query = query.filter(Tag.category == category)
    return query.order_by(Tag.category, Tag.name).all()

# タグを作成（管理者用）
@router.post("/tags", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
def create_tag(
    tag: TagCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # ここでは簡単のため、管理者チェックは省略しています
    db_tag = Tag(name=tag.name, category=tag.category)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

# 投稿一覧を取得（タグでフィルタリング機能を追加）
@router.get("/", response_model=List[PostWithUserResponse])
def get_posts(
    skip: int = 0, 
    limit: int = 100,
    tag_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # サブクエリで投稿ごとのいいね数を取得
    likes_count = db.query(
        Like.post_id,
        func.count(Like.id).label("likes_count")
    ).group_by(Like.post_id).subquery()

    # 各投稿に対して、現在のユーザーがいいねしているかを確認するサブクエリ
    user_likes = db.query(
        Like.post_id
    ).filter(Like.user_id == current_user.id).subquery()

    # 投稿のベースクエリ
    post_query = db.query(
        Post, 
        User.username, 
        User.full_name, 
        User.profile_image_url,
        func.coalesce(likes_count.c.likes_count, 0).label("likes_count"),
        # 現在のユーザーがいいねしているかどうか
        (Post.id.in_(db.query(user_likes.c.post_id))).label("is_liked_by_user")
    ).join(
        User, Post.user_id == User.id
    ).outerjoin(
        likes_count, Post.id == likes_count.c.post_id
    )
    
    # タグでフィルタリング
    if tag_id:
        post_query = post_query.join(
            post_tag, Post.id == post_tag.c.post_id
        ).filter(post_tag.c.tag_id == tag_id)
    
    # 結果を取得
    posts = post_query.order_by(
        Post.created_at.desc()
    ).offset(skip).limit(limit).all()

    result = []
    for post, username, full_name, profile_image_url, likes_count, is_liked_by_user in posts:
        # 投稿に関連するタグを取得
        tags = db.query(Tag).join(post_tag).filter(post_tag.c.post_id == post.id).all()
        
        post_dict = {
            "id": post.id,
            "user_id": post.user_id,
            "content": post.content,
            "image_url": post.image_url,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "likes_count": likes_count,
            "is_liked_by_user": is_liked_by_user,
            "username": username,
            "user_full_name": full_name,
            "user_profile_image_url": profile_image_url,
            "tags": tags,
            "tag_ids": [tag.id for tag in tags]
        }
        result.append(post_dict)

    return result

# 投稿を作成（タグ付け機能を追加）
@router.post("/", response_model=PostResponse)
def create_post(
    post: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_post = Post(
        user_id=current_user.id,
        content=post.content,
        image_url=post.image_url
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    # タグの関連付け
    if post.tag_ids:
        for tag_id in post.tag_ids:
            tag = db.query(Tag).filter(Tag.id == tag_id).first()
            if tag:
                db_post.tags.append(tag)
        db.commit()
        db.refresh(db_post)
    
    # タグ情報を含めて返す
    return {
        **db_post.__dict__,
        "likes_count": 0,
        "is_liked_by_user": False,
        "tags": db_post.tags,
        "tag_ids": [tag.id for tag in db_post.tags]
    }

# 投稿画像のアップロード
@router.post("/upload-image")
def upload_post_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # アップロードディレクトリを作成
    UPLOAD_DIR = "uploads/posts"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # ファイル名をユニークにするために日時とUUIDを追加
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{timestamp}_{uuid.uuid4()}{file_extension}"
    
    # ファイルパスを作成
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # ファイルを保存
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 画像のURLを返す
    image_url = f"/uploads/posts/{unique_filename}"
    
    return {"image_url": image_url}

# 投稿にいいねする
@router.post("/{post_id}/like", response_model=LikeResponse)
def like_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 投稿が存在するか確認
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    # すでにいいねしているか確認
    existing_like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.post_id == post_id
    ).first()
    
    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already liked this post"
        )
    
    # いいねを追加
    like = Like(user_id=current_user.id, post_id=post_id)
    db.add(like)
    db.commit()
    db.refresh(like)
    
    return like

# いいねを取り消す
@router.delete("/{post_id}/like", status_code=status.HTTP_204_NO_CONTENT)
def unlike_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # いいねを検索
    like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.post_id == post_id
    ).first()
    
    if not like:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Like not found"
        )
    
    # いいねを削除
    db.delete(like)
    db.commit()
    
    return None 