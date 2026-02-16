"use client";

import { motion } from "framer-motion";
import { MessageSquare, Sparkles, UserPlus, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-32 pb-20 relative overflow-hidden mesh-gradient">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] -z-10" />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center z-10 flex flex-col items-center mt-10 md:mt-20"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-bold tracking-wider uppercase backdrop-blur-sm shadow-xl"
        >
          <Sparkles className="w-4 h-4" />
          The future of role-play
        </motion.div>

        <h1 className="text-7xl md:text-9xl font-black mb-8 leading-tight tracking-tighter">
          <span className="bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">O</span>
          <span className="bg-clip-text text-transparent bg-linear-to-tr from-primary via-secondary to-accent text-glow">ai</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/50 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
          The world's first ultra-low latency, <span className="text-white/80">long-term memory</span> RPG platform where AI characters feel <span className="text-white/80 italic">truly alive</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md">
          <Link href="/create" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-5 bg-linear-to-r from-primary to-secondary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30"
            >
              <UserPlus className="w-6 h-6" />
              Build Persona
            </motion.button>
          </Link>
          <Link href="/chat" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-5 bg-white/5 text-white font-black rounded-2xl flex items-center justify-center gap-3 border border-white/10 backdrop-blur-xl shadow-2xl hover:bg-white/10 transition-all"
            >
              <MessageSquare className="w-6 h-6" />
              Start Journey
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 max-w-6xl w-full relative"
      >
        <FeatureCard
          icon={<Zap className="w-6 h-6" />}
          title="Instant Response"
          description="Powered by custom vLLM optimization for near-instant 100ms latency."
          color="bg-primary"
        />
        <FeatureCard
          icon={<Sparkles className="w-6 h-6" />}
          title="Neural Link"
          description="Context-aware RAG preserves your story across weeks of deep dialogue."
          color="bg-secondary"
        />
        <FeatureCard
          icon={<UserPlus className="w-6 h-6" />}
          title="Deep Traits"
          description="Define system prompts, few-shot patterns, and granular core traits."
          color="bg-accent"
        />
      </motion.div>
    </main>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass-card p-10 group relative"
    >
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-b from-white to-white/70">{title}</h3>
      <p className="text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors">
        {description}
      </p>

      {/* Decorative Gradient */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
