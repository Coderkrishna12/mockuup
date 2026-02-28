"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Film, Star, Tv, Play } from "lucide-react";
import { getTVShowById, tvShows } from "@/data/tvshows";
import { getCharacterById } from "@/data/characters";
import TVShowCard from "@/components/TVShowCard";

export default function TVShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const show = getTVShowById(id);

    if (!show) {
        notFound();
    }

    const castCharacters = show.castIds.map(getCharacterById).filter(Boolean);

    // Get related shows (same phase, excluding current)
    const relatedShows = tvShows
        .filter((s) => s.phase === show.phase && s.id !== show.id)
        .slice(0, 4);

    const statusColor =
        show.status === "Ongoing"
            ? "text-green-400 border-green-400/30 bg-green-400/10"
            : show.status === "Upcoming"
                ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                : "text-white/50 border-white/10 bg-white/5";

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Backdrop */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <Image
                    src={show.backdropUrl}
                    alt={show.title}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                        e.currentTarget.style.opacity = "0";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-24 left-6 z-20"
                >
                    <Link
                        href="/tvshows"
                        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors glass-strong px-4 py-2 rounded-full"
                    >
                        <ArrowLeft size={16} /> Back to Shows
                    </Link>
                </motion.div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 -mt-40 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-shrink-0 w-[200px] md:w-[280px]"
                    >
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                            <Image
                                src={show.posterUrl}
                                alt={show.title}
                                fill
                                className="object-cover"
                                priority
                                onError={(e) => {
                                    e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                                    e.currentTarget.className = "object-contain p-8 opacity-30";
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex-1"
                    >
                        {/* Phase badge */}
                        <span className="text-xs text-marvel-red font-bold uppercase tracking-widest mb-2 block">
                            MCU Phase {show.phase}
                        </span>

                        <h1 className="font-heading text-4xl md:text-6xl text-white tracking-wider mb-4 leading-tight">
                            {show.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center gap-1.5 text-sm text-white/50">
                                <Calendar size={14} />
                                <span>{show.year}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-white/50">
                                <Tv size={14} />
                                <span>{show.seasons} Season{show.seasons > 1 ? "s" : ""} • {show.episodes} Episodes</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-white/50">
                                <Clock size={14} />
                                <span>{show.episodeRuntime}</span>
                            </div>
                            <span className={`text-[10px] px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${statusColor}`}>
                                {show.status}
                            </span>
                            <span className="text-[10px] px-3 py-1 rounded-full border border-white/10 text-white/40">
                                {show.rating}
                            </span>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {show.genre.map((g) => (
                                <span
                                    key={g}
                                    className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/60"
                                >
                                    {g}
                                </span>
                            ))}
                        </div>

                        {/* Synopsis */}
                        <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
                            {show.synopsis}
                        </p>

                        {/* Creator */}
                        <div className="mb-6">
                            <span className="text-xs text-white/30 uppercase tracking-wider">Created by</span>
                            <p className="text-white/80 font-medium">{show.creator}</p>
                        </div>

                        {/* Trailer Button */}
                        <a
                            href={show.trailerUrl.replace("embed/", "watch?v=")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-marvel-red hover:bg-red-700 text-white rounded-full transition-all font-medium text-sm"
                        >
                            <Play size={16} /> Watch Trailer
                        </a>
                    </motion.div>
                </div>

                {/* Cast Section */}
                {castCharacters.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16"
                    >
                        <h2 className="font-heading text-2xl text-white tracking-wider mb-6">
                            FEATURED <span className="text-marvel-red">CHARACTERS</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                            {castCharacters.map((character) =>
                                character ? (
                                    <Link
                                        key={character.id}
                                        href={`/characters/${character.id}`}
                                        className="group text-center"
                                    >
                                        <div className="relative aspect-square rounded-full overflow-hidden mb-2 border-2 border-white/10 group-hover:border-marvel-red transition-colors">
                                            <Image
                                                src={character.imageUrl}
                                                alt={character.name}
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                                                    e.currentTarget.className = "object-contain p-4 opacity-30";
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-white/60 group-hover:text-white transition-colors">{character.name}</p>
                                    </Link>
                                ) : null
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Related Shows */}
                {relatedShows.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 mb-24"
                    >
                        <h2 className="font-heading text-2xl text-white tracking-wider mb-6">
                            MORE FROM <span className="text-marvel-gold">PHASE {show.phase}</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {relatedShows.map((s, i) => (
                                <TVShowCard key={s.id} show={s} index={i} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
