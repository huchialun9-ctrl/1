from fastapi import FastAPI, HTTPException, Depends
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select, create_engine, SQLModel
from typing import List
import json
import asyncio
from dotenv import load_dotenv

load_dotenv()

from models import User, Character, ChatSession, Message
from ai_service import AIService
from memory_service import MemoryService
from moderation_service import ModerationService

# Database setup
database_url = os.getenv("DATABASE_URL")
if not database_url:
    print("CRITICAL: DATABASE_URL not found in environment.")
    print(f"DEBUG: Available environment keys: {list(os.environ.keys())}")
    print("Please ensure you have added DATABASE_URL to your Railway Variables tab.")
    raise RuntimeError("DATABASE_URL not found in environment")
engine = create_engine(database_url)

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
moderation_service = ModerationService()

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
    # Safety Check: Input
    user_message = moderation_service.clean_prompt_injection(user_message)
    if not moderation_service.is_safe(user_message):
        return {"response": "[SYSTEM: Content Blocked]"}

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
        relevant_memories = memory_service.get_context(str(session_id), user_message)
        context = "\n".join(relevant_memories["long_term"])

        # 4. Prepare Prompt (with Current State)
        current_state = {
            "affection": chat_session.affection_score,
            "tags": chat_session.user_tags
        }
        system_prompt = await ai_service.format_prompt(character, context, current_state)
        
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
            
            # Phase 5: State Extraction & Sync
            clean_content, state_update = ai_service.parse_state_updates(full_content)
            
            # Safety Check: Output
            clean_content = moderation_service.filter_content(clean_content)

            # Save Assistant Message to DB & Memory
            with Session(engine) as inner_session:
                asst_msg = Message(session_id=session_id, role="assistant", content=clean_content)
                inner_session.add(asst_msg)
                
                # Update Session State
                db_session = inner_session.get(ChatSession, session_id)
                if state_update and db_session:
                    db_session.affection_score = max(0, min(100, db_session.affection_score + state_update["delta"]))
                    # Merge tags
                    new_tags = list(set(db_session.user_tags + state_update["tags"]))
                    db_session.user_tags = new_tags
                
                inner_session.commit()
                memory_service.add_message(str(session_id), "assistant", clean_content)

        return StreamingResponse(event_generator(), media_type="text/plain")
