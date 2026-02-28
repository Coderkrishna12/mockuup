"use client";

import { useMemo } from "react";
import { useIsMobile } from "@/lib/hooks";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    duration: number;
    delay: number;
    drift: number;
    color: string;
}

const COLORS = [
    "rgba(99, 132, 255, 0.6)",   // soft blue
    "rgba(168, 85, 247, 0.5)",   // purple
    "rgba(6, 182, 212, 0.4)",    // cyan
    "rgba(139, 92, 246, 0.45)",  // violet
    "rgba(59, 130, 246, 0.35)",  // blue
    "rgba(237, 29, 36, 0.2)",    // faint red
];

export default function TimelineParticles() {
    const isMobile = useIsMobile();
    const count = isMobile ? 10 : 24;

    const particles = useMemo<Particle[]>(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 2 + Math.random() * 4,
            opacity: 0.15 + Math.random() * 0.35,
            duration: 18 + Math.random() * 24,
            delay: Math.random() * 15,
            drift: -30 + Math.random() * 60,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }));
    }, [count]);

    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ zIndex: 1 }}
            aria-hidden="true"
        >
            {particles.map((p) => (
                <span
                    key={p.id}
                    className="absolute rounded-full timeline-particle"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        background: p.color,
                        opacity: p.opacity,
                        boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                        ["--drift" as string]: `${p.drift}px`,
                    }}
                />
            ))}
        </div>
    );
}
