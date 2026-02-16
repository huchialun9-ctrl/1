"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, User, MessageSquare, List, Sparkles } from "lucide-react";

export default function CreateCharacter() {
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        description: "",
        traits: "",
        systemPrompt: "",
        examples: ["", "", ""]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            traits: formData.traits.split(",").map(t => t.trim()),
            few_shot_examples: formData.examples.filter(ex => ex.trim() !== "")
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/characters/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to create character");

            alert("Character brought to life! Check the Explorer.");
            window.location.href = "/chat";
        } catch (err) {
            console.error("Creation failed:", err);
            alert("Failed to create character. Check backend connection.");
        }
    };

    return (
        <div className="min-h-screen py-20 px-4 flex justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 md:p-12 max-w-4xl w-full border border-white/10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Character Creator</h1>
                        <p className="text-white/50">Define your AI's soul and voice.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold opacity-70">Name</label>
                            <input
                                type="text"
                                placeholder="Ex: Luna Echo"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold opacity-70">Title / Role</label>
                            <input
                                type="text"
                                placeholder="Ex: Cyber-Oracle"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold opacity-70">Description (Background Story)</label>
                        <textarea
                            rows={4}
                            placeholder="Tell the AI who they are, their past, and their motivations..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold opacity-70 flex items-center gap-2">
                            <List className="w-4 h-4" /> Personality Traits (Comma separated)
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Sarcastic, Wise, Distant, Protective"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
                            value={formData.traits}
                            onChange={(e) => setFormData({ ...formData, traits: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold opacity-70 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> System Prompt (Rules & Tone)
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Ex: Never break character. Speak in cryptic metaphors. Use 21st-century slang."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
                            value={formData.systemPrompt}
                            onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                        />
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <button
                            type="submit"
                            className="w-full py-4 bg-linear-to-r from-primary to-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <Save className="w-5 h-5" />
                            Bring to Life
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
