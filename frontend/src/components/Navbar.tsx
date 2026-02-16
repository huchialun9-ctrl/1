"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquare, UserPlus, Compass } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center">
            <div className="glass max-w-6xl w-full px-6 py-3 flex items-center justify-between border border-white/10">
                <Link href="/" className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative w-10 h-10"
                    >
                        <Image
                            src="/assets/logo.png"
                            alt="O ai Logo"
                            fill
                            className="object-contain"
                        />
                    </motion.div>
                    <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                        O ai
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/feed" className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                        <Compass className="w-4 h-4" />
                        <span className="hidden md:block">Discovery</span>
                    </Link>
                    <Link href="/create" className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden md:block">Create</span>
                    </Link>
                    <Link href="/chat">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-full shadow-lg shadow-primary/20"
                        >
                            Start Chat
                        </motion.button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
