"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronLeft, Volume2, Camera, RotateCcw, Phone, Mic, X, Info, Share2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toPng } from "html-to-image";
import GlowRing from "@/components/GlowRing";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    audioUrl?: string;
}

interface Character {
    id: number;
    name: string;
    description: string;
    title: string;
    image_url: string;
    banner_url: string;
    traits: string[];
}

function ChatContent() {
    const searchParams = useSearchParams();
    const charId = searchParams.get("id") || "1";

    const [character, setCharacter] = useState<Character | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [aiState, setAiState] = useState<"idle" | "thinking" | "speaking">("idle");
    const [isCapturing, setIsCapturing] = useState(false);
    const [isVoiceCall, setIsVoiceCall] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [showInfo, setShowInfo] = useState(true);

    const scrollRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchChar = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const res = await fetch(`${apiUrl}/characters/`);
                const data = await res.json();
                const current = data.find((c: any) => c.id.toString() === charId) || data[0];
                setCharacter(current);
                setMessages([{ id: "init", role: "assistant", content: `Hello! I am ${current.name}. ${current.description.split('.')[0]}.` }]);
            } catch (e) {
                console.error("Fetch failed", e);
            }
        };
        fetchChar();
    }, [charId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, aiState]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await sendVoiceMessage(audioBlob);
            };
            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) { console.error(err); }
    };

    const stopRecording = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); } };

    const sendVoiceMessage = async (blob: Blob) => {
        setAiState("thinking");
        try {
            const formData = new FormData();
            formData.append("audio_file", blob, "voice.wav");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/chat/voice/${charId}`, { method: "POST", body: formData });
            if (!response.ok) throw new Error("Voice API failed");
            const audioBlob = await response.blob();
            const textResponse = response.headers.get("X-Response-Text") || "Received your voice.";
            setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: textResponse }]);
            const audioUrl = URL.createObjectURL(audioBlob);
            if (audioRef.current) { audioRef.current.src = audioUrl; audioRef.current.play(); setAiState("speaking"); }
        } catch (err) { console.error(err); } finally { setAiState("idle"); }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setAiState("thinking");
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/chat/${charId}?user_message=${encodeURIComponent(input)}`, { method: "POST" });
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
                    fullText += decoder.decode(value);
                    setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: fullText } : m));
                }
            }
        } catch (err) { console.error(err); } finally { setAiState("idle"); }
    };

    const renderContent = (content: string) => {
        const parts = content.split(/(\*.*?\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("*") && part.endsWith("*")) return <span key={i} className="italic text-white/40 font-serif font-medium">{part.slice(1, -1)}</span>;
            return <span key={i}>{part}</span>;
        });
    };

    if (!character) return <div className="h-full flex items-center justify-center font-black animate-pulse opacity-20">NEURAL LINKING...</div>;

    return (
        <div className="flex h-full relative overflow-hidden bg-[#050505]">
            <audio ref={audioRef} onEnded={() => setAiState("idle")} className="hidden" />

            {/* Main Chat Flow */}
            <div className={`flex-1 flex flex-col h-full transition-all duration-500 ${showInfo ? 'mr-80' : 'mr-0'}`}>
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl z-30">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 group-hover:border-primary transition-colors">
                            <img src={character.image_url || "/avatar.png"} alt={character.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black tracking-tight uppercase">{character.name}</h2>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary">Character @ai</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsVoiceCall(true)} className="p-3 text-white/40 hover:text-white transition-colors bg-white/5 rounded-2xl"><Phone className="w-5 h-5" /></button>
                        <button onClick={() => setShowInfo(!showInfo)} className={`p-3 transition-colors rounded-2xl ${showInfo ? 'bg-primary text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}><Info className="w-5 h-5" /></button>
                    </div>
                </header>

                {/* Messages Container */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto pt-12 pb-40 px-6 md:px-0 no-scrollbar scroll-smooth"
                >
                    <div ref={chatRef} className="max-w-2xl mx-auto space-y-12">
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                            <img
                                                src={msg.role === 'assistant' ? (character.image_url || "/bot.png") : "https://api.dicebear.com/7.x/initials/svg?seed=User"}
                                                alt="" className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">
                                                {msg.role === 'assistant' ? character.name : 'You'}
                                            </span>
                                            <div className={`
                                                px-6 py-4 rounded-[1.5rem] text-sm md:text-base leading-relaxed font-medium transition-all duration-300
                                                ${msg.role === 'user' ? 'bg-white/5 text-white border border-white/5' : 'text-white/90'}
                                            `}>
                                                {renderContent(msg.content)}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {aiState === "thinking" && (
                            <div className="flex gap-4 justify-start">
                                <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse shrink-0" />
                                <div className="flex gap-1 items-center px-4 py-2 opacity-50">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Input Pill */}
                <div className="fixed bottom-12 left-0 right-0 px-4 z-40">
                    <div className={`max-w-2xl mx-auto transition-all duration-500 ${showInfo ? '-translate-x-40' : 'translate-x-0'}`}>
                        <form
                            onSubmit={handleSend}
                            className="glass p-1.5 flex items-center gap-2 rounded-[2rem] shadow-2xl border-white/5 group ring-1 ring-white/5 focus-within:ring-primary/40 transition-all bg-black"
                        >
                            <input
                                type="text"
                                placeholder={`Message ${character.name}...`}
                                className="flex-1 bg-transparent px-6 py-4 outline-none text-white font-semibold placeholder:text-white/10"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Character Info Sidebar */}
            <AnimatePresence>
                {showInfo && (
                    <motion.aside
                        initial={{ x: 320 }}
                        animate={{ x: 0 }}
                        exit={{ x: 320 }}
                        className="fixed right-0 top-0 h-full w-80 bg-black/60 backdrop-blur-3xl border-l border-white/5 z-40 overflow-y-auto no-scrollbar"
                    >
                        {/* Profile Banner */}
                        <div className="relative h-48 w-full group overflow-hidden">
                            {character.banner_url ? (
                                <img src={character.banner_url} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt="" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                        </div>

                        <div className="px-6 -mt-12 relative z-10 text-center">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-black mx-auto shadow-2xl mb-6">
                                <img src={character.image_url || "/avatar.png"} className="w-full h-full object-cover" alt="" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase mb-1">{character.name}</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">{character.title}</p>

                            <div className="flex items-center justify-center gap-3 mb-8">
                                <button className="glass px-6 py-3 rounded-2xl flex-1 text-[10px] font-black uppercase tracking-widest border-white/5 hover:bg-white/5 transition-all"><Share2 className="w-4 h-4 mx-auto" /></button>
                                <button className="glass px-6 py-3 rounded-2xl flex-1 text-[10px] font-black uppercase tracking-widest border-white/5 hover:bg-white/5 transition-all"><RotateCcw className="w-4 h-4 mx-auto" /></button>
                            </div>

                            <div className="text-left space-y-8">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 italic">Backstory</h3>
                                    <p className="text-sm text-white/50 leading-relaxed font-medium">{character.description}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 italic">Core Traits</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {character.traits?.map(t => (
                                            <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Voice Call Overlay (Retained) */}
            <AnimatePresence>
                {isVoiceCall && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8"
                    >
                        <div className="absolute top-10 right-10">
                            <button onClick={() => { setIsVoiceCall(false); stopRecording(); }} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                        <div className="flex flex-col items-center gap-12 max-w-lg w-full text-center">
                            <div className="space-y-4">
                                <h1 className="text-5xl font-black tracking-tighter italic uppercase">{character.name}</h1>
                                <p className="text-primary font-black uppercase tracking-[.4em] text-xs">Neural Sync Established</p>
                            </div>
                            <div className="relative w-56 h-56 flex items-center justify-center">
                                <motion.div animate={{ scale: aiState === "speaking" ? [1, 1.3, 1] : 1, opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-primary/20 rounded-full blur-[80px]" />
                                <div className="z-10 bg-black/40 border border-white/10 w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                                    <GlowRing state={aiState} />
                                </div>
                            </div>
                            <p className="text-2xl text-white font-black italic tracking-tight min-h-[4rem]">
                                {aiState === "thinking" ? "PROCESING..." : aiState === "speaking" ? "TRANSMITTING..." : isRecording ? "LISTENING..." : "AWAITING INPUT..."}
                            </p>
                            <button
                                onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording}
                                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${isRecording ? 'bg-red-500 scale-110 shadow-red-500/50' : 'bg-primary shadow-primary/50'}`}
                            >
                                <Mic className="w-10 h-10 text-white" />
                            </button>
                            <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black">Hold To Transmit</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="h-full flex items-center justify-center font-black animate-pulse opacity-20 uppercase tracking-[.5em]">Establishing Connection...</div>}>
            <ChatContent />
        </Suspense>
    );
}
