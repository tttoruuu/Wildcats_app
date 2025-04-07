from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
import os
import random
from openai import OpenAI  # OpenAIライブラリをインポート
from schemas.chat import ChatRequest, ChatResponse
from database import get_db
from sqlalchemy.orm import Session
from auth.jwt import get_current_user

router = APIRouter()

# OpenAIクライアントの初期化を修正（http_clientをNoneに設定）
client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"])

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        # システムプロンプトを作成
        system_prompt = "あなたはお見合い相手です。"
        
        if request.meetingCount == "first":
            system_prompt += "初めての会合で、相手と会話をしています。"
            if request.level == 1:
                system_prompt += "基本的な質問と応答を中心に、丁寧に会話を進めてください。"
            else:
                system_prompt += "自然な会話の流れで、話題を広げながら会話を楽しみましょう。時々絵文字も使って親しみやすい雰囲気を作ってください。"
        else:
            system_prompt += "以前にも会ったことがある相手と、再度会話をしています。"
            if request.level == 1:
                system_prompt += "基本的な質問と応答を心がけ、前回の会話を踏まえた内容にしてください。"
            else:
                system_prompt += "より深い話題について会話し、共通の興味を探りながら会話を発展させてください。親しみのある絵文字も適宜使用してください。"
        
        # メッセージ配列の構築
        messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        # チャット履歴を追加
        for message in request.chatHistory:
            messages.append({"role": message["role"], "content": message["content"]})
        
        try:
            # OpenAI APIを呼び出す部分
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            
            # 応答内容を取得
            response_text = completion.choices[0].message.content
            return ChatResponse(response=response_text)
            
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            # APIエラー時はフォールバックとしてダミーデータを使用
            return ChatResponse(response=generate_fallback_response(request))
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_fallback_response(request: ChatRequest) -> str:
    """会話応答を生成"""
    if request.meetingCount == "first":
        if request.level == 1:
            responses = [
                "はじめまして！お会いできて嬉しいです。お仕事はどのようなことをされていますか？",
                "ご自己紹介ありがとうございます。趣味や休日の過ごし方について教えていただけますか？",
                "なるほど、それは興味深いですね。もう少し詳しく教えていただけますか？"
            ]
        else:
            responses = [
                "はじめまして！お会いできて本当に嬉しいです。あなたの話し方からとても知的な印象を受けました。普段はどのようなことに興味を持たれていますか？😊",
                "それはとても素敵ですね！実は私も同じようなことに関心があります。最近特に印象に残った経験はありますか？",
                "なるほど！その考え方にとても共感します。私も似たような経験から多くのことを学びました。もう少しお互いの価値観について話しませんか？"
            ]
    else:
        if request.level == 1:
            responses = [
                "また会えて嬉しいです。前回のお話からさらに知りたいと思っていました。最近はいかがお過ごしですか？",
                "そうでしたか。前回の会話を思い出しながら、もう少し詳しく教えていただけますか？",
                "なるほど、それは前回と違った一面を知ることができました。何か新しい趣味や興味はありましたか？"
            ]
        else:
            responses = [
                "またお会いできて本当に嬉しいです！前回の会話から、あなたのことがもっと知りたいと思っていました。最近、何か新しいことに挑戦されましたか？😊",
                "前回のお話からさらに発展させて考えていました。あなたの価値観はとても共感できるものがあります。もっと深く話し合えたら嬉しいです。",
                "お久しぶりです！実は前回会ってからあなたのお話した内容について色々と考えていたんです。今日はその続きが聞けると嬉しいな。💭"
            ]
    
    return random.choice(responses)
