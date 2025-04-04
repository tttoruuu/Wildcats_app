from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class ConversationPartner(Base):
    __tablename__ = "conversation_partners"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    hometown = Column(String(100))
    hobbies = Column(Text)
    daily_routine = Column(Text)

    # リレーションシップ
    user = relationship("User", back_populates="conversation_partners") 