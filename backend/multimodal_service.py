import os
import httpx
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM") # Default voice

class MultiModalService:
    def __init__(self):
        self.elevenlabs_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
        self.headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY or ""
        }

    async def text_to_speech(self, text: str):
        if not ELEVENLABS_API_KEY:
            return None
            
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(self.elevenlabs_url, json=data, headers=self.headers)
            if response.status_code == 200:
                return response.content
            return None

    async def generate_visual_context(self, chat_summary: str):
        """
        Placeholder for Stable Diffusion / Midjourney API integration.
        Returns a prompt for visual changes or a generated image URL.
        """
        # Logic to determine scene/mood based on summary
        return {
            "prompt": f"Cinematic, cyberpunk style, depicting: {chat_summary}",
            "mood": "dynamic"
        }
