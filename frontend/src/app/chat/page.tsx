"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronLeft, Volume2, Camera, RotateCcw, Phone, Mic, X } from "lucide-react";
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
    const [isVoiceCall, setIsVoiceCall] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await sendVoiceMessage(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendVoiceMessage = async (blob: Blob) => {
        setAiState("thinking");
        try {
            const formData = new FormData();
            formData.append("audio_file", blob, "voice.wav");

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/chat/voice/1`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error("Voice API failed");

            const audioBlob = await response.blob();
            const textResponse = response.headers.get("X-Response-Text") || "AI responded with voice.";

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: "assistant",
                content: textResponse
            }]);

            // Play the received audio
            const audioUrl = URL.createObjectURL(audioBlob);
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
                setAiState("speaking");
            }
        } catch (err) {
            console.error("Voice chat failed:", err);
        } finally {
            setAiState("idle");
        }
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
            const response = await fetch(`${apiUrl}/chat/1?user_message=${encodeURIComponent(input)}`, {
                method: "POST"
            });

            if (!response.ok) throw new Error("API call failed");

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
            <audio ref={audioRef} onEnded={() => setAiState("idle")} className="hidden" />

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
                    <button
                        onClick={() => setIsVoiceCall(true)}
                        className="p-3 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10"
                    >
                        <Phone className="w-5 h-5" />
                    </button>
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
                    className="max-w-2xl mx-auto glass p-2 flex items-center gap-2 pointer-events-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-2xl"
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

            {/* Voice Call Overlay */}
            <AnimatePresence>
                {isVoiceCall && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center p-8"
                    >
                        <div className="absolute top-10 right-10">
                            <button
                                onClick={() => { setIsVoiceCall(false); stopRecording(); }}
                                className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center gap-12 max-w-lg w-full text-center">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-black tracking-tighter">LUNA ECHO</h1>
                                <p className="text-primary font-bold uppercase tracking-widest text-sm">Secure Neural Link</p>
                            </div>

                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        scale: aiState === "speaking" ? [1, 1.2, 1] : 1,
                                        opacity: aiState === "speaking" ? [0.3, 0.6, 0.3] : 0.3
                                    }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-primary rounded-full blur-3xl"
                                />
                                <div className="z-10 bg-white/5 border border-white/10 w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                                    <GlowRing state={aiState} />
                                </div>
                            </div>

                            <p className="text-xl text-white/50 font-medium italic min-h-[3rem]">
                                {aiState === "thinking" ? "Thinking..." : aiState === "speaking" ? "AI is speaking..." : isRecording ? "Listening..." : "Waiting for your command"}
                            </p>

                            <button
                                onMouseDown={startRecording}
                                onMouseUp={stopRecording}
                                onTouchStart={startRecording}
                                onTouchEnd={stopRecording}
                                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${isRecording
                                        ? 'bg-red-500 shadow-red-500/40 scale-110'
                                        : 'bg-primary shadow-primary/40'
                                    }`}
                            >
                                <Mic className="w-10 h-10 text-white" />
                            </button>
                            <p className="text-xs text-white/20 uppercase tracking-widest font-black">Hold to speak</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
