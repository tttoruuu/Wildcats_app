from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.conversation_partner import ConversationPartner
from schemas.conversation_partner import ConversationPartnerCreate, ConversationPartnerResponse
from auth.jwt import get_current_user

router = APIRouter(
    prefix="/conversation-partners",
    tags=["conversation-partners"],
)

@router.post("/", response_model=ConversationPartnerResponse, status_code=status.HTTP_201_CREATED)
def create_conversation_partner(
    partner: ConversationPartnerCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """新しい会話相手を登録する"""
    db_partner = ConversationPartner(
        user_id=current_user.id,
        name=partner.name,
        age=partner.age,
        hometown=partner.hometown,
        hobbies=partner.hobbies,
        daily_routine=partner.daily_routine
    )
    db.add(db_partner)
    db.commit()
    db.refresh(db_partner)
    return db_partner

@router.get("/", response_model=List[ConversationPartnerResponse])
def get_conversation_partners(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """現在のユーザーの会話相手一覧を取得する"""
    partners = db.query(ConversationPartner).filter(ConversationPartner.user_id == current_user.id).all()
    return partners

@router.get("/{partner_id}", response_model=ConversationPartnerResponse)
def get_conversation_partner(
    partner_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """特定の会話相手の詳細を取得する"""
    partner = db.query(ConversationPartner).filter(
        ConversationPartner.id == partner_id,
        ConversationPartner.user_id == current_user.id
    ).first()
    
    if not partner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会話相手が見つかりません"
        )
    
    return partner

@router.delete("/{partner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation_partner(
    partner_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """会話相手を削除する"""
    partner = db.query(ConversationPartner).filter(
        ConversationPartner.id == partner_id,
        ConversationPartner.user_id == current_user.id
    ).first()
    
    if not partner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会話相手が見つかりません"
        )
    
    db.delete(partner)
    db.commit()
    return None 