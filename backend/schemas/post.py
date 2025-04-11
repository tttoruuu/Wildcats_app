from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PostBase(BaseModel):
    content: str
    image_url: Optional[str] = None

class PostCreate(PostBase):
    pass

class LikeBase(BaseModel):
    post_id: int

class LikeCreate(LikeBase):
    pass

class LikeResponse(LikeBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PostResponse(PostBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    likes_count: int
    is_liked_by_user: bool

    class Config:
        from_attributes = True

class PostWithUserResponse(PostResponse):
    username: str
    user_full_name: str
    user_profile_image_url: Optional[str] = None

    class Config:
        from_attributes = True 