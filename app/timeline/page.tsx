"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { GitBranch } from "lucide-react";

import { timelineEvents, getMainTimelineEvents, type TimelineEvent } from "@/data/timeline";
import { getPhaseColor } from "@/lib/utils";
import { useReducedMotion, useIsMobile } from "@/lib/hooks";

import TimelineCard3D from "@/components/TimelineCard3D";
import TimelineLine3D from "@/components/TimelineLine3D";
import TimelineParticles from "@/components/TimelineParticles";

export default function TimelinePage() {
    const reducedMotion = useReducedMotion();
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const [showAlternate, setShowAlternate] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const events = showAlternate ? timelineEvents : getMainTimelineEvents();

    /* Global scroll progress for progress bar */
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 28,
        restDelta: 0.001,
    });

    const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    /* Track active card via IntersectionObserver */
    useEffect(() => {
        if (!containerRef.current) return;

        const cards = containerRef.current.querySelectorAll("[data-timeline-card]");
        if (!cards.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const idx = Number(entry.target.getAttribute("data-timeline-card"));
                        if (!isNaN(idx)) setActiveIndex(idx);
                    }
                });
            },
            { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
        );

        cards.forEach((card) => observer.observe(card));
        return () => observer.disconnect();
    }, [events]);

    /* Background ambient gradient that shifts with active phase */
    const activePhaseColor = events[activeIndex]
        ? getPhaseColor(events[activeIndex].phase)
        : "#A855F7";

    return (
        <div className="min-h-screen relative">
            {/* ═══ AMBIENT BACKGROUND LAYER (slow parallax) ═══ */}
            <div
                className="fixed inset-0 transition-all duration-[2s] pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse at 30% 20%, ${activePhaseColor}08 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 70%, rgba(168,85,247,0.04) 0%, transparent 50%),
                        radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.03) 0%, transparent 60%)
                    `,
                    zIndex: 0,
                }}
            />

            {/* ═══ FLOATING PARTICLES (midground) ═══ */}
            {!reducedMotion && (
                <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                    <TimelineParticles />
                </div>
            )}

            {/* ═══ STICKY HEADER ═══ */}
            <div className="sticky top-16 z-30 bg-black/70 backdrop-blur-xl border-b border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-heading text-3xl md:text-4xl text-white tracking-wider">
                                MCU <span className="text-marvel-gold text-glow-gold">TIMELINE</span>
                            </h1>
                            <p className="text-xs text-white/25 mt-1">
                                A scroll-driven journey through the Marvel Cinematic Universe
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowAlternate(!showAlternate)}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border transition-all ${showAlternate
                                        ? "bg-marvel-purple/20 border-marvel-purple text-marvel-purple"
                                        : "border-white/10 text-white/40 hover:border-white/30"
                                    }`}
                            >
                                <GitBranch size={12} />
                                {showAlternate ? "All Timelines" : "Sacred Only"}
                            </button>

                            {/* Phase legend */}
                            <div className="hidden md:flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((phase) => (
                                    <div key={phase} className="flex items-center gap-1">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: getPhaseColor(phase) }}
                                        />
                                        <span className="text-[10px] text-white/30">P{phase}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                width: progressWidth,
                                background: "linear-gradient(90deg, #3B82F6, #A855F7, #FFD700, #EC4899)",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ═══ TIMELINE CONTAINER (foreground) ═══ */}
            <div
                ref={containerRef}
                className="relative z-10 timeline-perspective"
                style={{ paddingTop: "6rem", paddingBottom: "4rem" }}
            >
                {/* Progressive timeline line */}
                {!isMobile && !reducedMotion && (
                    <TimelineLine3D
                        totalCards={events.length}
                        activeIndex={activeIndex}
                        containerRef={containerRef}
                    />
                )}

                {/* Phase section headers + cards */}
                <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6 md:space-y-10">
                    {events.map((event, i) => {
                        const isNewPhase = i === 0 || events[i - 1].phase !== event.phase;
                        const phaseColor = getPhaseColor(event.phase);
                        const phaseNames: Record<number, string> = {
                            1: "THE BEGINNING",
                            2: "EXPANSION",
                            3: "THE INFINITY SAGA",
                            4: "THE MULTIVERSE SAGA",
                            5: "NEW ERA",
                        };

                        return (
                            <div key={event.id}>
                                {/* Phase divider */}
                                {isNewPhase && (
                                    <motion.div
                                        className="flex items-center gap-4 py-8 md:py-12 justify-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ type: "spring", stiffness: 200, damping: 24 }}
                                    >
                                        <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, transparent, ${phaseColor}40)` }} />
                                        <div className="text-center">
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-1"
                                                style={{ color: phaseColor }}
                                            >
                                                Phase {event.phase}
                                            </span>
                                            <span className="font-heading text-lg md:text-xl text-white/60 tracking-wider">
                                                {phaseNames[event.phase] || ""}
                                            </span>
                                        </div>
                                        <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, ${phaseColor}40, transparent)` }} />
                                    </motion.div>
                                )}

                                {/* Card with data attribute for intersection observer */}
                                <div data-timeline-card={i}>
                                    <TimelineCard3D
                                        event={event}
                                        index={i}
                                        isActive={i === activeIndex}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ═══ CLOSING SECTION ═══ */}
            <div className="relative py-32 text-center z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.08),transparent_60%)]" />
                <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 150, damping: 24 }}
                >
                    <p className="text-marvel-gold text-sm font-bold uppercase tracking-[0.3em] mb-4">
                        The Saga Continues
                    </p>
                    <h2 className="font-heading text-5xl md:text-7xl text-white tracking-wider mb-4">
                        TO BE CONTINUED...
                    </h2>
                    <p className="text-white/40 max-w-lg mx-auto">
                        The MCU timeline is always expanding. New stories, new heroes, new realities.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
