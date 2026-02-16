import asyncio
from ai_service import AIService
from memory_service import MemoryService
import json

class MemorySynthesizer:
    def __init__(self):
        self.ai = AIService()
        self.memory = MemoryService()

    async def summarize_session(self, session_id: str):
        """Fetches short-term memory and generates a core identity summary."""
        context = self.memory.get_context(session_id, "summary")
        short_term = context["short_term"]
        
        if not short_term:
            return
            
        history_str = "\n".join([f"{m['role']}: {m['content']}" for m in short_term])
        
        prompt = f"""
        Analyze the following conversation history and extract EXACTLY three critical pieces of information for long-term memory:
        1. User's stated goal or preference.
        2. Key emotional markers or relationship status.
        3. Specific facts mentioned (names, locations, promises).
        
        Format as a JSON object.
        
        History:
        {history_str}
        """
        
        summary_json = await self.ai.generate_response(prompt, stream=False)
        
        # Save the synthesized summary back to long-term memory
        self.memory.collection.add(
            documents=[summary_json],
            metadatas=[{"session_id": session_id, "type": "synthesis"}],
            ids=[f"synth_{session_id}_{hash(summary_json)}"]
        )
        print(f"Synthesized memory for session {session_id}")

if __name__ == "__main__":
    synthesizer = MemorySynthesizer()
    # Example usage: asyncio.run(synthesizer.summarize_session("test_session"))
