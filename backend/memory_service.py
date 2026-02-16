import chromadb
from chromadb.utils import embedding_functions
import os
import redis
import json
from typing import Optional, List, Dict

class MemoryService:
    def __init__(self):
        # Long-term (Vector DB)
        self.chroma_client = chromadb.PersistentClient(path="./db/chroma")
        self.embedding_function = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.chroma_client.get_or_create_collection(
            name="oai_memory", 
            embedding_function=self.embedding_function
        )
        # Short-term (Redis)
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        self.short_term_limit = 10 # Last 10 messages for immediate context

    def add_message(self, session_id: str, role: str, content: str):
        """Append to short-term memory and conditionally sync to long-term."""
        message = {"role": role, "content": content, "timestamp": os.urandom(4).hex()}
        
        # 1. Add to Redis List
        key = f"chat:{session_id}"
        self.redis_client.rpush(key, json.dumps(message))
        self.redis_client.ltrim(key, -self.short_term_limit, -1)
        
        # 2. Add to ChromaDB (Long-term)
        self.collection.add(
            documents=[content],
            metadatas=[{"session_id": session_id, "role": role}],
            ids=[f"{session_id}_{os.urandom(4).hex()}"]
        )

    def get_context(self, session_id: str, query: str) -> Dict[str, List]:
        """Retrieve both short-term context and long-term memories."""
        # 1. Short-term (last N messages)
        short_term = self.redis_client.lrange(f"chat:{session_id}", 0, -1)
        short_term = [json.loads(m) for m in short_term]
        
        # 2. Long-term (Semantic search)
        results = self.collection.query(
            query_texts=[query],
            where={"session_id": session_id},
            n_results=3
        )
        long_term = results["documents"][0] if results["documents"] else []
        
        return {
            "short_term": short_term,
            "long_term": long_term
        }

    def synthesize_memories(self, session_id: str):
        """Compacts chat history into high-level summaries (The Neural Link)."""
        # Logic for summarization via AI service would go here
        # For now, it's a placeholder for the Memory_Synthesizer script
        pass
