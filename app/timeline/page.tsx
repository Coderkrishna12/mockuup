"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, X, GitBranch, Clock } from "lucide-react";

import { timelineEvents, getMainTimelineEvents, type TimelineEvent } from "@/data/timeline";
import { getPhaseColor } from "@/lib/utils";
import { useReducedMotion, useIsMobile } from "@/lib/hooks";
import { audioManager } from "@/lib/audio";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* Character poster map — keyed by movieId, verified TMDB poster paths */
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

function TimelineSection({ event, index }: { event: TimelineEvent; index: number }) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const color = getPhaseColor(event.phase);
    const media = movieCharacterImages[event.movieId];
    const isAlternate = !event.isMainTimeline;

    return (
        <div
            ref={sectionRef}
            className="timeline-section relative min-h-screen flex items-center py-16"
            data-index={index}
        >
            {/* Background Images — fading backdrop */}
            {media?.backdrop && (
                <div className="absolute inset-0 overflow-hidden timeline-backdrop-wrap" style={{ opacity: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={media.backdrop}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr,350px] gap-8 items-center w-full">
                {/* Text Content */}
                <div className="timeline-content" style={{ opacity: 0 }}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
                            Phase {event.phase} • {event.date}
                        </span>
                        {isAlternate && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full border text-white/40" style={{ borderColor: `${color}40` }}>
                                <GitBranch size={10} className="inline mr-1" />
                                {event.universe}
                            </span>
                        )}
                    </div>
                    <h2 className="font-heading text-4xl md:text-6xl text-white tracking-wider leading-tight mb-4">
                        {event.title}
                    </h2>
                    <p className="text-white/50 leading-relaxed max-w-xl mb-6">
                        {event.description}
                    </p>
                    <div className="flex items-center gap-3">
                        <span
                            className="text-[10px] px-3 py-1 rounded-full uppercase tracking-wider"
                            style={{
                                backgroundColor: `${color}15`,
                                color,
                                border: `1px solid ${color}30`,
                            }}
                        >
                            {event.category}
                        </span>
                        <Link
                            href={`/movies/${event.movieId}`}
                            className="text-xs text-marvel-red hover:text-white transition-colors inline-flex items-center gap-1"
                        >
                            View Movie <ChevronRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Character Image */}
                {media?.character && (
                    <div className="hidden md:block timeline-character" style={{ opacity: 0, transform: "translateY(40px)" }}>
                        <div className="relative w-[300px] h-[450px] mx-auto rounded-xl overflow-hidden" style={{ boxShadow: `0 25px 50px -12px ${color}30` }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={media.character}
                                alt={event.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                    e.currentTarget.src = '/marvel-logo.svg';
                                    e.currentTarget.className = 'w-24 h-24 mx-auto mt-40 opacity-20';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <p className="font-heading text-sm text-white/80 tracking-wider">{event.title}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Section number */}
            <div className="absolute top-8 right-8 font-heading text-[100px] leading-none opacity-[0.03] select-none pointer-events-none">
                {String(index + 1).padStart(2, "0")}
            </div>
        </div>
    );
}

export default function TimelinePage() {
    const reducedMotion = useReducedMotion();
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
    const [showAlternate, setShowAlternate] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const events = showAlternate ? timelineEvents : getMainTimelineEvents();

    useEffect(() => {
        if (reducedMotion || !containerRef.current) return;

        const ctx = gsap.context(() => {
            // Each timeline section
            gsap.utils.toArray<HTMLElement>(".timeline-section").forEach((section, i) => {
                const backdrop = section.querySelector(".timeline-backdrop-wrap");
                const content = section.querySelector(".timeline-content");
                const character = section.querySelector(".timeline-character");

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top 60%",
                        end: "bottom 40%",
                        toggleActions: "play reverse play reverse",
                        onEnter: () => setActiveIndex(i),
                        onEnterBack: () => setActiveIndex(i),
                    },
                });

                // Fade in backdrop
                if (backdrop) {
                    tl.to(backdrop, { opacity: 0.2, duration: 1, ease: "power2.out" }, 0);
                }

                // Slide in content
                if (content) {
                    tl.to(content, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 0.2);
                }

                // Slide in character
                if (character) {
                    tl.to(character, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.4);
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [reducedMotion, showAlternate]);

    return (
        <div className="min-h-screen">
            {/* Fixed Header */}
            <div className="sticky top-16 z-30 bg-black/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-heading text-3xl md:text-4xl text-white tracking-wider">
                                MCU <span className="text-marvel-gold text-glow-gold">TIMELINE</span>
                            </h1>
                            <p className="text-xs text-white/30 mt-1">
                                Scroll to journey through the Marvel Cinematic Universe
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

                            {/* Phase legend in compact */}
                            <div className="hidden md:flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((phase) => (
                                    <div key={phase} className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getPhaseColor(phase) }} />
                                        <span className="text-[10px] text-white/30">P{phase}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-marvel-red via-marvel-gold to-blue-500 rounded-full"
                            animate={{ width: `${((activeIndex + 1) / events.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable Timeline Sections */}
            <div ref={containerRef}>
                {events.map((event, i) => (
                    <TimelineSection key={event.id} event={event} index={i} />
                ))}
            </div>

            {/* Closing */}
            <div className="relative py-32 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_60%)]" />
                <div className="relative z-10">
                    <p className="text-marvel-gold text-sm font-bold uppercase tracking-[0.3em] mb-4">
                        The Saga Continues
                    </p>
                    <h2 className="font-heading text-5xl md:text-7xl text-white tracking-wider mb-4">
                        TO BE CONTINUED...
                    </h2>
                    <p className="text-white/40 max-w-lg mx-auto">
                        The MCU timeline is always expanding. New stories, new heroes, new realities.
                    </p>
                </div>
            </div>
        </div>
    );
}
