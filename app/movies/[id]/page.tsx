"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Play, Calendar, Clock, Star, X } from "lucide-react";

import { getMovieById, movies } from "@/data/movies";
import { characters } from "@/data/characters";
import { useReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function MovieDetailPage() {
    const params = useParams();
    const router = useRouter();
    const reducedMotion = useReducedMotion();
    const [showTrailer, setShowTrailer] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const movie = getMovieById(params.id as string);

    useEffect(() => {
        if (!movie || reducedMotion) return;

        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>(".detail-section").forEach((section, i) => {
                gsap.from(section, {
                    opacity: 0,
                    y: 40,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });
            });
        }, contentRef);

        return () => ctx.revert();
    }, [movie, reducedMotion]);

    if (!movie) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-heading text-4xl text-white mb-4">Movie Not Found</h1>
                    <Link href="/movies" className="text-marvel-red hover:text-white transition-colors">
                        ← Back to Movies
                    </Link>
                </div>
            </div>
        );
    }

    const cast = movie.castIds
        .map((id) => characters.find((c) => c.id === id))
        .filter(Boolean);

    const relatedMovies = movies
        .filter((m) => m.phase === movie.phase && m.id !== movie.id)
        .slice(0, 4);

    return (
        <div ref={contentRef} className="min-h-screen relative">
            {/* Full-bleed poster background */}
            <div className="fixed inset-0 z-0">
                <Image
                    src={movie.backdropUrl}
                    alt={movie.title}
                    fill
                    unoptimized={true}
                    onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                    className="object-cover transition-opacity duration-1000"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 pt-20 md:pt-28 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Back button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    </motion.div>

                    {/* Movie Header */}
                    <div className="detail-section grid grid-cols-1 md:grid-cols-[300px,1fr] gap-8 mb-16">
                        {/* Poster */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative aspect-[2/3] rounded-xl overflow-hidden glow-red hidden md:block"
                        >
                            <Image
                                src={movie.posterUrl}
                                alt={movie.title}
                                fill
                                unoptimized={true}
                                onError={(e) => {
                                    e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                                    e.currentTarget.className = "object-contain p-8 opacity-40";
                                }}
                                className="object-cover"
                                priority
                            />
                        </motion.div>

                        {/* Info */}
                        <div className="flex flex-col justify-end">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 text-xs font-bold bg-marvel-red/80 rounded text-white">
                                        Phase {movie.phase}
                                    </span>
                                    <span className="text-sm text-white/50 flex items-center gap-1">
                                        <Calendar size={14} /> {movie.year}
                                    </span>
                                    <span className="text-sm text-white/50 flex items-center gap-1">
                                        <Clock size={14} /> {movie.duration}
                                    </span>
                                    <span className="text-sm text-white/50 flex items-center gap-1">
                                        <Star size={14} /> {movie.rating}
                                    </span>
                                </div>

                                <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-4 leading-none">
                                    {movie.title}
                                </h1>

                                <p className="text-sm text-white/40 mb-2">Directed by {movie.director}</p>

                                <div className="flex gap-2 mb-6">
                                    {movie.genre.map((g) => (
                                        <span key={g} className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/50">
                                            {g}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-base text-white/70 leading-relaxed max-w-2xl mb-8">
                                    {movie.synopsis}
                                </p>

                                <button
                                    onClick={() => setShowTrailer(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-marvel-red text-white font-medium rounded-lg hover:glow-red-intense transition-all hover:scale-105 gpu-accelerated"
                                >
                                    <Play size={18} />
                                    Watch Trailer
                                </button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Cast Carousel */}
                    {cast.length > 0 && (
                        <div className="detail-section mb-16">
                            <h2 className="font-heading text-3xl text-white tracking-wider mb-6">
                                FEATURED <span className="text-marvel-red">CAST</span>
                            </h2>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" role="list">
                                {cast.map((character) => (
                                    character && (
                                        <Link
                                            key={character.id}
                                            href={`/characters/${character.id}`}
                                            className="flex-shrink-0 group"
                                            role="listitem"
                                        >
                                            <div className="relative w-32 h-48 rounded-lg overflow-hidden">
                                                <Image
                                                    src={character.imageUrl}
                                                    alt={character.name}
                                                    fill
                                                    unoptimized={true}
                                                    onError={(e) => {
                                                        e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                                                        e.currentTarget.className = "object-contain p-4 opacity-50 transition-transform duration-500 group-hover:scale-110";
                                                    }}
                                                    sizes="128px"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                                <div className="absolute inset-0 border border-transparent group-hover:border-marvel-red/40 rounded-lg transition-colors" />
                                                <div className="absolute bottom-2 left-2 right-2">
                                                    <p className="font-heading text-sm text-white">{character.name}</p>
                                                    <p className="text-[10px] text-white/40">{character.realName}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Movies */}
                    {relatedMovies.length > 0 && (
                        <div className="detail-section">
                            <h2 className="font-heading text-3xl text-white tracking-wider mb-6">
                                MORE FROM <span className="text-marvel-red">PHASE {movie.phase}</span>
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {relatedMovies.map((m) => (
                                    <Link
                                        key={m.id}
                                        href={`/movies/${m.id}`}
                                        className="group relative aspect-[2/3] rounded-lg overflow-hidden"
                                    >
                                        <Image
                                            src={m.posterUrl}
                                            alt={m.title}
                                            fill
                                            unoptimized={true}
                                            onError={(e) => {
                                                e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                                                e.currentTarget.className = "object-contain p-4 opacity-50 transition-transform duration-500 group-hover:scale-110";
                                            }}
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                                        <div className="absolute inset-0 border border-transparent group-hover:border-marvel-red/30 rounded-lg transition-colors" />
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <p className="font-heading text-lg text-white">{m.title}</p>
                                            <p className="text-xs text-white/40">{m.year}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Trailer Modal */}
            <AnimatePresence>
                {showTrailer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={() => setShowTrailer(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden glow-red"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowTrailer(false)}
                                className="absolute -top-10 right-0 text-white/60 hover:text-white z-10"
                                aria-label="Close trailer"
                            >
                                <X size={24} />
                            </button>
                            <iframe
                                src={`${movie.trailerUrl}?autoplay=1`}
                                title={`${movie.title} Trailer`}
                                className="w-full h-full"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
