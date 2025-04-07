from pydantic import BaseModel
from typing import List, Dict, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    userInput: str
    chatHistory: List[Dict[str, str]]
    level: int = 1
    partnerId: Optional[str] = None
    meetingCount: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
