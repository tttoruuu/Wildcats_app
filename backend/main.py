from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
from database import SessionLocal, engine
from models.user import Base, User

# データベースのテーブルを作成
Base.metadata.create_all(bind=engine)

load_dotenv()  # .env読み込み

ENV = os.getenv("ENV", "development")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

origins = [FRONTEND_ORIGIN]

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベースセッションの依存関係
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "FastAPI is alive!"}

@app.get("/users")
def read_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return JSONResponse(
        content=[{"id": user.id, "name": user.name, "email": user.email} for user in users],
        headers={"Content-Type": "application/json; charset=utf-8"}
    )

@app.post("/users")
def create_user(name: str, email: str, db: Session = Depends(get_db)):
    db_user = User(name=name, email=email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return JSONResponse(
        content={"id": db_user.id, "name": db_user.name, "email": db_user.email},
        headers={"Content-Type": "application/json; charset=utf-8"}
    )

@app.get("/env")
def get_env():
    return {
        "ENV": ENV,
        "FRONTEND_ORIGIN": FRONTEND_ORIGIN
    }

print("ENV:", ENV)
print("FRONTEND_ORIGIN:", FRONTEND_ORIGIN)
print("CORS allow_origins:", origins)