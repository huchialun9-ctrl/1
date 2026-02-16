"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquare, UserPlus, Compass, Sparkles } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
            <div className="glass max-w-5xl mx-auto px-6 py-2 flex items-center justify-between border-white/5 shadow-2xl backdrop-blur-3xl rounded-full">
                <Link href="/" className="flex items-center gap-2 group">
                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="relative w-8 h-8 md:w-9 md:h-9 bg-linear-to-tr from-primary to-secondary rounded-xl p-1.5 flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                        <Sparkles className="text-white w-full h-full" />
                    </motion.div>
                    <span className="text-xl md:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-accent group-hover:text-glow transition-all duration-300">
                        O ai
                    </span>
                </Link>

                <div className="flex items-center gap-4 md:gap-8">
                    <Link href="/feed" className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200">
                        <Compass className="w-4 h-4" />
                        <span className="hidden sm:block">Discovery</span>
                    </Link>
                    <Link href="/create" className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200">
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:block">Create</span>
                    </Link>
                    <div className="h-4 w-px bg-white/10 hidden sm:block" />
                    <Link href="/chat">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-linear-to-r from-primary to-secondary text-white text-sm font-bold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                        >
                            Start Chat
                        </motion.button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
