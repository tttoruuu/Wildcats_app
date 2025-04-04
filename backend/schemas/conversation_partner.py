from pydantic import BaseModel
from typing import Optional

class ConversationPartnerBase(BaseModel):
    name: str
    age: int
    hometown: str
    hobbies: str
    daily_routine: str

class ConversationPartnerCreate(ConversationPartnerBase):
    pass

class ConversationPartnerResponse(ConversationPartnerBase):
    id: int
    user_id: int
    
    class Config:
        orm_mode = True 