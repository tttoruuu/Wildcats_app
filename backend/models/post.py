from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

# 投稿とタグの多対多関連付けテーブル
post_tag = Table(
    "post_tags",
    Base.metadata,
    Column("post_id", Integer, ForeignKey("posts.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True)
)

# タグモデル
class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    category = Column(String(50), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # リレーションシップ
    posts = relationship("Post", secondary=post_tag, back_populates="tags")

    def __repr__(self):
        return f"<Tag {self.name}>"

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(255))
    parent_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # リレーションシップ
    user = relationship("User", back_populates="posts")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    tags = relationship("Tag", secondary=post_tag, back_populates="posts")
    
    # 返信機能のための親子関係
    parent = relationship("Post", remote_side=[id], backref="replies")

    def __repr__(self):
        return f"<Post {self.id}>" 