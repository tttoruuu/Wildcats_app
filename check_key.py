import os
from dotenv import load_dotenv

load_dotenv()
key = os.environ.get('OPENAI_API_KEY', '')
print(f'API key found: {bool(key)}')
print(f'API key length: {len(key)}')
print(f'API key starts with: {key[:7] if len(key) >= 7 else key}')
print(f'API key ends with: {key[-4:] if len(key) >= 4 else key}') 