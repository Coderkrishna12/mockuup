"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { historyEras } from "@/data/history";
import { useReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function HistoryPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (reducedMotion || !containerRef.current) return;

        const ctx = gsap.context(() => {
            // Hero title animation
            gsap.from(".history-hero-title", {
                opacity: 0,
                y: 60,
                duration: 1.2,
                ease: "power3.out",
            });

            gsap.from(".history-hero-subtitle", {
                opacity: 0,
                y: 40,
                duration: 1,
                delay: 0.3,
                ease: "power3.out",
            });

            // Each era section
            gsap.utils.toArray<HTMLElement>(".history-era").forEach((era) => {
                const img = era.querySelector(".era-image");
                const title = era.querySelector(".era-title");
                const subtitle = era.querySelector(".era-subtitle");
                const period = era.querySelector(".era-period");
                const paragraphs = era.querySelectorAll(".era-paragraph");
                const milestones = era.querySelectorAll(".era-milestone");
                const divider = era.querySelector(".era-divider");

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: era,
                        start: "top 75%",
                        end: "bottom 25%",
                        toggleActions: "play none none reverse",
                    },
                });

                if (img) tl.from(img, { opacity: 0, scale: 1.1, duration: 1.2, ease: "power2.out" }, 0);
                if (period) tl.from(period, { opacity: 0, x: -30, duration: 0.6 }, 0.2);
                if (title) tl.from(title, { opacity: 0, y: 40, duration: 0.8 }, 0.3);
                if (subtitle) tl.from(subtitle, { opacity: 0, y: 20, duration: 0.6 }, 0.5);
                paragraphs.forEach((p, i) => tl.from(p, { opacity: 0, y: 30, duration: 0.6 }, 0.6 + i * 0.15));
                milestones.forEach((m, i) => tl.from(m, { opacity: 0, x: -20, duration: 0.4 }, 0.8 + i * 0.1));
                if (divider) tl.from(divider, { scaleX: 0, duration: 0.8, ease: "power2.out" }, 0.4);
            });

            // Progress bar
            gsap.to(".history-progress", {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.5,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [reducedMotion]);

    return (
        <div ref={containerRef} className="min-h-screen relative">
            {/* Scroll progress bar */}
            <div className="fixed left-0 top-0 bottom-0 w-1 z-40 hidden md:block">
                <div
                    className="history-progress w-full bg-gradient-to-b from-marvel-red via-marvel-gold to-blue-500 origin-top"
                    style={{ transform: "scaleY(0)" }}
                />
            </div>

            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(237,29,36,0.15),transparent_70%)]" />

                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-marvel-red text-sm font-bold uppercase tracking-[0.3em] mb-4"
                    >
                        From Comics to Cinema
                    </motion.p>
                    <h1 className="history-hero-title font-heading text-6xl md:text-8xl lg:text-9xl text-white tracking-wider leading-none mb-6">
                        THE MARVEL
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-marvel-red via-marvel-gold to-blue-400">
                            STORY
                        </span>
                    </h1>
                    <p className="history-hero-subtitle text-white/40 text-lg max-w-xl mx-auto">
                        85+ years of groundbreaking storytelling. From the Golden Age of comics to the biggest entertainment franchise in history.
                    </p>

                    {/* Scroll indicator */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="mt-16"
                    >
                        <div className="w-6 h-10 rounded-full border-2 border-white/20 mx-auto flex justify-center pt-2">
                            <div className="w-1 h-3 rounded-full bg-white/40" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Era Sections */}
            {historyEras.map((era, index) => (
                <section key={era.id} className="history-era relative py-24 md:py-32">
                    {/* Background image */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="era-image absolute inset-0">
                            <Image
                                src={era.imageUrl}
                                alt={era.title}
                                fill
                                className="object-cover opacity-15"
                                onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
                    </div>

                    <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
                        {/* Period badge */}
                        <div className="era-period flex items-center gap-3 mb-4">
                            <div className="w-12 h-px" style={{ backgroundColor: era.color }} />
                            <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: era.color }}>
                                {era.period}
                            </span>
                        </div>

                        {/* Title */}
                        <h2
                            className="era-title font-heading text-5xl md:text-7xl text-white tracking-wider mb-2"
                        >
                            {era.title}
                        </h2>
                        <p className="era-subtitle text-xl text-white/40 mb-10">{era.subtitle}</p>

                        {/* Divider */}
                        <div
                            className="era-divider h-px w-full mb-10 origin-left"
                            style={{ backgroundColor: `${era.color}33` }}
                        />

                        {/* Content */}
                        <div className="grid md:grid-cols-[1fr,280px] gap-12">
                            <div className="space-y-6">
                                {era.paragraphs.map((p, i) => (
                                    <p key={i} className="era-paragraph text-white/60 leading-relaxed text-base">
                                        {p}
                                    </p>
                                ))}
                            </div>

                            {/* Milestones */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-white/30 mb-4">
                                    Key Milestones
                                </h3>
                                {era.milestones.map((m, i) => (
                                    <div key={i} className="era-milestone flex gap-3 items-start">
                                        <span
                                            className="text-sm font-bold font-heading shrink-0 w-12"
                                            style={{ color: era.color }}
                                        >
                                            {m.year}
                                        </span>
                                        <span className="text-sm text-white/50">{m.event}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Era number */}
                    <div className="absolute top-8 right-8 font-heading text-[120px] md:text-[200px] leading-none opacity-[0.03] select-none pointer-events-none">
                        {String(index + 1).padStart(2, "0")}
                    </div>
                </section>
            ))}

            {/* Closing */}
            <section className="relative py-32 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(237,29,36,0.1),transparent_60%)]" />
                <div className="relative z-10 px-6">
                    <p className="text-marvel-red text-sm font-bold uppercase tracking-[0.3em] mb-4">
                        The story continues
                    </p>
                    <h2 className="font-heading text-5xl md:text-7xl text-white tracking-wider mb-6">
                        EXCELSIOR
                    </h2>
                    <p className="text-white/40 max-w-xl mx-auto">
                        &ldquo;With great power comes great responsibility.&rdquo; — Stan Lee
                    </p>
                </div>
            </section>
        </div>
    );
}
