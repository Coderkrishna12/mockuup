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
                const charImgs = era.querySelectorAll(".era-char-img");
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

                if (img) tl.from(img, { opacity: 0, scale: 1.15, duration: 1.5, ease: "power2.out" }, 0);
                charImgs.forEach((ci, i) => {
                    tl.from(ci, { opacity: 0, y: 40, scale: 0.8, duration: 1, ease: "power2.out" }, 0.3 + i * 0.2);
                });
                if (period) tl.from(period, { opacity: 0, x: -30, duration: 0.6 }, 0.2);
                if (title) tl.from(title, { opacity: 0, y: 40, duration: 0.8 }, 0.3);
                if (subtitle) tl.from(subtitle, { opacity: 0, y: 20, duration: 0.6 }, 0.5);
                paragraphs.forEach((p, i) => tl.from(p, { opacity: 0, y: 30, duration: 0.6 }, 0.6 + i * 0.15));
                milestones.forEach((m, i) => tl.from(m, { opacity: 0, x: -20, duration: 0.4 }, 0.8 + i * 0.1));
                if (divider) tl.from(divider, { scaleX: 0, duration: 0.8, ease: "power2.out" }, 0.4);

                // Parallax on the background image
                if (img) {
                    gsap.to(img, {
                        y: -80,
                        ease: "none",
                        scrollTrigger: {
                            trigger: era,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1,
                        },
                    });
                }
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
                <section key={era.id} className="history-era relative py-24 md:py-40 min-h-[80vh]">
                    {/* Background image — much larger and more visible */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="era-image absolute inset-0 -top-20 -bottom-20">
                            <Image
                                src={era.imageUrl}
                                alt={era.title}
                                fill
                                className="object-cover"
                                style={{ opacity: 0.25 }}
                                onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                            />
                        </div>
                        {/* Gradient overlay — keeps text readable but lets image show through */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
                        <div className="absolute inset-0" style={{
                            background: `radial-gradient(circle at ${index % 2 === 0 ? '80% 30%' : '20% 70%'}, ${era.color}12, transparent 60%)`,
                        }} />
                    </div>

                    {/* Floating character images — right side or left side alternating */}
                    <div className={`absolute top-1/2 -translate-y-1/2 ${index % 2 === 0 ? 'right-4 md:right-12' : 'left-4 md:left-12'} hidden lg:flex flex-col gap-6 z-[1]`}>
                        {era.characterImages.map((img, i) => (
                            <div
                                key={i}
                                className="era-char-img relative w-40 h-56 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                                style={{
                                    transform: `rotate(${i === 0 ? -3 : 3}deg)`,
                                    boxShadow: `0 20px 60px ${era.color}25`,
                                }}
                            >
                                <Image
                                    src={img}
                                    alt={era.title}
                                    fill
                                    className="object-cover"
                                    onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute inset-0 border-2 rounded-2xl" style={{ borderColor: `${era.color}20` }} />
                            </div>
                        ))}
                    </div>

                    <div className={`relative z-10 max-w-4xl mx-auto px-6 md:px-12 ${index % 2 === 0 ? 'lg:mr-auto lg:ml-24' : 'lg:ml-auto lg:mr-24'}`}>
                        {/* Period badge */}
                        <div className="era-period flex items-center gap-3 mb-4">
                            <div className="w-16 h-px" style={{ backgroundColor: era.color }} />
                            <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: era.color }}>
                                {era.period}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="era-title font-heading text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-3">
                            {era.title}
                        </h2>
                        <p className="era-subtitle text-xl md:text-2xl text-white/50 mb-10 font-light">{era.subtitle}</p>

                        {/* Divider */}
                        <div
                            className="era-divider h-px w-full mb-10 origin-left"
                            style={{ background: `linear-gradient(to right, ${era.color}, transparent)` }}
                        />

                        {/* Content */}
                        <div className="grid md:grid-cols-[1fr,280px] gap-12">
                            <div className="space-y-6">
                                {era.paragraphs.map((p, i) => (
                                    <p key={i} className="era-paragraph text-white/70 leading-relaxed text-base md:text-lg">
                                        {i === 0 && (
                                            <span
                                                className="text-5xl font-heading float-left mr-3 mt-1 leading-none"
                                                style={{ color: era.color }}
                                            >
                                                {p[0]}
                                            </span>
                                        )}
                                        {i === 0 ? p.slice(1) : p}
                                    </p>
                                ))}
                            </div>

                            {/* Milestones */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-white/30 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: era.color }} />
                                    Key Milestones
                                </h3>
                                {era.milestones.map((m, i) => (
                                    <div key={i} className="era-milestone flex gap-3 items-start group">
                                        <span
                                            className="text-sm font-bold font-heading shrink-0 w-12 group-hover:scale-110 transition-transform"
                                            style={{ color: era.color }}
                                        >
                                            {m.year}
                                        </span>
                                        <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">{m.event}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile character images */}
                        <div className="flex gap-4 mt-10 lg:hidden overflow-x-auto scrollbar-hide">
                            {era.characterImages.map((img, i) => (
                                <div
                                    key={i}
                                    className="era-char-img relative w-32 h-44 rounded-xl overflow-hidden border border-white/10 flex-shrink-0"
                                    style={{ boxShadow: `0 10px 30px ${era.color}20` }}
                                >
                                    <Image
                                        src={img}
                                        alt={era.title}
                                        fill
                                        className="object-cover"
                                        onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Era number */}
                    <div
                        className="absolute top-8 font-heading text-[120px] md:text-[220px] leading-none select-none pointer-events-none"
                        style={{
                            opacity: 0.04,
                            [index % 2 === 0 ? 'left' : 'right']: '20px',
                            color: era.color,
                        }}
                    >
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
