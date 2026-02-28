"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
    useAnimationFrame,
} from "framer-motion";
import { ChevronRight, GitBranch, RotateCcw, GripHorizontal } from "lucide-react";

import type { TimelineEvent } from "@/data/timeline";
import { getPhaseColor } from "@/lib/utils";
import { useIsMobile } from "@/lib/hooks";

/* ─── Movie poster map ─── */
const movieCharacterImages: Record<string, { character: string; backdrop: string }> = {
    "iron-man": { character: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/78lPtwv72eTNqFW9COBYI0dWDJa.jpg" },
    "the-incredible-hulk": { character: "https://image.tmdb.org/t/p/w500/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg" },
    "iron-man-2": { character: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/78lPtwv72eTNqFW9COBYI0dWDJa.jpg" },
    "thor": { character: "https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg" },
    "captain-america-the-first-avenger": { character: "https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg" },
    "the-avengers": { character: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg" },
    "iron-man-3": { character: "https://image.tmdb.org/t/p/w500/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg" },
    "thor-the-dark-world": { character: "https://image.tmdb.org/t/p/w500/wp6OxE4poJ4G7c0U2ZIXasTSMR7.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/wp6OxE4poJ4G7c0U2ZIXasTSMR7.jpg" },
    "captain-america-the-winter-soldier": { character: "https://image.tmdb.org/t/p/w500/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg" },
    "guardians-of-the-galaxy": { character: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg" },
    "avengers-age-of-ultron": { character: "https://image.tmdb.org/t/p/w500/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg" },
    "ant-man": { character: "https://image.tmdb.org/t/p/w500/rQRnQfUl3kfp78nCWq8Ks04vnq1.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/rQRnQfUl3kfp78nCWq8Ks04vnq1.jpg" },
    "captain-america-civil-war": { character: "https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg" },
    "doctor-strange": { character: "https://image.tmdb.org/t/p/w500/xf8PbyQcR5ucXErmZNzdKR0s8ya.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/xf8PbyQcR5ucXErmZNzdKR0s8ya.jpg" },
    "spider-man-homecoming": { character: "https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg" },
    "thor-ragnarok": { character: "https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg" },
    "black-panther": { character: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/uxzzxijgPIY7slzFvMotPv8wjKA.jpg" },
    "avengers-infinity-war": { character: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg" },
    "avengers-endgame": { character: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg" },
    "black-widow": { character: "https://image.tmdb.org/t/p/w500/7JPpIjhD2V0sKyFvhB9khUMa30d.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/7JPpIjhD2V0sKyFvhB9khUMa30d.jpg" },
    "doctor-strange-multiverse-of-madness": { character: "https://image.tmdb.org/t/p/w500/ddJcSKbcp4rKZTmuyWaMhuwcfMz.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/ddJcSKbcp4rKZTmuyWaMhuwcfMz.jpg" },
    "spider-man-no-way-home": { character: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg" },
    "ant-man-quantumania": { character: "https://image.tmdb.org/t/p/w500/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg" },
    "guardians-of-the-galaxy-vol-3": { character: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg" },
    "deadpool-wolverine": { character: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg" },
};

interface TimelineCard3DProps {
    event: TimelineEvent;
    index: number;
    isActive: boolean;
}

/* ─── Content stagger animations ─── */
const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { type: "spring" as const, stiffness: 260, damping: 24 },
    },
};

export default function TimelineCard3D({ event, index, isActive }: TimelineCard3DProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    const color = getPhaseColor(event.phase);
    const media = movieCharacterImages[event.movieId];
    const isAlternate = !event.isMainTimeline;
    const isEven = index % 2 === 0;

    /* ─── 3D rotation state (drag-based) ─── */
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 20, mass: 0.8 });
    const springRotateY = useSpring(rotateY, { stiffness: 120, damping: 20, mass: 0.8 });

    const [isDragging, setIsDragging] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const dragStart = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });

    /* Momentum / inertia on release */
    const velocity = useRef({ x: 0, y: 0 });
    const lastMouse = useRef({ x: 0, y: 0, time: 0 });

    /* ─── Scroll-driven transforms ─── */
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const scale = useTransform(smoothProgress, [0, 0.3, 0.5, 0.7, 1], [0.88, 0.96, 1, 0.96, 0.88]);
    const opacity = useTransform(smoothProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 0.6, 1, 1, 0.6, 0]);
    const scrollRotateZ = useTransform(smoothProgress, [0, 0.5, 1], [isEven ? -1.5 : 1.5, 0, isEven ? 1.5 : -1.5]);
    const translateY = useTransform(smoothProgress, [0, 0.5, 1], [60, 0, -60]);
    const translateX = useTransform(smoothProgress, [0, 0.5, 1], [isEven ? -20 : 20, 0, isEven ? 20 : -20]);

    /* ─── Drag handlers for 3D rotation ─── */
    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            // Don't intercept clicks on links/buttons
            const target = e.target as HTMLElement;
            if (target.closest("a") || target.closest("button")) return;

            setIsDragging(true);
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                rotX: rotateX.get(),
                rotY: rotateY.get(),
            };
            lastMouse.current = { x: e.clientX, y: e.clientY, time: Date.now() };
            velocity.current = { x: 0, y: 0 };
        },
        [rotateX, rotateY]
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;

            // Sensitivity: how many degrees per pixel of drag
            const sensitivity = 0.4;
            rotateY.set(dragStart.current.rotY + dx * sensitivity);
            rotateX.set(dragStart.current.rotX - dy * sensitivity);

            // Track velocity for momentum
            const now = Date.now();
            const dt = Math.max(now - lastMouse.current.time, 1);
            velocity.current = {
                x: ((e.clientX - lastMouse.current.x) / dt) * 16,
                y: ((e.clientY - lastMouse.current.y) / dt) * 16,
            };
            lastMouse.current = { x: e.clientX, y: e.clientY, time: now };
        },
        [isDragging, rotateX, rotateY]
    );

    const handlePointerUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);

        // Apply momentum then spring back to 0
        const vx = velocity.current.x;
        const vy = velocity.current.y;

        // Briefly overshoot with momentum, then snap back
        const currentRotY = rotateY.get();
        const currentRotX = rotateX.get();

        // Check if card should flip (more than 90° rotation)
        const normalizedY = ((currentRotY % 360) + 360) % 360;
        const shouldFlip = normalizedY > 90 && normalizedY < 270;

        if (shouldFlip !== isFlipped) {
            setIsFlipped(shouldFlip);
        }

        // Apply momentum overshoot
        rotateY.set(currentRotY + vx * 3);
        rotateX.set(currentRotX - vy * 3);

        // Then spring back to nearest resting position
        const targetY = shouldFlip ? 180 : 0;
        const targetX = 0;

        // Use requestAnimationFrame for smooth spring-back
        setTimeout(() => {
            rotateY.set(targetY);
            rotateX.set(targetX);
        }, 150);
    }, [isDragging, rotateX, rotateY, isFlipped]);

    /* Reset to front */
    const resetRotation = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            rotateX.set(0);
            rotateY.set(0);
            setIsFlipped(false);
        },
        [rotateX, rotateY]
    );

    /* ─── Idle gentle float (when not dragging) ─── */
    const idleTime = useRef(0);
    useAnimationFrame((_, delta) => {
        if (isDragging || isMobile) return;
        const currentRotY = rotateY.get();
        const currentRotX = rotateX.get();
        // Only apply idle animation when card is near resting position
        if (Math.abs(currentRotY % 360) < 2 && Math.abs(currentRotX) < 2 && !isFlipped) {
            idleTime.current += delta / 1000;
            const gentleX = Math.sin(idleTime.current * 0.5 + index * 1.5) * 1.5;
            const gentleY = Math.cos(idleTime.current * 0.3 + index * 1.2) * 2;
            rotateX.set(gentleX);
            rotateY.set(gentleY);
        }
    });

    /* ─── Depth offset for alternating cards ─── */
    const sideOffset = isMobile ? 0 : isEven ? -50 : 50;

    /* Is backface visible? */
    const backfaceVisible = useTransform(springRotateY, (v: number) => {
        const norm = ((v % 360) + 360) % 360;
        return norm > 90 && norm < 270;
    });

    const [showBack, setShowBack] = useState(false);
    useEffect(() => {
        return backfaceVisible.on("change", (v: boolean) => setShowBack(v));
    }, [backfaceVisible]);

    return (
        <motion.div
            ref={cardRef}
            className="relative w-full flex justify-center"
            style={{
                paddingTop: index === 0 ? 0 : 20,
                paddingBottom: 20,
                marginLeft: sideOffset,
                scale,
                opacity,
                rotateZ: scrollRotateZ,
                y: translateY,
                x: translateX,
            }}
        >
            {/* 3D scene container */}
            <div
                className="relative w-full max-w-[700px]"
                style={{ perspective: 1200 }}
            >
                {/* Rotating card wrapper */}
                <motion.div
                    className={`relative w-full gpu-accelerated ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                    style={{
                        transformStyle: "preserve-3d" as const,
                        rotateX: springRotateX,
                        rotateY: springRotateY,
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    {/* ═══ FRONT FACE ═══ */}
                    <div
                        className="timeline-card-glass relative w-full rounded-2xl overflow-hidden"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        {/* Active glow border */}
                        <div
                            className="absolute inset-0 rounded-2xl pointer-events-none z-[1] transition-opacity duration-700"
                            style={{
                                opacity: isActive ? 0.6 : isDragging ? 0.8 : 0,
                                boxShadow: `inset 0 0 0 1px ${color}50, 0 0 40px ${color}20`,
                            }}
                        />

                        {/* Drag interaction glow */}
                        {isDragging && (
                            <div
                                className="absolute inset-0 rounded-2xl pointer-events-none z-[2]"
                                style={{
                                    boxShadow: `0 0 60px ${color}30, 0 0 120px ${color}10`,
                                }}
                            />
                        )}

                        {/* Backdrop image */}
                        {media?.backdrop && (
                            <div className="absolute inset-0 z-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={media.backdrop}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover opacity-[0.12]"
                                    loading="lazy"
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,8,16,0.95)] via-[rgba(8,8,16,0.85)] to-[rgba(8,8,16,0.7)]" />
                            </div>
                        )}

                        {/* Card content */}
                        <div className="relative z-10 flex flex-col md:flex-row gap-5 p-6 md:p-8">
                            {/* Text side */}
                            <motion.div
                                className="flex-1 min-w-0"
                                variants={contentVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-80px" }}
                            >
                                <motion.div variants={itemVariants} className="flex items-center gap-2.5 mb-3 flex-wrap">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }} />
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color }}>
                                        Phase {event.phase}
                                    </span>
                                    <span className="text-[11px] text-white/30">•</span>
                                    <span className="text-[11px] text-white/40 font-medium">{event.date}</span>
                                    {isAlternate && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 text-white/40" style={{ borderColor: `${color}30` }}>
                                            <GitBranch size={9} />
                                            {event.universe}
                                        </span>
                                    )}
                                </motion.div>

                                <motion.h3 variants={itemVariants} className="font-heading text-2xl md:text-3xl lg:text-4xl text-white tracking-wider leading-tight mb-3">
                                    {event.title}
                                </motion.h3>

                                <motion.p variants={itemVariants} className="text-sm text-white/45 leading-relaxed mb-5 max-w-lg">
                                    {event.description}
                                </motion.p>

                                <motion.div variants={itemVariants} className="flex items-center gap-3 flex-wrap">
                                    <span
                                        className="text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-medium"
                                        style={{ backgroundColor: `${color}12`, color, border: `1px solid ${color}25` }}
                                    >
                                        {event.category}
                                    </span>
                                    <Link
                                        href={`/movies/${event.movieId}`}
                                        className="group/link text-xs text-white/40 hover:text-white transition-colors inline-flex items-center gap-1"
                                    >
                                        View Movie
                                        <ChevronRight size={12} className="transition-transform group-hover/link:translate-x-0.5" />
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Character poster */}
                            {media?.character && (
                                <div className="hidden md:block flex-shrink-0 w-[140px] lg:w-[160px]">
                                    <div
                                        className="relative aspect-[2/3] rounded-xl overflow-hidden"
                                        style={{ boxShadow: `0 8px 32px ${color}20, 0 2px 8px rgba(0,0,0,0.4)` }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={media.character}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.src = "/marvel-logo.svg";
                                                e.currentTarget.className = "w-12 h-12 mx-auto mt-24 opacity-20";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Drag hint */}
                        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-white/15 text-[10px] select-none pointer-events-none transition-opacity duration-300"
                            style={{ opacity: isDragging ? 0 : 0.6 }}
                        >
                            <GripHorizontal size={12} />
                            <span>Grab &amp; Rotate</span>
                        </div>

                        {/* Index watermark */}
                        <div className="absolute top-4 right-6 font-heading text-[64px] leading-none select-none pointer-events-none" style={{ opacity: 0.03 }}>
                            {String(index + 1).padStart(2, "0")}
                        </div>
                    </div>

                    {/* ═══ BACK FACE ═══ */}
                    <div
                        className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden timeline-card-glass"
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        {/* Full poster background */}
                        {media?.character && (
                            <div className="absolute inset-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={media.character}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
                            </div>
                        )}

                        {/* Back face content */}
                        <div className="relative z-10 h-full flex flex-col justify-end p-8">
                            {/* Phase badge */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }} />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color }}>
                                    Phase {event.phase} • {event.date}
                                </span>
                            </div>

                            <h3 className="font-heading text-3xl md:text-5xl text-white tracking-wider leading-none mb-3">
                                {event.title}
                            </h3>

                            <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-4">
                                {event.description}
                            </p>

                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/movies/${event.movieId}`}
                                    className="px-4 py-2 text-xs font-medium rounded-lg transition-all hover:scale-105"
                                    style={{ backgroundColor: color, color: "#fff" }}
                                >
                                    Explore Movie →
                                </Link>
                                <span className="text-[10px] text-white/30 uppercase tracking-wider">
                                    {event.universe}
                                </span>
                            </div>
                        </div>

                        {/* Decorative corner glow */}
                        <div
                            className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                            style={{
                                background: `radial-gradient(circle at 100% 0%, ${color}30, transparent 70%)`,
                            }}
                        />
                    </div>

                    {/* ═══ CARD EDGE (3D thickness) ═══ */}
                    {/* Top edge */}
                    <div
                        className="absolute top-0 left-0 w-full rounded-t-2xl pointer-events-none"
                        style={{
                            height: 6,
                            background: `linear-gradient(90deg, ${color}15, rgba(255,255,255,0.04), ${color}15)`,
                            transformOrigin: "top center",
                            transform: "rotateX(90deg) translateZ(0px)",
                        }}
                    />
                    {/* Bottom edge */}
                    <div
                        className="absolute bottom-0 left-0 w-full rounded-b-2xl pointer-events-none"
                        style={{
                            height: 6,
                            background: `linear-gradient(90deg, ${color}10, rgba(0,0,0,0.3), ${color}10)`,
                            transformOrigin: "bottom center",
                            transform: "rotateX(-90deg) translateZ(0px)",
                        }}
                    />
                </motion.div>

                {/* Reset button (shows when rotated) */}
                {(isFlipped || showBack) && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={resetRotation}
                        className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all"
                    >
                        <RotateCcw size={10} />
                        Reset View
                    </motion.button>
                )}
            </div>

            {/* External layered shadows */}
            <div
                className="absolute inset-0 max-w-[700px] mx-auto rounded-2xl pointer-events-none -z-10 transition-all duration-500"
                style={{
                    opacity: isDragging ? 0.9 : isActive ? 0.7 : 0.4,
                    boxShadow: `
                        0 4px 12px rgba(0,0,0,0.3),
                        0 12px 40px rgba(0,0,0,0.2),
                        0 0 ${isDragging ? "80" : "40"}px ${color}${isDragging ? "15" : "08"}
                    `,
                    marginLeft: sideOffset,
                }}
            />
        </motion.div>
    );
}
