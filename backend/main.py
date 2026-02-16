from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select, create_engine, SQLModel
from typing import List
import json
import asyncio

from .models import User, Character, ChatSession, Message
from .ai_service import AIService
from .memory_service import MemoryService

# Database setup
sqlite_url = "sqlite:///./oai.db"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

app = FastAPI(title="O ai API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_service = AIService()
memory_service = MemoryService()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "Welcome to O ai API"}

@app.post("/characters/", response_model=Character)
def create_character(character: Character):
    with Session(engine) as session:
        session.add(character)
        session.commit()
        session.refresh(character)
        return character

@app.get("/characters/", response_model=List[Character])
def read_characters():
    with Session(engine) as session:
        return session.exec(select(Character)).all()

# Authentication Endpoints
@app.post("/auth/register")
def register(user: User):
    with Session(engine) as session:
        # Check if exists
        existing = session.exec(select(User).where(User.email == user.email)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        session.add(user)
        session.commit()
        session.refresh(user)
        return {"status": "success", "user_id": user.id}

@app.post("/auth/login")
def login(login_data: dict):
    with Session(engine) as session:
        email = login_data.get("email")
        password = login_data.get("password")
        user = session.exec(select(User).where(User.email == email)).first()
        if not user or user.hashed_password != password: # Simplistic check for demo
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"status": "success", "user": user}

@app.post("/sessions/", response_model=ChatSession)
def create_session(session_data: ChatSession):
    with Session(engine) as session:
        session.add(session_data)
        session.commit()
        session.refresh(session_data)
        return session_data

@app.post("/chat/{session_id}")
async def chat(session_id: int, user_message: str):
    with Session(engine) as session:
        # 1. Get Session and Character
        chat_session = session.get(ChatSession, session_id)
        if not chat_session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        character = session.get(Character, chat_session.character_id)
        
        # 2. Add User Message to DB
        msg = Message(session_id=session_id, role="user", content=user_message)
        session.add(msg)
        session.commit()

        # 3. Retrieve Memory
        relevant_memories = memory_service.search_memory(str(session_id), user_message)
        context = "\n".join(relevant_memories)

        # 4. Prepare Prompt
        system_prompt = await ai_service.format_prompt(character, context)
        
        # 5. Get History
        history = session.exec(select(Message).where(Message.session_id == session_id)).all()
        history_dicts = [{"role": m.role, "content": m.content} for m in history[-10:]]

        # 6. Stream Response
        async def event_generator():
            full_content = ""
            response = await ai_service.generate_response(system_prompt, history_dicts, user_message)
            for chunk in response:
                if chunk.text:
                    full_content += chunk.text
                    yield chunk.text
            
            # Save Assistant Message to DB & Memory
            with Session(engine) as inner_session:
                asst_msg = Message(session_id=session_id, role="assistant", content=full_content)
                inner_session.add(asst_msg)
                inner_session.commit()
                memory_service.add_memory(str(session_id), user_message + " -> " + full_content)

        return StreamingResponse(event_generator(), media_type="text/plain")
