"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronLeft, Volume2, Camera, RotateCcw } from "lucide-react";
import Link from "next/link";
import { toPng } from "html-to-image";
import GlowRing from "@/components/GlowRing";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    audioUrl?: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "assistant", content: "I've been waiting for you. The digital currents whispered of your arrival." }
    ]);
    const [input, setInput] = useState("");
    const [aiState, setAiState] = useState<"idle" | "thinking" | "speaking">("idle");
    const [isCapturing, setIsCapturing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, aiState]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setAiState("thinking");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            // Hardcoding session_id 1 for now, or you can manage it via state
            const response = await fetch(`${apiUrl}/chat/1?user_message=${encodeURIComponent(input)}`, {
                method: "POST"
            });

            if (!response.ok) throw new Error("API call failed");

            // Handle streaming or simple text response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = "";

            setAiState("speaking");

            const assistantMsgId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: assistantMsgId, role: "assistant", content: "" }]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    fullText += chunk;

                    setMessages(prev => prev.map(m =>
                        m.id === assistantMsgId ? { ...m, content: fullText } : m
                    ));
                }
            }
        } catch (err) {
            console.error("Chat failed:", err);
            setMessages(prev => [...prev, {
                id: "error",
                role: "assistant",
                content: "*Connection lost. Retrying neural link...*"
            }]);
        } finally {
            setAiState("idle");
        }
    };

    const renderContent = (content: string) => {
        const parts = content.split(/(\*.*?\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("*") && part.endsWith("*")) {
                return <span key={i} className="italic opacity-40 font-serif mr-1">{part.slice(1, -1)}</span>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    const captureSnippet = async () => {
        if (chatRef.current === null) return;
        setIsCapturing(true);
        try {
            const dataUrl = await toPng(chatRef.current, { cacheBust: true, backgroundColor: "#050505" });
            const link = document.createElement('a');
            link.download = `O-ai-snippet-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Snapshot failed', err);
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 py-8 relative">
            {/* Background Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-12 px-2">
                <div className="flex items-center gap-6">
                    <Link href="/">
                        <ChevronLeft className="w-6 h-6 opacity-30 hover:opacity-100 transition-opacity" />
                    </Link>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black tracking-tighter">LUNA ECHO</h2>
                        <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Cyber Oracle // Online</p>
                    </div>
                </div>

                <div className="scale-75 origin-right flex items-center gap-4">
                    <button onClick={() => setMessages([{ id: "reset", role: "assistant", content: "*Resetting neural link...* Connection restored." }])}>
                        <RotateCcw className="w-5 h-5 opacity-20 hover:opacity-100 transition-opacity" />
                    </button>
                    <GlowRing state={aiState} />
                </div>
            </div>

            {/* Message Stream */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-12 pb-32 px-4 scroll-smooth no-scrollbar"
            >
                <div ref={chatRef} className="space-y-12">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] group ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {msg.role === 'assistant' && (
                                        <div className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-3 opacity-30">Oracle</div>
                                    )}
                                    <div className={`text-lg md:text-xl leading-relaxed ${msg.role === 'user'
                                        ? 'text-white font-medium bg-white/5 px-6 py-4 rounded-2xl border border-white/5 shadow-sm'
                                        : 'text-white/90 font-light'
                                        }`}>
                                        {renderContent(msg.content)}
                                    </div>
                                    {msg.role === 'assistant' && (
                                        <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                                                <Volume2 className="w-3.5 h-3.5" /> Play Voice
                                            </button>
                                            <button
                                                onClick={captureSnippet}
                                                className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest hover:text-secondary transition-colors"
                                            >
                                                <Camera className="w-3.5 h-3.5" /> Save Memory
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Floating Input */}
            <div className="fixed bottom-10 left-0 right-0 px-4 pointer-events-none">
                <form
                    onSubmit={handleSend}
                    className="max-w-2xl mx-auto glass p-2 flex items-center gap-2 pointer-events-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
                >
                    <input
                        type="text"
                        placeholder="Speak to the soul..."
                        className="flex-1 bg-transparent px-6 py-4 outline-none text-white font-medium placeholder:text-white/10"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {isCapturing && (
                <div className="fixed inset-0 bg-background/95 z-100 flex items-center justify-center backdrop-blur-2xl">
                    <div className="flex flex-col items-center gap-8">
                        <div className="w-24 h-24 border-t-2 border-primary rounded-full animate-spin" />
                        <p className="text-2xl font-black tracking-widest animate-pulse text-glow">PERPETUATING MEMORY...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
