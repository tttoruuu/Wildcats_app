from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TagBase(BaseModel):
    name: str
    category: str

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PostBase(BaseModel):
    content: str
    image_url: Optional[str] = None
    tag_ids: Optional[List[int]] = None
    parent_id: Optional[int] = None

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
    tags: Optional[List[TagResponse]] = None
    replies_count: Optional[int] = 0
    parent_id: Optional[int] = None

    class Config:
        from_attributes = True

class PostWithUserResponse(PostResponse):
    username: str
    user_full_name: str
    user_profile_image_url: Optional[str] = None

    class Config:
        from_attributes = True

class ReplyResponse(PostWithUserResponse):
    parent: Optional["PostWithUserResponse"] = None

    class Config:
        from_attributes = True 