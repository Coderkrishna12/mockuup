"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { arcadeGames } from "@/data/arcade";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Gamepad2 } from "lucide-react";

export default function ArcadePage() {
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!heroRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from(".arcade-title-char", {
                opacity: 0,
                y: 80,
                rotateX: -90,
                stagger: 0.05,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: 0.3,
            });
            gsap.from(".arcade-subtitle", {
                opacity: 0,
                y: 20,
                duration: 0.6,
                delay: 1.0,
            });
        }, heroRef);
        return () => ctx.revert();
    }, []);

    const titleChars = "MARVEL ARCADE".split("");

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div ref={heroRef} className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(237,29,36,0.2),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(30,144,255,0.1),transparent_50%)]" />

                {/* Floating game icons */}
                {arcadeGames.map((game, i) => (
                    <motion.div
                        key={game.id}
                        className="absolute text-4xl opacity-10"
                        style={{
                            left: `${15 + i * 18}%`,
                            top: `${20 + (i % 3) * 20}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 4 + i,
                            delay: i * 0.5,
                        }}
                    >
                        {game.icon}
                    </motion.div>
                ))}

                <div className="relative z-10 text-center px-6">
                    <div className="flex justify-center gap-0.5 mb-4 overflow-hidden" style={{ perspective: "600px" }}>
                        {titleChars.map((char, i) => (
                            <span
                                key={i}
                                className={`arcade-title-char font-heading text-5xl md:text-7xl lg:text-8xl tracking-wider inline-block ${char === " " ? "w-4" : ""
                                    } ${i >= 7 ? "text-marvel-red" : "text-white"}`}
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </div>
                    <p className="arcade-subtitle text-white/40 text-lg">
                        Play Marvel-themed mini games. Select a game below to start.
                    </p>
                </div>
            </div>

            {/* Games Grid */}
            <div className="max-w-5xl mx-auto px-6 pb-24 -mt-8">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {arcadeGames.map((game) => (
                        <motion.div key={game.id} variants={staggerItem}>
                            <Link
                                href={`/arcade/${game.id}`}
                                className="group block glass rounded-xl p-6 border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-lg"
                                style={{
                                    ["--glow-color" as string]: game.color,
                                }}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div
                                        className="text-4xl w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${game.color}15`, border: `1px solid ${game.color}30` }}
                                    >
                                        {game.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-heading text-xl text-white tracking-wider group-hover:text-marvel-red transition-colors">
                                            {game.title}
                                        </h3>
                                        <span
                                            className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
                                            style={{ color: game.color, backgroundColor: `${game.color}15` }}
                                        >
                                            {game.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-white/50 mb-4">{game.description}</p>

                                <div className="flex items-center gap-2 text-sm text-white/30 group-hover:text-marvel-red transition-colors">
                                    <Gamepad2 size={16} />
                                    <span>Play Now →</span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
