"use client";

import { motion } from "framer-motion";
import { MessageSquare, Sparkles, UserPlus, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 flex flex-col items-center"
      >
        <div className="relative w-32 h-32 mb-8">
          <Image
            src="/logo.png"
            alt="O ai Logo"
            fill
            className="object-contain animate-pulse"
          />
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary text-glow">
          O ai
        </h1>
        <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto">
          Experience ultra-low latency, persistent memory, and deeply immersive role-play with custom AI characters.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-white font-bold rounded-full flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <UserPlus className="w-5 h-5" />
              Create Persona
            </motion.button>
          </Link>
          <Link href="/chat">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-full flex items-center gap-2 border border-white/20 glass"
            >
              <MessageSquare className="w-5 h-5" />
              Explore Characters
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full"
      >
        <FeatureCard
          icon={<Zap className="text-primary" />}
          title="Low Latency"
          description="Powered by vLLM and Gemini 3 Pro for near-instant responses."
        />
        <FeatureCard
          icon={<Sparkles className="text-secondary" />}
          title="Infinite Memory"
          description="Context-aware RAG preserves your story across weeks of dialogue."
        />
        <FeatureCard
          icon={<UserPlus className="text-accent" />}
          title="Full Detail"
          description="Define system prompts, few-shot examples, and deep traits."
        />
      </motion.div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass p-8 hover:bg-white/10 transition-colors border border-white/10">
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/60 leading-relaxed">{description}</p>
    </div>
  );
}
