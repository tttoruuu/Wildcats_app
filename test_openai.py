from openai import OpenAI
import os
import time
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get("OPENAI_API_KEY")
print(f"APIキー: {api_key[:5]}...{api_key[-5:]}")

client = OpenAI(api_key=api_key)
print("OpenAI APIクライアント初期化完了")

start_time = time.time()
try:
    print("API呼び出し開始...")
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "こんにちは"}],
        max_tokens=10,
        timeout=60  # 60秒のタイムアウト
    )
    end_time = time.time()
    print(f"API呼び出し完了 (所要時間: {end_time - start_time:.2f}秒)")
    print(f"APIレスポンス: {response.choices[0].message.content}")
except Exception as e:
    end_time = time.time()
    print(f"APIエラー (所要時間: {end_time - start_time:.2f}秒): {type(e).__name__}: {str(e)}")
    
    # ネットワーク接続テスト
    try:
        import socket
        socket_test = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        socket_test.settimeout(5)
        print("OpenAI APIへの接続テスト中...")
        result = socket_test.connect_ex(('api.openai.com', 443))
        print(f"接続テスト結果: {'成功' if result == 0 else f'失敗 (エラーコード: {result})'}")
        socket_test.close()
    except Exception as socket_err:
        print(f"接続テストエラー: {str(socket_err)}") 