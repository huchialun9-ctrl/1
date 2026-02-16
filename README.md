# O ai - High-Interactivity RPG Chat Platform
**Live Demo**: [https://1-production-25f4.up.railway.app](https://1-production-25f4.up.railway.app)

## Features
- **Deep Personalization**: Create characters with unique traits, background stories, and system prompts.
- **continuous Memory**: RAG-based long-term memory ensures characters remember your past interactions.
- **Low Latency**: Streaming responses using Gemini 3 Pro.
- **Premium UI**: Modern dark theme with glassmorphism and smooth animations.

## Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: FastAPI, SQLModel (SQLite/PostgreSQL), ChromaDB (RAG), Redis (Session Cache).
- **AI**: Gemini 1.5 Pro.

## Getting Started

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Create `.env` and configure your credentials (DATABASE_URL, REDIS_URL, etc.).
4. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env.local` and add `NEXT_PUBLIC_SUPABASE_URL`.
4. `npm run dev`
