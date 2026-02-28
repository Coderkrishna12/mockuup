"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface TimelineLine3DProps {
    totalCards: number;
    activeIndex: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function TimelineLine3D({ totalCards, activeIndex, containerRef }: TimelineLine3DProps) {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.001,
    });

    const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    const glowOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5]);

    return (
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] z-[2] hidden md:block">
            {/* Track (faint) */}
            <div className="absolute inset-0 bg-white/[0.04] rounded-full" />

            {/* Filled line */}
            <motion.div
                className="absolute top-0 left-0 w-full rounded-full origin-top"
                style={{
                    height: lineHeight,
                    background: "linear-gradient(180deg, #3B82F6 0%, #A855F7 40%, #FFD700 70%, #EC4899 100%)",
                    boxShadow: "0 0 12px rgba(168,85,247,0.4), 0 0 30px rgba(168,85,247,0.15)",
                }}
            />

            {/* Glowing tip */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                style={{
                    top: lineHeight,
                    opacity: glowOpacity,
                    background: "radial-gradient(circle, #A855F7 0%, #7C3AED 50%, transparent 70%)",
                    boxShadow: "0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(168,85,247,0.4), 0 0 60px rgba(168,85,247,0.2)",
                    marginTop: "-6px",
                }}
            />

            {/* Node dots for each card */}
            {Array.from({ length: totalCards }).map((_, i) => {
                const pos = totalCards > 1 ? (i / (totalCards - 1)) * 100 : 0;
                const isActive = i === activeIndex;
                return (
                    <div
                        key={i}
                        className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
                        style={{ top: `${pos}%` }}
                    >
                        <div
                            className="rounded-full transition-all duration-500"
                            style={{
                                width: isActive ? 14 : 8,
                                height: isActive ? 14 : 8,
                                marginLeft: isActive ? -7 : -4,
                                marginTop: isActive ? -7 : -4,
                                background: isActive
                                    ? "radial-gradient(circle, #fff 30%, #A855F7 100%)"
                                    : "rgba(255,255,255,0.12)",
                                boxShadow: isActive
                                    ? "0 0 16px rgba(168,85,247,0.8), 0 0 32px rgba(168,85,247,0.3)"
                                    : "none",
                                border: isActive ? "2px solid rgba(168,85,247,0.6)" : "1px solid rgba(255,255,255,0.08)",
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
