"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Github, Chrome, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import GlowRing from "@/components/GlowRing";
import Image from "next/image";

const SHOWCASE_IMAGES = [
    "/auth-1.png",
    "/auth-2.png",
    "/auth-3.png"
];

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % SHOWCASE_IMAGES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background">
            {/* Left Pane: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md glass p-10 relative overflow-hidden group"
                >
                    {/* Subtle Glow Border */}
                    <div className="absolute inset-0 border border-primary/20 rounded-3xl -z-10 group-hover:border-primary/40 transition-colors" />

                    <div className="flex flex-col items-center mb-10">
                        <GlowRing state="idle" className="w-20 h-20 mb-6" />
                        <h1 className="text-3xl font-black tracking-tighter text-center">
                            {isLogin ? "Welcome Back" : "Start Your Story"}
                        </h1>
                        <p className="text-text-muted text-sm mt-2">
                            {isLogin ? "Continue your journey with O ai" : "Create your first digital soul today"}
                        </p>
                    </div>

                    <form className="space-y-6">
                        {!isLogin && (
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        )}
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-linear-to-r from-primary to-secondary rounded-xl font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                        >
                            {isLogin ? "Sign In" : "Register"}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-10">
                        <div className="relative flex items-center justify-center mb-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                            <span className="relative px-4 bg-background/50 text-[10px] font-black uppercase tracking-widest text-text-muted">Or continue with</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <button className="flex items-center justify-center py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                <Github className="w-5 h-5" />
                            </button>
                            <button className="flex items-center justify-center py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                <Chrome className="w-5 h-5" />
                            </button>
                            <button className="flex items-center justify-center py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                <div className="w-5 h-5 font-black text-lg leading-none">A</div>
                            </button>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-xs text-text-muted">
                        {isLogin ? "New to the vault?" : "Already found your path?"}{" "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary font-bold hover:underline"
                        >
                            {isLogin ? "Register now" : "Sign in here"}
                        </button>
                    </p>
                </motion.div>
            </div>

            {/* Right Pane: AI Showcase */}
            <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-screen overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={SHOWCASE_IMAGES[currentImage]}
                            alt="AI Showcase"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Dark Mask */}
                        <div className="absolute inset-0 bg-black/30 lg:bg-black/10" />
                        <div className="absolute inset-0 bg-linear-to-r from-black/80 lg:from-black/60 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-16 right-16 text-right z-20 hidden lg:block">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={`text-${currentImage}`}
                        className="max-w-md"
                    >
                        <Sparkles className="w-8 h-8 text-primary ml-auto mb-4 animate-pulse" />
                        <h2 className="text-5xl font-black tracking-tighter mb-4 text-glow">
                            UNLEASH YOUR IMAGINATION.
                        </h2>
                        <p className="text-white/60 text-lg font-light italic">
                            Where every story begins, and souls find their resonance.
                        </p>
                    </motion.div>
                </div>

                {/* Floating Particle Effect Placeholder */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial-gradient from-primary/5 to-transparent blur-[120px]" />
                </div>
            </div>
        </div>
    );
}
