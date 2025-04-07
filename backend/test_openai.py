from openai import OpenAI
import os

print("OpenAI APIテスト開始")

# クライアントの初期化
client = OpenAI()

try:
    # APIキーが設定されているか確認
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("警告: OPENAI_API_KEYが設定されていません")
    else:
        print(f"APIキー: {api_key[:5]}...{api_key[-4:] if len(api_key) > 8 else '****'}")
    
    # チャット補完のリクエスト
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "あなたは役立つアシスタントです。"},
            {"role": "user", "content": "こんにちは！"}
        ]
    )
    
    # 応答内容を取得
    print("応答:")
    print(completion.choices[0].message.content)
    print("APIテスト成功!")
except Exception as e:
    print(f"エラーが発生しました: {str(e)}")
