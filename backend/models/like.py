from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # リレーションシップ
    user = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")

    # 同じユーザーが同じ投稿に複数回いいねできないように制約を追加
    __table_args__ = (
        UniqueConstraint('user_id', 'post_id', name='uq_user_post'),
    )

    def __repr__(self):
        return f"<Like {self.id}>" 