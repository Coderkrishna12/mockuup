"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, Variants } from "framer-motion";
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
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }
        }
    };

    const fadeUpVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
    };

    const titleVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } }
    };

    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            audioRef.current.volume = 1;
            if (!isMuted) {
                audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
            }
        }
    };

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
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-80"
                    src="/characters/marvel-intro.mp4"
                />

                {/* Separate Audio Track */}
                <audio
                    ref={audioRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    src="/characters/marvel-audio.mpeg"
                />

                {/* Deep background gradient overlays to blend video edges */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#030303] pointer-events-none" />

                {/* Massive soft red radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[1000px] max-h-[1000px] bg-marvel-red/20 rounded-full blur-[100px] mix-blend-screen opacity-60 pointer-events-none" />

                {/* Cinematic vignette edges */}
                <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)] pointer-events-none" />
            </motion.div>

            {/* 2. TOP META BAR */}
            <motion.div
                variants={fadeUpVariants}
                className="absolute top-24 md:top-32 left-0 w-full px-6 md:px-16 z-20 flex flex-col md:flex-row justify-between items-center gap-4 text-[#8a8a8a] text-xs font-medium tracking-[0.2em] pointer-events-none"
            >
                <div className="flex gap-4">
                    <span className="px-4 py-1.5 rounded-full border border-[#ED1D24]/50 bg-[#ED1D24]/10 text-[#ED1D24] backdrop-blur-sm shadow-[0_0_10px_rgba(237,29,36,0.2)]">THE INFINITY SAGA</span>
                    <span className="px-4 py-1.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm hidden md:inline-block">THE MULTIVERSE SAGA</span>
                </div>

                <div className="flex gap-8 uppercase">
                    <span>Avengers</span>
                    <span className="hidden md:inline">Guardians</span>
                    <span className="hidden lg:inline">X-Men</span>
                    <span className="hidden lg:inline">Thunderbolts</span>
                </div>
            </motion.div>

            {/* 3. CENTER TYPOGRAPHY & DESCRIPTION */}
            <motion.div
                className="relative z-10 flex flex-col items-center justify-center w-full px-6 text-center max-w-4xl pt-20"
                style={{ y: titleY }}
                variants={titleVariants}
            >
                {/* Massive MARVEL STUDIOS Typography block */}
                <h1 className="font-heading text-[12vw] sm:text-[10vw] md:text-[12vw] leading-[0.85] tracking-tighter text-white uppercase select-none drop-shadow-2xl flex flex-col items-center mb-6">
                    <span className="text-[5vw] sm:text-[4vw] md:text-[6vw] mb-[0vw] tracking-normal text-[#ED1D24] block w-full text-center drop-shadow-[0_0_20px_rgba(237,29,36,0.6)]">MARVEL</span>
                    <span className="block w-full text-center tracking-tighter mix-blend-plus-lighter text-white/90">STUDIOS</span>
                </h1>

                {/* Description */}
                <motion.p
                    variants={fadeUpVariants}
                    className="text-white/80 text-sm md:text-lg tracking-wide leading-relaxed max-w-2xl mx-auto drop-shadow-md"
                >
                    Experience the epic storytelling of the Marvel Cinematic Universe.
                </motion.p>
            </motion.div>

            {/* 4. MUTE / UNMUTE AUDIO TOGGLE */}
            <motion.button
                variants={fadeUpVariants}
                onClick={toggleMute}
                className="absolute bottom-24 md:bottom-32 right-6 md:right-16 z-30 flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="relative w-5 h-5 flex items-center justify-center">
                    {/* Speaker Icon */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        {!isMuted && (
                            <>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </>
                        )}
                        {isMuted && (
                            <>
                                <line x1="23" y1="1" x2="1" y2="23" className="stroke-marvel-red/80 stroke-[3px]" />
                            </>
                        )}
                    </svg>
                </div>
                <span className="text-xs font-heading tracking-[0.2em]">
                    {isMuted ? "UNMUTE" : "MUTE"} SOUND
                </span>
            </motion.button>

            {/* Bottom Gradient Fade to merge with next section */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none z-30" />
        </motion.section>
    );
}
