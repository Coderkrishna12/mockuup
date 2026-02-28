"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
} from "framer-motion";
import { Play, Tv, ChevronDown } from "lucide-react";
import { useReducedMotion, useIsMobile } from "@/lib/hooks";

interface CinematicHero3DProps {
    characterImg: string;
    tagline?: string;
    titlePrefix: string;
    titleMain: string;
    titleGradient?: string;
    subtitle: string;
    primaryCTAText: string;
    primaryCTALink: string;
    secondaryCTAText: string;
    secondaryCTALink: string;
    stats: Array<{ val: string; label: string }>;
    anchorId: string;
    accentColor?: string; // Hex or tailwind class part
    showArcReactor?: boolean;
}

export default function CinematicHero3D({
    characterImg,
    tagline = "Marvel Studios Presents",
    titlePrefix,
    titleMain,
    titleGradient = "linear-gradient(135deg, #ED1D24 0%, #ff4d52 40%, #FFD700 100%)",
    subtitle,
    primaryCTAText,
    primaryCTALink,
    secondaryCTAText,
    secondaryCTALink,
    stats,
    anchorId,
    accentColor = "#ED1D24",
    showArcReactor = false,
}: CinematicHero3DProps) {
    const reducedMotion = useReducedMotion();
    const isMobile = useIsMobile();
    const sectionRef = useRef<HTMLElement>(null);
    const characterRef = useRef<HTMLDivElement>(null);

    /* ─── Mouse tracking for parallax ─── */
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (isMobile || reducedMotion) return;
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            mouseX.set(x);
            mouseY.set(y);
        },
        [isMobile, reducedMotion, mouseX, mouseY]
    );

    /* Character parallax transforms */
    const charRotateY = useTransform(smoothMouseX, [-1, 1], [-6, 6]);
    const charRotateX = useTransform(smoothMouseY, [-1, 1], [4, -4]);
    const charTranslateX = useTransform(smoothMouseX, [-1, 1], [-15, 15]);

    /* Light source shift */
    const lightX = useTransform(smoothMouseX, [-1, 1], [35, 65]);
    const lightY = useTransform(smoothMouseY, [-1, 1], [25, 55]);

    /* ─── Scroll-driven transforms ─── */
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });
    const smoothScroll = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

    const heroScale = useTransform(smoothScroll, [0, 0.5], [1, 0.92]);
    const heroOpacity = useTransform(smoothScroll, [0, 0.4], [1, 0]);
    const contentY = useTransform(smoothScroll, [0, 0.4], [0, -50]);
    const bgParallax = useTransform(smoothScroll, [0, 1], [0, 100]);

    /* ─── Entrance animation state ─── */
    const [entered, setEntered] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => setEntered(true), 200);
        return () => clearTimeout(timer);
    }, []);

    /* ─── Particles (client-side only to avoid hydration mismatch) ─── */
    const [particles] = useState(() => {
        const count = 18;
        return Array.from({ length: count }, (_, i) => ({
            left: `${10 + ((i * 37 + 13) % 80)}%`,
            top: `${10 + ((i * 53 + 7) % 80)}%`,
            size: 1.5 + ((i * 17) % 25) / 10,
            isAccent: i % 3 === 0,
            opacity: 0.2 + ((i * 13) % 30) / 100,
            duration: `${20 + ((i * 11) % 20)}s`,
            delay: `${((i * 7) % 10)}s`,
            drift: `${-20 + ((i * 23) % 40)}px`,
        }));
    });

    /* ─── Light position for CSS ─── */
    const [lightPos, setLightPos] = useState({ x: 50, y: 40 });
    useEffect(() => {
        const unsubX = lightX.on("change", (x) =>
            setLightPos((p) => ({ ...p, x: x as number }))
        );
        const unsubY = lightY.on("change", (y) =>
            setLightPos((p) => ({ ...p, y: y as number }))
        );
        return () => { unsubX(); unsubY(); };
    }, [lightX, lightY]);

    return (
        <motion.section
            ref={sectionRef}
            className="relative min-h-screen flex items-center overflow-hidden"
            style={{ scale: heroScale }}
            onMouseMove={handleMouseMove}
        >
            {/* ═══ BACKGROUND LAYERS ═══ */}

            {/* Base gradient */}
            <motion.div
                className="absolute inset-0"
                style={{
                    y: bgParallax,
                    background: `
                        radial-gradient(ellipse at ${lightPos.x}% ${lightPos.y}%, ${accentColor}14 0%, transparent 50%),
                        radial-gradient(ellipse at 30% 80%, ${accentColor}0F 0%, transparent 45%),
                        radial-gradient(ellipse at 80% 20%, rgba(30,30,60,0.08) 0%, transparent 50%),
                        linear-gradient(180deg, #050505 0%, #080808 40%, #0b0b0b 70%, #050505 100%)
                    `,
                }}
            />

            {/* Slow-moving fog layers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 opacity-[0.03]"
                    style={{
                        background: `radial-gradient(ellipse, ${accentColor}4D, transparent 70%)`,
                        animation: reducedMotion ? "none" : "hero-fog-drift 30s ease-in-out infinite",
                    }}
                />
                <div
                    className="absolute w-[180%] h-[180%] -top-1/3 -right-1/3 opacity-[0.025]"
                    style={{
                        background: "radial-gradient(ellipse, rgba(100,100,200,0.2), transparent 60%)",
                        animation: reducedMotion ? "none" : "hero-fog-drift 40s ease-in-out infinite reverse",
                    }}
                />
            </div>

            {/* Faint particle field (client-only) */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {mounted && !reducedMotion &&
                    particles.slice(0, isMobile ? 8 : 18).map((p, i) => (
                        <span
                            key={i}
                            className="absolute rounded-full timeline-particle"
                            style={{
                                left: p.left,
                                top: p.top,
                                width: p.size,
                                height: p.size,
                                background: p.isAccent
                                    ? `${accentColor}4D`
                                    : "rgba(255,255,255,0.15)",
                                opacity: p.opacity,
                                animationDuration: p.duration,
                                animationDelay: p.delay,
                                ["--drift" as string]: p.drift,
                            }}
                        />
                    ))}
            </div>

            {/* Film grain overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: "inset 0 0 200px 60px rgba(0,0,0,0.7)" }}
            />

            {/* ═══ MAIN CONTENT ═══ */}
            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12"
                style={{ opacity: heroOpacity, y: contentY }}
            >
                <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16 min-h-[80vh] py-24">
                    {/* ─── LEFT: Text Content ─── */}
                    <div className="flex-1 text-center md:text-left">
                        {/* Tagline */}
                        <motion.p
                            className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4"
                            style={{ color: `${accentColor}B3` }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={entered ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            {tagline}
                        </motion.p>

                        {/* Heading */}
                        <motion.h1
                            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-white leading-[0.95] mb-5"
                            initial={{ opacity: 0, y: 40 }}
                            animate={entered ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            {titlePrefix}
                            <span className="block mt-1" style={{
                                background: titleGradient,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                filter: `drop-shadow(0 0 30px ${accentColor}4D)`,
                            }}>
                                {titleMain}
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className="text-sm md:text-base text-white/40 max-w-md mx-auto md:mx-0 mb-8 leading-relaxed font-light"
                            initial={{ opacity: 0, y: 20 }}
                            animate={entered ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            {subtitle}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={entered ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            <Link
                                href={primaryCTALink}
                                className="group relative inline-flex items-center gap-2 px-7 py-3 text-white font-medium text-sm rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.03]"
                                style={{
                                    background: `linear-gradient(to right, ${accentColor}, ${accentColor}CC)`,
                                    boxShadow: `0 0 30px ${accentColor}66`,
                                }}
                            >
                                {/* Light sweep on hover */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <Play size={16} className="relative z-10" />
                                <span className="relative z-10">{primaryCTAText}</span>
                            </Link>
                            <Link
                                href={secondaryCTALink}
                                className="inline-flex items-center gap-2 px-7 py-3 border border-white/10 text-white/70 hover:text-white font-medium text-sm rounded-lg hover:border-white/25 hover:bg-white/[0.03] transition-all duration-300 hover:scale-[1.03]"
                            >
                                <Tv size={16} />
                                {secondaryCTAText}
                            </Link>
                        </motion.div>

                        {/* Stats row */}
                        <motion.div
                            className="flex items-center gap-6 mt-10 justify-center md:justify-start"
                            initial={{ opacity: 0 }}
                            animate={entered ? { opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.9 }}
                        >
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center md:text-left">
                                    <p className="font-heading text-xl md:text-2xl text-white">{stat.val}</p>
                                    <p className="text-[10px] text-white/25 uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ─── RIGHT: 3D Character ─── */}
                    <motion.div
                        ref={characterRef}
                        className="flex-shrink-0 relative w-[280px] h-[380px] sm:w-[320px] sm:h-[440px] md:w-[400px] md:h-[550px] lg:w-[460px] lg:h-[620px]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={entered ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1.0, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{ perspective: 1200 }}
                    >
                        {/* Radial light bloom behind character */}
                        <motion.div
                            className="absolute -inset-20 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={entered ? { opacity: 1 } : {}}
                            transition={{ duration: 1.5, delay: 0.6 }}
                            style={{
                                background: `
                                    radial-gradient(ellipse at 50% 45%, ${accentColor}1F 0%, transparent 55%),
                                    radial-gradient(ellipse at 50% 50%, rgba(255,180,50,0.06) 0%, transparent 45%)
                                `,
                            }}
                        />

                        {/* Arc reactor glow (Conditional) */}
                        {showArcReactor && (
                            <motion.div
                                className="absolute top-[28%] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full pointer-events-none z-20"
                                initial={{ opacity: 0 }}
                                animate={entered ? { opacity: 1 } : {}}
                                transition={{ duration: 0.8, delay: 1.0 }}
                                style={{
                                    background: "radial-gradient(circle, rgba(100,180,255,0.6) 0%, rgba(100,180,255,0.15) 40%, transparent 65%)",
                                    boxShadow: "0 0 30px rgba(100,180,255,0.3), 0 0 60px rgba(100,180,255,0.15)",
                                    animation: reducedMotion ? "none" : "arc-reactor-pulse 3s ease-in-out infinite",
                                }}
                            />
                        )}

                        {/* Character image with 3D mouse parallax */}
                        <motion.div
                            className="relative w-full h-full gpu-accelerated"
                            style={{
                                rotateY: isMobile ? 0 : charRotateY,
                                rotateX: isMobile ? 0 : charRotateX,
                                x: isMobile ? 0 : charTranslateX,
                            }}
                        >
                            {/* Idle float wrapper (CSS animation, no Framer conflict) */}
                            <div
                                className="w-full h-full"
                                style={{
                                    animation: reducedMotion ? "none" : "hero-char-idle 6s ease-in-out infinite",
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={characterImg}
                                    alt="Hero Character"
                                    className="w-full h-full object-cover object-top rounded-2xl"
                                    style={{
                                        filter: "contrast(1.08) brightness(0.95) saturate(1.1)",
                                        maskImage: "linear-gradient(to bottom, black 70%, transparent 98%)",
                                        WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 98%)",
                                    }}
                                    loading="eager"
                                    onError={(e) => {
                                        e.currentTarget.src = "/marvel-logo.svg";
                                        e.currentTarget.className = "w-32 h-32 mx-auto mt-40 opacity-20";
                                    }}
                                />
                            </div>

                            {/* Depth edge glow */}
                            <div
                                className="absolute inset-0 rounded-2xl pointer-events-none"
                                style={{
                                    boxShadow: `
                                        inset 0 0 80px rgba(0,0,0,0.5),
                                        0 20px 60px rgba(0,0,0,0.5),
                                        0 0 40px ${accentColor}14
                                    `,
                                }}
                            />
                        </motion.div>

                        {/* Subtle reflection floor */}
                        <div
                            className="absolute -bottom-4 left-[10%] right-[10%] h-16 pointer-events-none"
                            style={{
                                background: `radial-gradient(ellipse at 50% 0%, ${accentColor}14 0%, transparent 70%)`,
                                filter: "blur(8px)",
                            }}
                        />

                        {/* Ambient glow under character */}
                        <div
                            className="absolute -bottom-8 left-[5%] right-[5%] h-2 pointer-events-none rounded-full"
                            style={{
                                background: `radial-gradient(ellipse, ${accentColor}26, transparent 70%)`,
                                filter: "blur(12px)",
                            }}
                        />
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={entered ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.1 }}
            >
                <span className="text-[10px] text-white/20 tracking-[0.2em] uppercase">Scroll to explore</span>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown size={16} className="text-white/20" />
                </motion.div>
            </motion.div>

            {/* Smooth gradient transition to grid section */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
                style={{
                    background: "linear-gradient(to bottom, transparent, #000000)",
                }}
            />
        </motion.section>
    );
}
