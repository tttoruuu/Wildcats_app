from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import os
import shutil
from datetime import datetime
import uuid

from database import get_db
from models.user import User
from models.post import Post
from models.like import Like
from schemas.post import PostCreate, PostResponse, PostWithUserResponse, LikeCreate, LikeResponse
from auth.jwt import get_current_user

router = APIRouter(
    prefix="/posts",
    tags=["posts"],
    responses={404: {"description": "Not found"}},
)

# 投稿一覧を取得
@router.get("/", response_model=List[PostWithUserResponse])
def get_posts(
    skip: int = 0, 
    limit: int = 100, 
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

    # 投稿、投稿者情報、いいね数を結合して取得
    posts = db.query(
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
    ).order_by(
        Post.created_at.desc()
    ).offset(skip).limit(limit).all()

    result = []
    for post, username, full_name, profile_image_url, likes_count, is_liked_by_user in posts:
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
            "user_profile_image_url": profile_image_url
        }
        result.append(post_dict)

    return result

# 投稿を作成
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
    
    # いいね数の初期値はゼロ
    return {
        **db_post.__dict__,
        "likes_count": 0,
        "is_liked_by_user": False
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