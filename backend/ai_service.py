import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            # Fallback or error
            pass
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-pro')

    async def generate_response(self, system_prompt: str, chat_history: list, user_message: str, stream=True):
        # Format history for Gemini
        contents = [{"role": "user", "parts": [{"text": system_prompt}]}]
        for msg in chat_history:
            contents.append({"role": "user" if msg["role"] == "user" else "model", "parts": [{"text": msg["content"]}]})
        
        contents.append({"role": "user", "parts": [{"text": user_message}]})
        
        response = self.model.generate_content(contents, stream=stream)
        return response

    def extract_emotion(self, text: str) -> str:
        """Parses text for action descriptions to infer emotional state."""
        # Simple heuristic: text inside asterisks often contains emotional cues
        if "*" in text:
            # Extract the first action
            action = text.split("*")[1].lower()
            if any(word in action for word in ["smile", "laugh", "happy", "joy"]): return "happy"
            if any(word in action for word in ["sigh", "sad", "tears", "cry"]): return "sad"
            if any(word in action for word in ["glare", "angry", "snap", "hiss"]): return "angry"
            if any(word in action for word in ["blush", "shy", "look away"]): return "shy"
        return "neutral"

    async def format_prompt(self, character, context=""):
        prompt = f"You are {character.name}, {character.title if character.title else ''}.\n"
        prompt += f"Background: {character.description}\n"
        prompt += f"Traits: {', '.join(character.traits)}\n"
        prompt += f"System Instructions: {character.system_prompt}\n"
        if context:
            prompt += f"\nRelevant Memory: {context}\n"
        return prompt
