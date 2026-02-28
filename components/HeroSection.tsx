"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronDown, Play, Compass } from "lucide-react";
import { useWebGLSupport, useReducedMotion } from "@/lib/hooks";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import gsap from "gsap";

const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.2)_0%,rgba(0,0,0,1)_70%)]" />
    ),
});

export default function HeroSection() {
    const webglSupported = useWebGLSupport();
    const reducedMotion = useReducedMotion();
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (reducedMotion) return;

        const ctx = gsap.context(() => {
            // Logo reveal animation
            gsap.from(".hero-logo", {
                opacity: 0,
                scale: 0.5,
                duration: 1.5,
                ease: "power4.out",
                delay: 2.8, // after loading screen
            });

            // Title character-by-character reveal
            if (titleRef.current) {
                gsap.from(titleRef.current, {
                    opacity: 0,
                    y: 40,
                    duration: 1,
                    delay: 3.2,
                    ease: "power3.out",
                });
            }

            if (subtitleRef.current) {
                gsap.from(subtitleRef.current, {
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    delay: 3.6,
                    ease: "power3.out",
                });
            }

            gsap.from(".hero-cta", {
                opacity: 0,
                y: 20,
                duration: 0.8,
                delay: 4.0,
                stagger: 0.15,
                ease: "power3.out",
            });

            gsap.from(".hero-scroll-indicator", {
                opacity: 0,
                duration: 0.8,
                delay: 4.5,
                ease: "power3.out",
            });
        });

        return () => ctx.revert();
    }, [reducedMotion]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Three.js Background or Fallback */}
            {webglSupported ? (
                <ThreeBackground />
            ) : (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.2)_0%,rgba(0,0,0,1)_70%)]" />
            )}

            {/* Cinematic overlays */}
            <div className="absolute inset-0 cinematic-overlay z-[1]" />
            <div className="absolute inset-0 cinematic-vignette z-[1]" />

            {/* Film grain effect */}
            <div
                className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                {/* Marvel Logo */}
                <motion.div
                    className="hero-logo inline-block mb-8"
                    variants={fadeInUp}
                >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-marvel-red rounded-lg flex items-center justify-center mx-auto glow-red-intense">
                        <span className="font-heading text-4xl md:text-5xl text-white">M</span>
                    </div>
                </motion.div>

                {/* Title */}
                <h1
                    ref={titleRef}
                    className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider text-white mb-4 gpu-accelerated"
                >
                    MARVEL
                    <span className="block text-marvel-red text-glow-red">UNIVERSE</span>
                </h1>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    className="text-lg md:text-xl text-white/50 max-w-xl mx-auto mb-10 font-light leading-relaxed"
                >
                    Explore the cinematic universe. Discover timelines, characters,
                    and story arcs in an immersive digital experience.
                </p>

                {/* CTAs */}
                <motion.div
                    variants={staggerContainer}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.div variants={staggerItem}>
                        <Link
                            href="/timeline"
                            className="hero-cta inline-flex items-center gap-2 px-8 py-3 bg-marvel-red text-white font-medium rounded-lg hover:glow-red-intense transition-all duration-300 hover:scale-105 gpu-accelerated"
                        >
                            <Play size={18} />
                            Explore Timeline
                        </Link>
                    </motion.div>
                    <motion.div variants={staggerItem}>
                        <Link
                            href="/multiverse"
                            className="hero-cta inline-flex items-center gap-2 px-8 py-3 border border-white/20 text-white font-medium rounded-lg hover:border-marvel-red/50 hover:bg-white/5 transition-all duration-300 hover:scale-105 gpu-accelerated"
                        >
                            <Compass size={18} />
                            Enter Multiverse
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll-indicator absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
                <span className="text-xs text-white/30 tracking-widest uppercase">Scroll to explore</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown size={20} className="text-white/30" />
                </motion.div>
            </div>
        </section>
    );
}
