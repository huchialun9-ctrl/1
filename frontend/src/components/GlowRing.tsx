"use client";

import { motion } from "framer-motion";

interface GlowRingProps {
    state: "idle" | "thinking" | "speaking";
    className?: string;
}

export default function GlowRing({ state, className }: GlowRingProps) {
    return (
        <div className={`relative flex items-center justify-center ${className || "w-32 h-32"}`}>
            {/* Outer Glow Ring */}
            <motion.div
                animate={
                    state === "thinking"
                        ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }
                        : state === "speaking"
                            ? { scale: [1, 1.05, 1], strokeWidth: ["2px", "4px", "2px"] }
                            : { opacity: 0.2 }
                }
                transition={{
                    duration: state === "thinking" ? 2 : 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border-2 border-primary shadow-[0_0_30px_rgba(139,92,246,0.3)]"
            />

            {/* Inner Rotating Ring (Thinking state) */}
            {state === "thinking" && (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 rounded-full border-t-2 border-secondary opacity-60"
                />
            )}

            {/* Core "O" Circle */}
            <motion.div
                animate={
                    state === "speaking"
                        ? { scale: [1, 1.1, 1] }
                        : { scale: 1 }
                }
                transition={{ duration: 0.2, repeat: state === "speaking" ? Infinity : 0 }}
                className="w-16 h-16 rounded-full bg-linear-to-tr from-primary to-secondary flex items-center justify-center z-10"
            >
                <div className="w-12 h-12 rounded-full bg-background" />
            </motion.div>
        </div>
    );
}
