from sqlalchemy import Column, Integer, String, Date, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    birth_date = Column(Date, nullable=False)
    hometown = Column(String(255))
    hobbies = Column(String(255))
    matchmaking_agency = Column(String(255))
    profile_image_url = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # リレーションシップ
    conversation_partners = relationship("ConversationPartner", back_populates="user")

    def __repr__(self):
        return f"<User {self.username}>"
