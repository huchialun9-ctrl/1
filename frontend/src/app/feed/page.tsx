"use client";

import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = ["All", "Virtual Lovers", "Experts", "Game Characters", "Historical"];

export default function DiscoveryFeed() {
    return (
        <div className="min-h-screen py-32 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                    <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                        <TrendingUp className="text-secondary" /> Discovery Feed
                    </h1>
                    <p className="text-white/50">Explore extraordinary souls crafted by the community.</p>
                </div>

                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
                    <input
                        type="text"
                        placeholder="Search personas..."
                        className="w-full glass bg-white/5 border border-white/10 rounded-full px-12 py-3 outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        className="px-6 py-2 rounded-full glass border border-white/10 whitespace-nowrap hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <CharacterCard key={i} />
                ))}
            </div>
        </div>
    );
}

function CharacterCard() {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="glass overflow-hidden border border-white/10 group flex flex-col h-full"
        >
            <div className="relative h-48 bg-white/5 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-secondary/20 z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-linear-to-t from-background to-transparent z-10" />
                <div className="absolute bottom-4 left-6 z-20">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-2 py-1 rounded">Expert Persona</span>
                    <h3 className="text-2xl font-black mt-2 tracking-tighter">Cyber Oracle</h3>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <p className="text-white/60 text-sm line-clamp-2 mb-6">
                    A distant watcher of the digital flow, providing cryptic wisdom and predictive insights for those who dare ask.
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 text-xs opacity-50">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1.2k</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> 4.9</span>
                    </div>

                    <Link href="/chat">
                        <button className="px-4 py-2 bg-white/10 hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-all border border-white/10">
                            Chat Now
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
