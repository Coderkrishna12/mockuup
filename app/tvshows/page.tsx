"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { tvShows, getShowPhases, getShowGenres, type TVShow } from "@/data/tvshows";
import { getPhaseColor } from "@/lib/utils";

const TimelineBg = dynamic(() => import("@/components/timeline3d/TimelineBg"), { ssr: false });

/* ═══════════════ 3D SHOW CARD ═══════════════ */
function ShowCard3D({ show, index }: { show: TVShow; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(viewRef, { margin: "-8% 0px -8% 0px", once: false });
    const color = getPhaseColor(show.phase);

    const statusColor = show.status === "Ongoing" ? "#22c55e" : show.status === "Upcoming" ? "#eab308" : "";

    /* Cursor-tracked 3D tilt */
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const card = cardRef.current;
        const glare = glareRef.current;
        const img = imgRef.current;
        if (!card) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const tiltX = (y - 0.5) * -8;
        const tiltY = (x - 0.5) * 8;

        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(12px) scale(1.03)`;
        if (glare) {
            glare.style.opacity = "1";
            glare.style.background = `radial-gradient(ellipse at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.13) 0%, transparent 55%)`;
        }
        if (img) img.style.transform = `scale(1.08) translate(${(x - 0.5) * -5}px, ${(y - 0.5) * -5}px)`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (cardRef.current) cardRef.current.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateZ(0) scale(1)";
        if (glareRef.current) glareRef.current.style.opacity = "0";
        if (imgRef.current) imgRef.current.style.transform = "scale(1) translate(0,0)";
    }, []);

    return (
        <motion.div
            ref={viewRef}
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 40, scale: 0.94 }
            }
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: (index % 5) * 0.06 }}
        >
            <Link href={`/tvshows/${show.id}`} className="block group" aria-label={`View ${show.title}`}>
                <div
                    ref={cardRef}
                    className="relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer"
                    style={{
                        background: "rgba(10,10,25,0.85)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        boxShadow: `0 2px 6px rgba(0,0,0,0.25), 0 8px 32px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.04) inset`,
                        transition: "transform 0.12s ease-out, box-shadow 0.35s ease, border-color 0.35s ease",
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={() => {
                        if (cardRef.current) {
                            cardRef.current.style.boxShadow = `0 4px 12px rgba(0,0,0,0.3), 0 16px 48px rgba(0,0,0,0.45), 0 0 50px ${color}12, 0 0 100px ${color}06`;
                            cardRef.current.style.borderColor = `${color}40`;
                        }
                    }}
                >
                    {/* Glare overlay */}
                    <div ref={glareRef} className="absolute inset-0 z-20 pointer-events-none rounded-2xl"
                        style={{ opacity: 0, transition: "opacity 0.2s ease", mixBlendMode: "overlay" }} />

                    {/* Shimmer sweep */}
                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-40"
                        style={{ transition: "opacity 0.4s ease" }}>
                        <div className="absolute w-[200%] h-[1px]"
                            style={{ top: "50%", left: "-50%", background: `linear-gradient(90deg, transparent 20%, ${color}50 50%, transparent 80%)`, animation: "shimmer-line 2.5s ease-in-out infinite", transform: "rotate(-35deg)" }} />
                    </div>

                    {/* Poster Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        ref={imgRef}
                        src={show.posterUrl}
                        alt={show.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        style={{ transition: "transform 0.12s ease-out", willChange: "transform" }}
                        onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }}
                    />

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a19] via-[#0a0a1940] to-transparent z-[3]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1960] via-transparent to-transparent z-[3]" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-[0.12em]"
                            style={{ background: `${color}18`, color, border: `1px solid ${color}30`, backdropFilter: "blur(8px)" }}>
                            P{show.phase}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold text-white/75"
                            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
                            {show.year}
                        </span>
                    </div>

                    {/* Status badge */}
                    {show.status !== "Completed" && (
                        <div className="absolute top-10 left-3 z-10">
                            <span className="text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white"
                                style={{ background: statusColor, boxShadow: `0 0 10px ${statusColor}50` }}>
                                {show.status}
                            </span>
                        </div>
                    )}

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                        <h3 className="font-heading text-lg md:text-xl text-white tracking-wider leading-tight mb-1 transition-colors duration-300 group-hover:text-[color:var(--accent)]"
                            style={{ "--accent": color, textShadow: `0 0 15px ${color}20` } as React.CSSProperties}>
                            {show.title}
                        </h3>
                        <p className="text-[10px] text-white/35 mb-1.5">{show.creator}</p>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] text-white/25">{show.seasons}S • {show.episodes}E</span>
                            <span className="text-[9px] text-white/15">{show.episodeRuntime}</span>
                        </div>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                            {show.genre.slice(0, 2).map((g) => (
                                <span key={g} className="text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-medium"
                                    style={{ background: `${color}10`, color: `${color}cc`, border: `1px solid ${color}15` }}>
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Top accent glow */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 z-10"
                        style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)`, transition: "opacity 0.3s ease" }} />
                </div>
            </Link>
        </motion.div>
    );
}

/* ═══════════════ PARALLAX LAYERS ═══════════════ */
function ParallaxLayers() {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
            <motion.div style={{ y: y1 }} className="absolute inset-0">
                <div className="absolute top-[15%] left-[10%] w-[450px] h-[450px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(237,29,36,0.03) 0%, transparent 70%)", filter: "blur(80px)" }} />
                <div className="absolute top-[55%] right-[5%] w-[500px] h-[500px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(60,80,200,0.025) 0%, transparent 70%)", filter: "blur(70px)" }} />
            </motion.div>
            <motion.div style={{ y: y2 }} className="absolute inset-0">
                <div className="absolute top-[35%] right-[30%] w-[350px] h-[350px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(168,85,247,0.02) 0%, transparent 70%)", filter: "blur(60px)" }} />
            </motion.div>
        </div>
    );
}

/* ═══════════════ SCROLL PROGRESS INDICATOR ═══════════════ */
function ScrollProgress({ progress, phases, activePhase }: { progress: number; phases: number[]; activePhase: number }) {
    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center"
            style={{ perspective: "500px", height: "240px" }}>
            <div className="relative w-[3px] h-full rounded-full" style={{ background: "rgba(255,255,255,0.04)", transform: "rotateY(-6deg)" }}>
                <motion.div className="absolute top-0 left-0 right-0 rounded-full"
                    animate={{ height: `${progress * 100}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 18 }}
                    style={{ background: `linear-gradient(to bottom, ${getPhaseColor(4)}80, ${getPhaseColor(5)})`, boxShadow: `0 0 8px ${getPhaseColor(activePhase)}40` }} />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full flex flex-col justify-between py-1">
                {phases.map((p) => (
                    <motion.div key={p} className="relative flex items-center"
                        animate={{ scale: activePhase === p ? 1.5 : 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                        <div className="w-2 h-2 rounded-full"
                            style={{
                                background: activePhase === p ? getPhaseColor(p) : "rgba(255,255,255,0.08)",
                                boxShadow: activePhase === p ? `0 0 10px ${getPhaseColor(p)}60` : "none",
                                transition: "all 0.3s ease",
                            }} />
                        <motion.span className="absolute right-5 text-[8px] font-semibold tracking-wider whitespace-nowrap"
                            style={{ color: activePhase === p ? getPhaseColor(p) : "rgba(255,255,255,0.15)" }}
                            animate={{ opacity: activePhase === p ? 1 : 0.3 }}>
                            Phase {p}
                        </motion.span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════ HERO HEADER ═══════════════ */
function HeroHeader() {
    return (
        <div className="relative pt-28 md:pt-36 pb-8 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Split text reveal */}
                <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-3 overflow-hidden">
                    {"MARVEL".split("").map((c, i) => (
                        <motion.span key={i} className="inline-block"
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 80, damping: 14, delay: i * 0.05 }}>
                            {c}
                        </motion.span>
                    ))}
                    {" "}
                    {"TV SHOWS".split("").map((c, i) => (
                        <motion.span key={`s-${i}`} className="inline-block"
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.35 + i * 0.04 }}
                            style={{ color: "#ED1D24", textShadow: "0 0 30px rgba(237,29,36,0.3)" }}>
                            {c === " " ? "\u00A0" : c}
                        </motion.span>
                    ))}
                </h1>

                <motion.p className="text-white/35 max-w-lg text-sm md:text-base leading-relaxed"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}>
                    Explore the expanding MCU through Disney+ series — from sitcom mysteries to cosmic adventures.
                </motion.p>

                {/* Glow sweep line */}
                <motion.div className="h-[1px] mt-6 max-w-md"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 1.1, duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ transformOrigin: "left", background: "linear-gradient(90deg, #ED1D24, rgba(237,29,36,0.1))" }} />
            </motion.div>
        </div>
    );
}

/* ═══════════════ FILTER BAR ═══════════════ */
function FilterBar({
    phases, genres, selectedPhase, selectedGenre,
    onPhaseChange, onGenreChange, onClear, hasFilters,
}: {
    phases: number[]; genres: string[];
    selectedPhase: number | null; selectedGenre: string | null;
    onPhaseChange: (p: number | null) => void; onGenreChange: (g: string | null) => void;
    onClear: () => void; hasFilters: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 100, damping: 18 }}
            className="sticky top-16 z-30 mx-6 mb-8"
        >
            <div className="max-w-7xl mx-auto rounded-2xl p-4 px-5"
                style={{
                    background: "rgba(8,8,20,0.75)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.03) inset",
                }}>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    {/* Phase */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-semibold">Phase</span>
                        {phases.map((p) => {
                            const active = selectedPhase === p;
                            const pc = getPhaseColor(p);
                            return (
                                <button key={p}
                                    onClick={() => onPhaseChange(active ? null : p)}
                                    className="px-2.5 py-1 text-[10px] rounded-lg border transition-all duration-300"
                                    style={{
                                        borderColor: active ? `${pc}60` : "rgba(255,255,255,0.06)",
                                        background: active ? `${pc}15` : "transparent",
                                        color: active ? pc : "rgba(255,255,255,0.35)",
                                        boxShadow: active ? `0 0 12px ${pc}15` : "none",
                                    }}>
                                    {p}
                                </button>
                            );
                        })}
                    </div>

                    <div className="w-[1px] h-5 bg-white/[0.06] hidden md:block" />

                    {/* Genre */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-semibold">Genre</span>
                        <select value={selectedGenre || ""}
                            onChange={(e) => onGenreChange(e.target.value || null)}
                            className="bg-transparent text-[10px] text-white/50 border border-white/[0.06] rounded-lg px-2.5 py-1 focus:border-red-500/40 focus:outline-none transition-colors"
                            style={{ backdropFilter: "blur(4px)" }}>
                            <option value="" className="bg-[#0a0a1e]">All</option>
                            {genres.map((g) => <option key={g} value={g} className="bg-[#0a0a1e]">{g}</option>)}
                        </select>
                    </div>

                    {hasFilters && (
                        <button onClick={onClear} className="text-[10px] text-red-400/70 hover:text-white transition-colors ml-auto">
                            Clear all
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ═══════════════ PHASE SECTION ═══════════════ */
function PhaseSection({ phase, shows, startIndex }: { phase: number; shows: TVShow[]; startIndex: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { margin: "-30% 0px -30% 0px", once: false });
    const color = getPhaseColor(phase);

    return (
        <motion.section ref={ref} className="mb-16 md:mb-20" data-phase={phase}
            animate={{ opacity: isInView ? 1 : 0.55, scale: isInView ? 1 : 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            {/* Phase header */}
            <motion.div className="flex items-center gap-3 mb-6 px-1"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 18 }} viewport={{ once: true }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}50` }} />
                <h2 className="font-heading text-2xl md:text-3xl text-white/80 tracking-wider">
                    Phase <span style={{ color }}>{phase}</span>
                </h2>
                <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(90deg, ${color}25, transparent)` }} />
                <span className="text-[10px] text-white/20">{shows.length} shows</span>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                {shows.map((show, i) => (
                    <ShowCard3D key={show.id} show={show} index={startIndex + i} />
                ))}
            </div>
        </motion.section>
    );
}

/* ═══════════════ PAGE ═══════════════ */
export default function TVShowsPage() {
    const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [activePhase, setActivePhase] = useState(4);
    const containerRef = useRef<HTMLDivElement>(null);

    const phases = getShowPhases();
    const genres = getShowGenres();

    const filtered = useMemo(() => {
        return tvShows.filter((s) => {
            if (selectedPhase && s.phase !== selectedPhase) return false;
            if (selectedGenre && !s.genre.includes(selectedGenre)) return false;
            return true;
        });
    }, [selectedPhase, selectedGenre]);

    const groupedByPhase = useMemo(() => {
        const groups: { phase: number; shows: TVShow[]; startIdx: number }[] = [];
        let idx = 0;
        const uniquePhases = [...new Set(filtered.map((s) => s.phase))].sort();
        for (const p of uniquePhases) {
            const shows = filtered.filter((s) => s.phase === p);
            groups.push({ phase: p, shows, startIdx: idx });
            idx += shows.length;
        }
        return groups;
    }, [filtered]);

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 18 });

    /* Track active phase via IntersectionObserver */
    useEffect(() => {
        if (!containerRef.current) return;
        const sections = containerRef.current.querySelectorAll("[data-phase]");
        const obs: IntersectionObserver[] = [];
        sections.forEach((sec) => {
            const o = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActivePhase(Number(sec.getAttribute("data-phase") || 4)); },
                { threshold: 0.3, rootMargin: "-25% 0px -25% 0px" }
            );
            o.observe(sec);
            obs.push(o);
        });
        return () => obs.forEach((o) => o.disconnect());
    }, [groupedByPhase]);

    const hasFilters = !!(selectedPhase || selectedGenre);

    return (
        <div className="min-h-screen relative bg-[#050510]" ref={containerRef}>
            <TimelineBg />
            <ParallaxLayers />
            <ScrollProgress progress={smoothProgress.get()} phases={phases} activePhase={activePhase} />

            <HeroHeader />

            <FilterBar
                phases={phases} genres={genres}
                selectedPhase={selectedPhase} selectedGenre={selectedGenre}
                onPhaseChange={setSelectedPhase} onGenreChange={setSelectedGenre}
                onClear={() => { setSelectedPhase(null); setSelectedGenre(null); }}
                hasFilters={hasFilters}
            />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
                {/* Count */}
                <motion.div className="text-[10px] text-white/20 mb-6 tracking-wider"
                    key={`${selectedPhase}-${selectedGenre}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {filtered.length} show{filtered.length !== 1 ? "s" : ""}
                </motion.div>

                {/* Phase sections */}
                <AnimatePresence mode="wait">
                    <motion.div key={`${selectedPhase}-${selectedGenre}`}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}>
                        {groupedByPhase.map((g) => (
                            <PhaseSection key={g.phase} phase={g.phase} shows={g.shows} startIndex={g.startIdx} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-white/30 text-lg mb-4">No shows match your filters.</p>
                        <button onClick={() => { setSelectedPhase(null); setSelectedGenre(null); }}
                            className="text-sm text-red-400/70 hover:text-white transition-colors">Clear filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}
