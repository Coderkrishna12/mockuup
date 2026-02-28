"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar, Pen, Paintbrush, Sparkles, MessageCircle, X, Send } from "lucide-react";
import { getComicById, comics } from "@/data/comics";
import { characters } from "@/data/characters";

export default function ComicDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const comic = getComicById(id);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([
        { role: "assistant", text: `Ask me anything about "${comic?.title}"! I can explain the story, related movies, characters, and timeline connections.` },
    ]);
    const [chatInput, setChatInput] = useState("");

    if (!comic) notFound();

    const comicCharacters = comic.characterIds.map((cid) => characters.find((c) => c.id === cid)).filter(Boolean);
    const relatedComics = comics.filter((c) => c.id !== comic.id && c.era === comic.era).slice(0, 4);

    const handleChat = () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput.trim();
        setChatInput("");
        setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);

        // Simple context-aware responses
        setTimeout(() => {
            let response = "";
            const q = userMsg.toLowerCase();

            if (q.includes("story") || q.includes("about") || q.includes("explain") || q.includes("summary")) {
                response = `${comic.title} (${comic.year}) — ${comic.summary} Written by ${comic.writer} and illustrated by ${comic.artist}. This comic is significant because: ${comic.significance}`;
            } else if (q.includes("movie") || q.includes("mcu") || q.includes("film")) {
                response = `"${comic.title}" influenced several MCU projects. The themes and storylines from this comic have been adapted into films and Disney+ series, keeping the core essence while adapting for the big screen.`;
            } else if (q.includes("character")) {
                const charNames = comicCharacters.map((c) => c?.name).filter(Boolean).join(", ");
                response = charNames
                    ? `The key characters in "${comic.title}" include: ${charNames}. Each brings unique abilities and perspectives to the story.`
                    : `"${comic.title}" features several iconic Marvel characters. The story explores their dynamics and growth throughout the narrative.`;
            } else if (q.includes("timeline") || q.includes("when") || q.includes("era")) {
                response = `"${comic.title}" belongs to the ${comic.era} of Marvel Comics (published ${comic.year}). This era was characterized by evolving storytelling styles and deeper character development.`;
            } else if (q.includes("writer") || q.includes("artist") || q.includes("who")) {
                response = `"${comic.title}" was written by ${comic.writer} and illustrated by ${comic.artist}. Together they created one of Marvel's landmark stories.`;
            } else {
                response = `Great question about "${comic.title}"! This ${comic.era} classic by ${comic.writer} is significant because: ${comic.significance}. Feel free to ask about the story, characters, related movies, or timeline placement!`;
            }

            setChatMessages((prev) => [...prev, { role: "assistant", text: response }]);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Hero */}
            <div className="relative min-h-[50vh] flex items-end overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(237,29,36,0.15),transparent_60%)]" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12 pt-28 w-full">
                    <Link href="/comics" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
                        <ArrowLeft size={16} /> Back to Comics
                    </Link>

                    <div className="grid md:grid-cols-[240px,1fr] gap-8">
                        {/* Cover */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <Image src={comic.coverUrl} alt={comic.title} fill className="object-cover" priority
                                onError={(e) => { e.currentTarget.src = "/marvel-logo.svg"; e.currentTarget.className = "object-contain p-8 opacity-30"; }}
                            />
                        </motion.div>

                        {/* Info */}
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <span className="text-xs font-bold uppercase tracking-widest text-marvel-red mb-2 block">{comic.era} • {comic.series}</span>
                            <h1 className="font-heading text-4xl md:text-6xl text-white tracking-wider mb-4">{comic.title}</h1>

                            <div className="flex flex-wrap gap-4 mb-6 text-sm text-white/50">
                                <span className="flex items-center gap-1.5"><Calendar size={14} /> {comic.year}</span>
                                <span className="flex items-center gap-1.5"><Pen size={14} /> {comic.writer}</span>
                                <span className="flex items-center gap-1.5"><Paintbrush size={14} /> {comic.artist}</span>
                            </div>

                            <div className="flex gap-2 mb-6">
                                {comic.genre.map((g) => (
                                    <span key={g} className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/50">{g}</span>
                                ))}
                            </div>

                            <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">{comic.summary}</p>

                            <div className="glass rounded-lg p-4 inline-block">
                                <div className="flex items-start gap-2">
                                    <Sparkles size={16} className="text-marvel-gold mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Significance</p>
                                        <p className="text-sm text-white/70">{comic.significance}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Characters */}
            {comicCharacters.length > 0 && (
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <h2 className="font-heading text-2xl text-white tracking-wider mb-6">
                        FEATURED <span className="text-marvel-red">CHARACTERS</span>
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {comicCharacters.map((c) => c && (
                            <Link key={c.id} href={`/characters/${c.id}`} className="group flex-shrink-0 text-center">
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-marvel-red transition-colors mb-2">
                                    <Image src={c.imageUrl} alt={c.name} fill className="object-cover"
                                        onError={(e) => { e.currentTarget.src = "/marvel-logo.svg"; e.currentTarget.className = "object-contain p-3 opacity-30"; }}
                                    />
                                </div>
                                <p className="text-xs text-white/50 group-hover:text-white transition-colors">{c.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Comics */}
            {relatedComics.length > 0 && (
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <h2 className="font-heading text-2xl text-white tracking-wider mb-6">
                        MORE FROM <span className="text-marvel-gold">{comic.era.toUpperCase()}</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedComics.map((rc) => (
                            <Link key={rc.id} href={`/comics/${rc.id}`} className="group relative aspect-[2/3] rounded-lg overflow-hidden border border-white/5 hover:border-marvel-red/30 transition-all">
                                <Image src={rc.coverUrl} alt={rc.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => { e.currentTarget.src = "/marvel-logo.svg"; e.currentTarget.className = "object-contain p-6 opacity-30"; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <p className="font-heading text-sm text-white">{rc.title}</p>
                                    <p className="text-[10px] text-white/40">{rc.year}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Chat Button */}
            <button
                onClick={() => setChatOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-marvel-red hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-marvel-red/30 hover:shadow-marvel-red/50 transition-all hover:scale-110"
                aria-label="Open comic assistant"
            >
                <MessageCircle size={24} />
            </button>

            {/* AI Chat Panel */}
            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[480px] glass-strong rounded-xl border border-white/10 flex flex-col overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-sm font-bold text-white">Comic Assistant</span>
                            </div>
                            <button onClick={() => setChatOpen(false)} className="text-white/40 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px]">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${msg.role === "user"
                                        ? "bg-marvel-red text-white"
                                        : "bg-white/5 text-white/70 border border-white/5"
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-white/10">
                            <form onSubmit={(e) => { e.preventDefault(); handleChat(); }} className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Ask about this comic..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-marvel-red"
                                />
                                <button type="submit" className="px-3 py-2 bg-marvel-red rounded-lg text-white hover:bg-red-700 transition-colors">
                                    <Send size={14} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
