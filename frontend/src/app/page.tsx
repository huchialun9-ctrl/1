"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageSquare, TrendingUp, Compass, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Character {
  id: number;
  name: string;
  title: string;
  description: string;
  image_url: string;
  banner_url: string;
  interaction_count: number;
}

const categories = ["For You", "Anime", "Helpers", "Games", "Roleplay", "Politics", "Philosophy"];

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("For You");

  useEffect(() => {
    const fetchChars = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/characters/`);
        const data = await res.json();
        setCharacters(data);
      } catch (e) {
        console.error("Failed to fetch characters", e);
      } finally {
        setLoading(false);
      }
    };
    fetchChars();
  }, []);

  return (
    <div className="min-h-full bg-black">
      {/* Hero Banner Section */}
      <section className="relative h-[45vh] min-h-[450px] flex items-center px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
          <div className="w-full h-full bg-[#0a0a0a] mesh-gradient opacity-40 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-20 max-w-2xl"
        >
          <div className="flex items-center gap-2 mb-6 text-primary">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-glow">Neural Selection Platform</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.85]">
            WHAT'S YOUR <br />
            <span className="text-glow">STORY?</span>
          </h1>

          <div className="glass flex items-center gap-4 px-6 py-5 w-full max-w-lg group border-white/5 rounded-3xl transition-all hover:border-primary/30">
            <Search className="w-6 h-6 text-white/20 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search characters, worlds, or authors..."
              className="bg-transparent border-none outline-none text-white font-semibold placeholder:text-white/10 w-full text-lg"
            />
          </div>
        </motion.div>
      </section>

      {/* Discovery Portal */}
      <section className="px-6 md:px-12 py-12">
        {/* Category Tabs */}
        <div className="flex items-center gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                 whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all
                 ${activeCategory === cat ? 'bg-white text-black scale-105 shadow-xl' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}
               `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Grids */}
        <div className="space-y-16">
          <section>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Trending Characters</h2>
              </div>
              <Link href="/discover" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">See all →</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-80 glass rounded-[2.5rem] animate-pulse" />
                ))
              ) : (
                characters.map((char) => (
                  <Link key={char.id} href={`/chat?id=${char.id}`}>
                    <motion.div
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group relative h-80 rounded-[2.5rem] overflow-hidden glass border-white/5 transition-all duration-500"
                    >
                      {/* Artwork Layer */}
                      <div className="absolute inset-0 z-0">
                        {char.banner_url ? (
                          <img src={char.banner_url} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-500" />
                      </div>

                      {/* Content Layer */}
                      <div className="relative z-20 h-full p-8 flex flex-col justify-end">
                        <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-white/5 mb-5 shadow-2xl group-hover:border-primary/50 transition-all duration-500 group-hover:scale-110">
                          <img src={char.image_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${char.name}`} alt={char.name} className="w-full h-full object-cover" />
                        </div>

                        <h3 className="text-2xl font-black tracking-tighter text-white mb-1 group-hover:text-glow truncate transition-all">{char.name}</h3>
                        <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] mb-4 truncate">{char.title || "Elite Persona"}</p>

                        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed font-bold mb-6 group-hover:text-white/80 transition-colors">
                          {char.description}
                        </p>

                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em]">
                          <div className="flex items-center gap-1.5 text-secondary group-hover:text-glow">
                            <MessageSquare className="w-3 h-3" />
                            {(char.interaction_count / 1000).toFixed(1)}k
                          </div>
                          <span className="text-white/10 uppercase font-black">@ai_core</span>
                        </div>
                      </div>

                      {/* Hover Highlight */}
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </motion.div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
