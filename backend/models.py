from datetime import datetime
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
from sqlalchemy import JSON, Column

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(unique=True)
    hashed_password: Optional[str] = None
    oauth_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Character(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    title: Optional[str] = None
    description: str
    traits: List[str] = Field(default=[], sa_column=Column(JSON))
    system_prompt: str
    few_shot_examples: List[dict] = Field(default=[], sa_column=Column(JSON))
    owner_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    character_id: int = Field(foreign_key="character.id")
    title: str = Field(default="New Chat")
    affection_score: int = Field(default=50) # Range 0-100
    user_tags: List[str] = Field(default=[], sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int = Field(foreign_key="chatsession.id")
    role: str # 'user' or 'assistant'
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
