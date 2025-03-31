from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()  # .env読み込み

ENV = os.getenv("ENV", "development")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

origins = [FRONTEND_ORIGIN]

app = FastAPI()

# ✅ CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI おおおおis alive!"}

@app.get("/env")
def get_env():
    return {
        "ENV": ENV,
        "FRONTEND_ORIGIN": FRONTEND_ORIGIN
    }

print("ENV:", ENV)
print("FRONTEND_ORIGIN:", FRONTEND_ORIGIN)
print("CORS allow_origins:", origins)