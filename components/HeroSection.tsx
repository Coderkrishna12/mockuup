"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";
import Image from "next/image";

export default function HeroSection() {
    const reducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Scroll Parallax ---
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const containerScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

    // Depth: Title moves slower than character
    const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const characterY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const railY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

    // --- Mouse Parallax (3D Tilt) ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);
    const bgX = useTransform(springX, [-0.5, 0.5], ["-1%", "1%"]);
    const bgY = useTransform(springY, [-0.5, 0.5], ["-1%", "1%"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (reducedMotion || window.innerWidth < 768) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const titleVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
    };

    // Spider badge data
    const badges = Array(12).fill(0);

    return (
        <motion.section
            ref={containerRef}
            className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030303]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ scale: containerScale, opacity: bgOpacity }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* 1. LAYERED CINEMATIC BACKGROUND */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{ x: bgX, y: bgY }}
            >
                {/* Deep background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0202] to-[#030303]" />

                {/* Massive soft red radial glow behind title */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] bg-red-600/20 rounded-full blur-[120px] mix-blend-screen mix-blend-lighten opacity-80" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-red-500/30 rounded-full blur-[80px] mix-blend-screen opacity-60" />

                {/* Film grain overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}
                />

                {/* Cinematic vignette edges */}
                <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]" />
            </motion.div>

            {/* 2. TOP META BAR */}
            <motion.div
                variants={fadeUpVariants}
                className="absolute top-24 md:top-32 left-0 w-full px-6 md:px-16 z-20 flex flex-col md:flex-row justify-between items-center gap-4 text-[#8a8a8a] text-xs font-medium tracking-[0.2em] pointer-events-none"
            >
                <div className="flex gap-4">
                    <span className="px-4 py-1.5 rounded-full border border-[#ED1D24]/50 bg-[#ED1D24]/10 text-[#ED1D24] backdrop-blur-sm shadow-[0_0_10px_rgba(237,29,36,0.2)]">BRAND NEW</span>
                    <span className="px-4 py-1.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm hidden md:inline-block">ACTION</span>
                    <span className="px-4 py-1.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm">SCI-FI</span>
                </div>

                <div className="flex gap-8 uppercase">
                    <span>Tom Holland</span>
                    <span className="hidden md:inline">Tobey Maguire</span>
                    <span className="hidden lg:inline">Andrew Garfield</span>
                    <span className="hidden lg:inline">Zendaya</span>
                </div>
            </motion.div>

            {/* 3. CENTER TYPOGRAPHY */}
            <motion.div
                className="relative z-10 flex items-center justify-center w-full pointer-events-none pb-[15vh] md:pb-[10vh]"
                style={{ y: titleY }}
                variants={titleVariants}
            >
                {/* Massive MARVEL SPIDER-MAN Typography block */}
                <h1 className="font-heading text-[13vw] md:text-[16vw] leading-[0.8] tracking-tighter text-white opacity-95 uppercase select-none drop-shadow-2xl flex flex-col items-center">
                    <span className="text-[6vw] md:text-[8vw] mb-[-1.5vw] tracking-normal text-[#ED1D24] block w-full text-center drop-shadow-[0_0_20px_rgba(237,29,36,0.6)]">MARVEL</span>
                    <span className="block w-full text-center tracking-tighter">SPIDER-MAN</span>
                </h1>

                {/* Very soft blur depth duplicate behind */}
                <h1 className="absolute font-heading text-[13vw] md:text-[16vw] leading-[0.8] tracking-tighter text-white opacity-40 blur-[10px] uppercase select-none -z-10 flex flex-col items-center">
                    <span className="text-[6vw] md:text-[8vw] mb-[-1.5vw] tracking-normal text-[#ED1D24] block w-full text-center">MARVEL</span>
                    <span className="block w-full text-center tracking-tighter">SPIDER-MAN</span>
                </h1>
            </motion.div>

            {/* 4. CHARACTER PLACEMENT */}
            <motion.div
                className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none"
                style={{
                    y: characterY,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1200
                }}
            >
                <motion.div
                    variants={fadeUpVariants}
                    className="relative w-[120%] h-[85%] md:w-[90%] md:h-[90%] max-w-[1400px]"
                    animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.005, 1]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Image
                        src="/characters/masks/spider-man.png"
                        alt="Spider-Man"
                        fill
                        className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] filter contrast-100 saturate-100 brightness-110"
                        priority
                    />
                </motion.div>
            </motion.div>

            {/* 5. SPIDER BADGE RAIL */}
            <motion.div
                className="absolute bottom-12 md:bottom-20 w-[200vw] left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                style={{ y: railY }}
                variants={fadeUpVariants}
            >
                <motion.div
                    className="flex items-center justify-center gap-6 md:gap-12 w-full"
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    {badges.map((_, i) => (
                        <div
                            key={`badge-${i}`}
                            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#ED1D24] shadow-[0_0_20px_rgba(237,29,36,0.3)] flex items-center justify-center border-2 border-black/50 overflow-hidden shrink-0 pointer-events-auto cursor-none transition-transform duration-300 hover:scale-110"
                        >
                            {/* Premium Spider Icon */}
                            <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="50" cy="65" rx="14" ry="20" />
                                <circle cx="50" cy="38" r="10" />
                                <path fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M38 35 L20 20 L10 30 M40 45 L15 45 M38 55 L15 75 L10 90 M42 75 L25 95" />
                                <path fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M62 35 L80 20 L90 30 M60 45 L85 45 M62 55 L85 75 L90 90 M58 75 L75 95" />
                            </svg>
                        </div>
                    ))}
                    {/* Duplicate set for seamless marquee */}
                    {badges.map((_, i) => (
                        <div
                            key={`badge-dub-${i}`}
                            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#ED1D24] shadow-[0_0_20px_rgba(237,29,36,0.3)] flex items-center justify-center border-2 border-black/50 overflow-hidden shrink-0 pointer-events-auto cursor-none transition-transform duration-300 hover:scale-110"
                        >
                            <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="50" cy="65" rx="14" ry="20" />
                                <circle cx="50" cy="38" r="10" />
                                <path fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M38 35 L20 20 L10 30 M40 45 L15 45 M38 55 L15 75 L10 90 M42 75 L25 95" />
                                <path fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M62 35 L80 20 L90 30 M60 45 L85 45 M62 55 L85 75 L90 90 M58 75 L75 95" />
                            </svg>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Bottom Gradient Fade to merge with next section */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-30" />
        </motion.section>
    );
}
