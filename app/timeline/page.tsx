"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { GitBranch, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { timelineEvents, getMainTimelineEvents, type TimelineEvent } from "@/data/timeline";
import { getPhaseColor } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const TimelineBg = dynamic(() => import("@/components/timeline3d/TimelineBg"), { ssr: false });

/* ─── Poster map ─── */
const posters: Record<string, string> = {
    "iron-man": "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
    "the-incredible-hulk": "https://image.tmdb.org/t/p/w500/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg",
    "iron-man-2": "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
    "thor": "https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg",
    "captain-america-the-first-avenger": "https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg",
    "the-avengers": "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
    "iron-man-3": "https://image.tmdb.org/t/p/w500/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg",
    "thor-the-dark-world": "https://image.tmdb.org/t/p/w500/wp6OxE4poJ4G7c0U2ZIXasTSMR7.jpg",
    "captain-america-the-winter-soldier": "https://image.tmdb.org/t/p/w500/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg",
    "guardians-of-the-galaxy": "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
    "avengers-age-of-ultron": "https://image.tmdb.org/t/p/w500/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg",
    "ant-man": "https://image.tmdb.org/t/p/w500/rQRnQfUl3kfp78nCWq8Ks04vnq1.jpg",
    "captain-america-civil-war": "https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg",
    "doctor-strange": "https://image.tmdb.org/t/p/w500/xf8PbyQcR5ucXErmZNzdKR0s8ya.jpg",
    "spider-man-homecoming": "https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg",
    "thor-ragnarok": "https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg",
    "black-panther": "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
    "avengers-infinity-war": "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    "avengers-endgame": "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    "black-widow": "https://image.tmdb.org/t/p/w500/7JPpIjhD2V0sKyFvhB9khUMa30d.jpg",
    "doctor-strange-multiverse-of-madness": "https://image.tmdb.org/t/p/w500/ddJcSKbcp4rKZTmuyWaMhuwcfMz.jpg",
    "spider-man-no-way-home": "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    "ant-man-quantumania": "https://image.tmdb.org/t/p/w500/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg",
    "guardians-of-the-galaxy-vol-3": "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    "deadpool-wolverine": "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
};

/* ═══════════════ TIMELINE CARD (spring-physics, layered shadows, 3D tilt) ═══════════════ */
function TimelineCard({ event, index, isActive }: { event: TimelineEvent; index: number; isActive: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(viewRef, { margin: "-15% 0px -15% 0px", once: false });
    const color = getPhaseColor(event.phase);
    const poster = posters[event.movieId];
    const isLeft = index % 2 === 0;

    /* Spring-based scale when active */
    const springScale = useSpring(isActive ? 1 : 0.94, { stiffness: 200, damping: 24 });
    const springY = useSpring(isActive ? 0 : 12, { stiffness: 180, damping: 22 });
    const springRotate = useSpring(0, { stiffness: 250, damping: 30 });

    /* 3D cursor tilt */
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const card = cardRef.current;
        const glare = glareRef.current;
        const img = imgRef.current;
        if (!card) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const tiltX = (y - 0.5) * -10;
        const tiltY = (x - 0.5) * 10;
        card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        if (glare) {
            glare.style.opacity = "1";
            glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.12) 0%, transparent 55%)`;
        }
        if (img) img.style.transform = `scale(1.06) translate(${(x - 0.5) * -6}px, ${(y - 0.5) * -6}px)`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (cardRef.current) cardRef.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)";
        if (glareRef.current) glareRef.current.style.opacity = "0";
        if (imgRef.current) imgRef.current.style.transform = "scale(1) translate(0,0)";
    }, []);

    return (
        <div
            ref={viewRef}
            className={`relative flex items-start gap-0 md:gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-col md:flex-row`}
        >
            {/* ─── Card ─── */}
            <motion.div
                style={{ scale: springScale, y: springY }}
                className={`relative w-full md:w-[340px] shrink-0 ${isLeft ? "md:mr-0" : "md:ml-0"}`}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50, rotateY: isLeft ? -6 : 6 }}
                    animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : { opacity: 0, y: 50, rotateY: isLeft ? -6 : 6 }}
                    transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.05 }}
                    style={{ perspective: "1000px" }}
                >
                    <div
                        ref={cardRef}
                        className="relative rounded-2xl overflow-hidden cursor-pointer"
                        style={{
                            background: "rgba(10,10,25,0.85)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: `1px solid ${isActive ? `${color}50` : "rgba(255,255,255,0.06)"}`,
                            boxShadow: isActive
                                ? `0 2px 8px rgba(0,0,0,0.3), 0 8px 30px rgba(0,0,0,0.4), 0 0 40px ${color}15, 0 0 80px ${color}08`
                                : "0 2px 8px rgba(0,0,0,0.2), 0 8px 30px rgba(0,0,0,0.3)",
                            transition: "border-color 0.4s ease, box-shadow 0.5s ease, transform 0.12s ease-out",
                            transformStyle: "preserve-3d",
                            willChange: "transform",
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Glare overlay */}
                        <div ref={glareRef} className="absolute inset-0 z-30 pointer-events-none rounded-2xl"
                            style={{ opacity: 0, transition: "opacity 0.25s ease", mixBlendMode: "overlay" }} />

                        {/* Poster */}
                        <div className="relative w-full h-[320px] md:h-[380px] overflow-hidden">
                            {poster && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    ref={imgRef}
                                    src={poster}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    style={{ transition: "transform 0.12s ease-out", willChange: "transform" }}
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a19] via-transparent to-[#0a0a1920]" />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-[0.12em]"
                                    style={{ background: `${color}20`, color, border: `1px solid ${color}35`, backdropFilter: "blur(8px)" }}>
                                    P{event.phase}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold text-white/70"
                                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
                                    {event.date}
                                </span>
                            </div>
                        </div>

                        {/* Content — staggered reveal */}
                        <motion.div className="p-5"
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.15 }}
                        >
                            <h3 className="font-heading text-xl md:text-2xl text-white tracking-wider leading-tight mb-2"
                                style={{ textShadow: isActive ? `0 0 20px ${color}30` : "none" }}>
                                {event.title}
                            </h3>
                            {!event.isMainTimeline && (
                                <div className="flex items-center gap-1.5 mb-2">
                                    <GitBranch size={10} className="text-white/25" />
                                    <span className="text-[9px] text-white/25 tracking-wider">{event.universe}</span>
                                </div>
                            )}
                            <motion.p className="text-[11px] text-white/40 leading-relaxed mb-3 line-clamp-3"
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.25 }}>
                                {event.description}
                            </motion.p>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold"
                                    style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}>
                                    {event.category}
                                </span>
                                <a href={`/movies/${event.movieId}`}
                                    className="text-[10px] font-medium flex items-center gap-1 transition-colors hover:text-white"
                                    style={{ color }}>
                                    Explore <ChevronRight size={10} />
                                </a>
                            </div>
                        </motion.div>

                        {/* Top accent */}
                        <div className="absolute top-0 left-0 right-0 h-[2px]"
                            style={{
                                background: `linear-gradient(90deg, transparent 10%, ${color}${isActive ? "90" : "40"} 50%, transparent 90%)`,
                                transition: "background 0.4s ease"
                            }} />
                    </div>
                </motion.div>
            </motion.div>

            {/* ─── Timeline Spine (center connector) ─── */}
            <div className="hidden md:flex flex-col items-center shrink-0 relative" style={{ width: "48px" }}>
                {/* Dot */}
                <div className="relative z-10">
                    <motion.div
                        className="w-4 h-4 rounded-full"
                        style={{
                            background: isActive ? color : "rgba(255,255,255,0.08)",
                            border: `2px solid ${isActive ? color : "rgba(255,255,255,0.12)"}`,
                            boxShadow: isActive ? `0 0 16px ${color}60, 0 0 40px ${color}25` : "none",
                        }}
                        animate={{ scale: isActive ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                </div>
                {/* Connector line */}
                <div className="w-[1px] h-full min-h-[120px]"
                    style={{ background: `linear-gradient(to bottom, ${color}30, rgba(255,255,255,0.04))` }} />
            </div>

            {/* ─── Side meta ─── */}
            <motion.div
                className={`hidden md:block flex-1 max-w-[260px] pt-1 ${isLeft ? "" : "text-right"}`}
                initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            >
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color }}>
                    {event.date} — Phase {event.phase}
                </div>
                <p className="text-[12px] text-white/35 leading-relaxed">{event.description}</p>
            </motion.div>
        </div>
    );
}

/* ═══════════════ 3D DEPTH PROGRESS INDICATOR ═══════════════ */
function DepthIndicator({ progress, events, activeIndex }: { progress: number; events: TimelineEvent[]; activeIndex: number }) {
    const barHeight = useSpring(progress * 100, { stiffness: 80, damping: 20 });
    const activeColor = events[activeIndex] ? getPhaseColor(events[activeIndex].phase) : "#8888ff";

    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-0"
            style={{ perspective: "600px", height: "280px" }}>
            {/* Track */}
            <div className="relative w-[3px] h-full rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", transform: "rotateY(-8deg)" }}>
                {/* Fill */}
                <motion.div className="absolute top-0 left-0 right-0 rounded-full"
                    style={{
                        height: barHeight.get() + "%",
                        background: `linear-gradient(to bottom, ${activeColor}80, ${activeColor})`,
                        boxShadow: `0 0 10px ${activeColor}50, 0 0 25px ${activeColor}20`,
                    }}
                    animate={{ height: `${progress * 100}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                />
            </div>

            {/* Section dots */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full flex flex-col justify-between py-1">
                {[1, 2, 3, 4, 5].map((phase) => {
                    const phaseColor = getPhaseColor(phase);
                    const phaseActive = events[activeIndex]?.phase === phase;
                    return (
                        <motion.div
                            key={phase}
                            className="relative flex items-center"
                            animate={{ scale: phaseActive ? 1.4 : 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                            <div className="w-2.5 h-2.5 rounded-full"
                                style={{
                                    background: phaseActive ? phaseColor : "rgba(255,255,255,0.08)",
                                    boxShadow: phaseActive ? `0 0 12px ${phaseColor}70` : "none",
                                    transition: "all 0.3s ease",
                                }} />
                            {/* Label */}
                            <motion.span
                                className="absolute right-6 text-[9px] font-semibold tracking-wider whitespace-nowrap"
                                style={{ color: phaseActive ? phaseColor : "rgba(255,255,255,0.2)" }}
                                animate={{ opacity: phaseActive ? 1 : 0.4, x: phaseActive ? 0 : 4 }}
                                transition={{ duration: 0.3 }}
                            >
                                Phase {phase}
                            </motion.span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════ PARALLAX BACKGROUND LAYERS ═══════════════ */
function ParallaxLayers() {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -200]);

    return (
        <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
            {/* Deep layer — large soft gradient */}
            <motion.div
                style={{ y: y1 }}
                className="absolute inset-0"
            >
                <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(100,50,200,0.04) 0%, transparent 70%)", filter: "blur(80px)" }} />
                <div className="absolute top-[60%] right-[10%] w-[400px] h-[400px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(30,100,255,0.03) 0%, transparent 70%)", filter: "blur(60px)" }} />
            </motion.div>

            {/* Mid layer — accent glows */}
            <motion.div style={{ y: y2 }} className="absolute inset-0">
                <div className="absolute top-[40%] right-[25%] w-[300px] h-[300px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(255,215,0,0.025) 0%, transparent 70%)", filter: "blur(50px)" }} />
            </motion.div>

            {/* Near layer — subtle noise/texture */}
            <motion.div style={{ y: y3 }} className="absolute inset-0 opacity-[0.015]"
            >
                <div className="w-full h-[200%]"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />
            </motion.div>
        </div>
    );
}

/* ═══════════════ PAGE ═══════════════ */
export default function TimelinePage() {
    const [showAlternate, setShowAlternate] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const events = showAlternate ? timelineEvents : getMainTimelineEvents();

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

    /* Progressive timeline line */
    const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    /* Track active card via IntersectionObserver */
    useEffect(() => {
        if (!containerRef.current) return;
        const cards = containerRef.current.querySelectorAll("[data-tl-idx]");
        const observers: IntersectionObserver[] = [];
        cards.forEach((card) => {
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveIndex(Number(card.getAttribute("data-tl-idx") || 0)); },
                { threshold: 0.35, rootMargin: "-20% 0px -20% 0px" }
            );
            obs.observe(card);
            observers.push(obs);
        });
        return () => observers.forEach((o) => o.disconnect());
    }, [events]);

    return (
        <div className="min-h-screen relative bg-[#050510]">
            {/* 3D particle background */}
            <TimelineBg />

            {/* Parallax depth layers */}
            <ParallaxLayers />

            {/* 3D Depth Progress Indicator */}
            <DepthIndicator progress={smoothProgress.get()} events={events} activeIndex={activeIndex} />

            {/* ─── Header ─── */}
            <div className="sticky top-16 z-30 border-b border-white/[0.04]"
                style={{ background: "rgba(5,5,16,0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
                <div className="max-w-6xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-heading text-3xl md:text-4xl text-white tracking-wider">
                                MCU <span style={{ color: "#FFD700", textShadow: "0 0 20px rgba(255,215,0,0.3)" }}>TIMELINE</span>
                            </h1>
                            <p className="text-[10px] text-white/20 mt-0.5 tracking-wider">A scroll-driven journey through the Marvel Cinematic Universe</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setShowAlternate(!showAlternate)}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border transition-all ${showAlternate ? "bg-purple-500/10 border-purple-500/40 text-purple-400"
                                        : "border-white/[0.08] text-white/35 hover:border-white/20"}`}>
                                <GitBranch size={12} />{showAlternate ? "All Timelines" : "Sacred Only"}
                            </button>
                            <div className="hidden md:flex items-center gap-2.5">
                                {[1, 2, 3, 4, 5].map((p) => (
                                    <div key={p} className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                                            style={{
                                                backgroundColor: getPhaseColor(p),
                                                boxShadow: events[activeIndex]?.phase === p ? `0 0 8px ${getPhaseColor(p)}` : "none",
                                                transform: events[activeIndex]?.phase === p ? "scale(1.4)" : "scale(1)",
                                            }} />
                                        <span className="text-[9px] text-white/20">P{p}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-[2px] bg-white/[0.03] rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full"
                            style={{
                                scaleX: smoothProgress, transformOrigin: "left",
                                background: `linear-gradient(90deg, ${getPhaseColor(1)}, ${getPhaseColor(3)}, ${getPhaseColor(4)})`
                            }} />
                    </div>
                    {events[activeIndex] && (
                        <motion.p key={events[activeIndex].id}
                            initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                            className="mt-1.5 text-[10px] text-white/25 tracking-wider">
                            <span style={{ color: getPhaseColor(events[activeIndex].phase) }}>{events[activeIndex].date}</span>
                            {" — "}{events[activeIndex].title}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* ─── Timeline Content ─── */}
            <div ref={containerRef} className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-16 pb-40">
                {/* Progressive center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 hidden md:block">
                    <div className="w-full h-full" style={{ background: "rgba(255,255,255,0.03)" }} />
                    <motion.div className="absolute top-0 left-0 w-full rounded-full"
                        style={{
                            height: lineHeight,
                            background: "linear-gradient(to bottom, rgba(0,180,255,0.3), rgba(168,85,247,0.3), rgba(255,215,0,0.3))",
                            boxShadow: "0 0 8px rgba(0,180,255,0.15)",
                        }} />
                </div>

                {/* Cards */}
                <div className="space-y-12 md:space-y-16">
                    {events.map((event, i) => (
                        <div key={event.id} data-tl-idx={i}>
                            <TimelineCard event={event} index={i} isActive={activeIndex === i} />
                        </div>
                    ))}
                </div>

                {/* End cap */}
                <motion.div className="relative text-center mt-28"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                    viewport={{ once: true }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.04),transparent_50%)]" />
                    <p className="text-[#FFD700]/60 text-[10px] font-bold uppercase tracking-[0.35em] mb-3">The Saga Continues</p>
                    <h2 className="font-heading text-5xl md:text-6xl text-white/90 tracking-wider mb-3">TO BE CONTINUED...</h2>
                    <p className="text-white/20 text-sm max-w-md mx-auto">New stories. New heroes. New realities.</p>
                </motion.div>
            </div>
        </div>
    );
}
