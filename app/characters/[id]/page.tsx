"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Sword, Zap, Brain, Shield, Gauge, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getCharacterById, characters } from "@/data/characters";
import { movies } from "@/data/movies";
import { useReducedMotion } from "@/lib/hooks";
import { staggerContainer, staggerItem } from "@/lib/animations";

const CharacterModelViewer = dynamic(() => import("@/components/CharacterModelViewer"), { ssr: false });

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const statIcons: Record<string, LucideIcon> = {
    strength: Sword,
    speed: Gauge,
    intelligence: Brain,
    power: Zap,
    combat: Shield,
    durability: Heart,
};

const statColors: Record<string, string> = {
    strength: "#EF4444",
    speed: "#3B82F6",
    intelligence: "#A855F7",
    power: "#FFD700",
    combat: "#F97316",
    durability: "#22C55E",
};

function AnimatedStatRing({
    value,
    label,
    color,
    icon: Icon,
    delay,
}: {
    value: number;
    label: string;
    color: string;
    icon: LucideIcon;
    delay: number;
}) {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (value / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="flex flex-col items-center"
        >
            <div className="relative w-24 h-24 md:w-28 md:h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="4"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset: offset }}
                        viewport={{ once: true }}
                        transition={{ delay: delay + 0.3, duration: 1.2, ease: "easeOut" }}
                        style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Icon size={16} style={{ color }} />
                    <span className="text-lg font-bold text-white mt-1">{value}</span>
                </div>
            </div>
            <span className="text-xs text-white/40 uppercase tracking-wider mt-2">{label}</span>
        </motion.div>
    );
}

export default function CharacterDetailPage() {
    const params = useParams();
    const router = useRouter();
    const reducedMotion = useReducedMotion();
    const contentRef = useRef<HTMLDivElement>(null);

    const character = getCharacterById(params.id as string);

    useEffect(() => {
        if (!character || reducedMotion) return;

        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>(".char-section").forEach((section, i) => {
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
    }, [character, reducedMotion]);

    if (!character) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-heading text-4xl text-white mb-4">Character Not Found</h1>
                    <Link href="/characters" className="text-marvel-red hover:text-white transition-colors">
                        ← Back to Characters
                    </Link>
                </div>
            </div>
        );
    }

    const appearances = character.movieIds
        .map((id) => movies.find((m) => m.id === id))
        .filter(Boolean);

    const relatedCharacters = characters
        .filter(
            (c) =>
                c.id !== character.id &&
                c.factions.some((f) => character.factions.includes(f))
        )
        .slice(0, 6);

    return (
        <div ref={contentRef} className="min-h-screen relative">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <Image
                    src={character.portraitUrl}
                    alt={character.name}
                    fill
                    unoptimized={true}
                    onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                    className="object-cover opacity-30 blur-sm scale-110 mb-4 transition-opacity"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />
            </div>

            <div className="relative z-10 pt-20 md:pt-28 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Back */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    </motion.div>

                    {/* Character Header */}
                    <div className="char-section grid grid-cols-1 md:grid-cols-[280px,1fr] gap-8 mb-16">
                        {/* Portrait */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative aspect-[3/4] rounded-xl overflow-hidden glow-red hidden md:block"
                        >
                            <Image
                                src={character.imageUrl}
                                alt={character.name}
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
                                {/* Factions */}
                                <div className="flex gap-2 mb-4">
                                    {character.factions.map((f) => (
                                        <span key={f} className="px-3 py-1 text-xs font-bold bg-marvel-red/80 rounded text-white">
                                            {f}
                                        </span>
                                    ))}
                                </div>

                                <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-1 leading-none">
                                    {character.name}
                                </h1>
                                <p className="text-xl text-marvel-gold/80 font-heading tracking-wider mb-2">
                                    {character.alias}
                                </p>
                                <p className="text-sm text-white/40 mb-6">{character.realName} • {character.firstAppearance}</p>

                                <p className="text-base text-white/70 leading-relaxed max-w-2xl mb-6">
                                    {character.bio}
                                </p>

                                {/* Powers */}
                                <div className="flex gap-2 flex-wrap">
                                    {character.powers.map((power) => (
                                        <span
                                            key={power}
                                            className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/50"
                                        >
                                            {power}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* 3D Holographic Model Viewer */}
                    <div className="char-section mb-16">
                        <h2 className="font-heading text-3xl text-white tracking-wider mb-6">
                            3D <span className="text-marvel-gold">MODEL VIEWER</span>
                        </h2>
                        <CharacterModelViewer
                            name={character.name}
                            alias={character.alias}
                            stats={character.stats as unknown as Record<string, number>}
                            primaryPowerType={character.powerTypes[0] || "Technology"}
                            posterUrl={character.imageUrl}
                        />
                        <div className="mt-4 flex gap-3">
                            <Link
                                href={`/ar?character=${character.id}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-marvel-red hover:bg-marvel-red/80 text-white font-heading tracking-wider text-sm rounded-lg transition-all"
                            >
                                🥽 TRY THE CHARACTER
                            </Link>
                        </div>
                    </div>

                    {/* Power Stats */}
                    <div className="char-section mb-16">
                        <h2 className="font-heading text-3xl text-white tracking-wider mb-8">
                            POWER <span className="text-marvel-gold">STATS</span>
                        </h2>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                            {Object.entries(character.stats).map(([key, value], i) => (
                                <AnimatedStatRing
                                    key={key}
                                    value={value}
                                    label={key}
                                    color={statColors[key] || "#ED1D24"}
                                    icon={statIcons[key] || Zap}
                                    delay={i * 0.1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Origin Story */}
                    <div className="char-section mb-16">
                        <h2 className="font-heading text-3xl text-white tracking-wider mb-4">
                            ORIGIN <span className="text-marvel-red">STORY</span>
                        </h2>
                        <div className="glass rounded-xl p-6">
                            <p className="text-white/70 leading-relaxed">{character.origin}</p>
                        </div>
                    </div>

                    {/* Iconic Quotes */}
                    {character.quotes.length > 0 && (
                        <div className="char-section mb-16">
                            <h2 className="font-heading text-3xl text-white tracking-wider mb-6">
                                ICONIC <span className="text-marvel-gold">QUOTES</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {character.quotes.map((quote, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass rounded-lg p-4 border-l-2 border-marvel-red"
                                    >
                                        <p className="text-white/80 italic">&ldquo;{quote}&rdquo;</p>
                                        <p className="text-xs text-white/30 mt-2">— {character.name}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Appearances */}
                    {appearances.length > 0 && (
                        <div className="char-section mb-16">
                            <h2 className="font-heading text-3xl text-white tracking-wider mb-6">
                                MCU <span className="text-marvel-red">APPEARANCES</span>
                            </h2>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {appearances.map((movie) => (
                                    movie && (
                                        <Link
                                            key={movie.id}
                                            href={`/movies/${movie.id}`}
                                            className="flex-shrink-0 group"
                                        >
                                            <div className="relative w-32 h-48 rounded-lg overflow-hidden">
                                                <Image
                                                    src={movie.posterUrl}
                                                    alt={movie.title}
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
                                                    <p className="font-heading text-xs text-white leading-tight">{movie.title}</p>
                                                    <p className="text-[10px] text-white/40">{movie.year}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Characters */}
                    {relatedCharacters.length > 0 && (
                        <div className="char-section">
                            <h2 className="font-heading text-3xl text-white tracking-wider mb-6">
                                RELATED <span className="text-marvel-red">CHARACTERS</span>
                            </h2>
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
                            >
                                {relatedCharacters.map((c) => (
                                    <motion.div key={c.id} variants={staggerItem}>
                                        <Link
                                            href={`/characters/${c.id}`}
                                            className="group block relative aspect-[3/4] rounded-lg overflow-hidden"
                                        >
                                            <Image
                                                src={c.imageUrl}
                                                alt={c.name}
                                                fill
                                                unoptimized={true}
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                                                    e.currentTarget.className = "object-contain p-4 opacity-50 transition-transform duration-500 group-hover:scale-110";
                                                }}
                                                sizes="(max-width: 640px) 50vw, 16vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                            <div className="absolute inset-0 border border-transparent group-hover:border-marvel-red/40 rounded-lg transition-colors" />
                                            <div className="absolute bottom-2 left-2">
                                                <p className="font-heading text-sm text-white">{c.name}</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
