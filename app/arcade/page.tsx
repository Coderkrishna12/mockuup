"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { arcadeGames } from "@/data/arcade";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Gamepad2, ChevronRight } from "lucide-react";

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
            <div className="max-w-6xl mx-auto px-6 pb-24 -mt-8">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {arcadeGames.map((game) => (
                        <motion.div key={game.id} variants={staggerItem}>
                            <Link
                                href={`/arcade/${game.id}`}
                                className="group block rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:shadow-2xl relative"
                                style={{
                                    ["--glow-color" as string]: game.color,
                                }}
                            >
                                {/* Character image background */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={game.characterImage}
                                        alt={game.characterName}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                                    />
                                    {/* Gradient overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                                        style={{ background: `linear-gradient(135deg, ${game.color}40, transparent)` }}
                                    />

                                    {/* Icon badge */}
                                    <div
                                        className="absolute top-4 right-4 text-3xl w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-lg border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                                        style={{ backgroundColor: `${game.color}20`, borderColor: `${game.color}40` }}
                                    >
                                        {game.icon}
                                    </div>

                                    {/* Difficulty badge */}
                                    <span
                                        className="absolute top-4 left-4 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full backdrop-blur-lg border"
                                        style={{ color: game.color, backgroundColor: `${game.color}15`, borderColor: `${game.color}30` }}
                                    >
                                        {game.difficulty}
                                    </span>

                                    {/* Character name at bottom of image */}
                                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: game.color }} />
                                        <span className="text-xs text-white/50 font-medium uppercase tracking-wider">{game.characterName}</span>
                                    </div>
                                </div>

                                {/* Card body */}
                                <div className="p-5 bg-black/40 backdrop-blur-sm">
                                    <h3 className="font-heading text-xl text-white tracking-wider mb-2 group-hover:text-marvel-red transition-colors duration-300">
                                        {game.title}
                                    </h3>
                                    <p className="text-sm text-white/40 mb-4 leading-relaxed">{game.description}</p>

                                    <div
                                        className="flex items-center gap-2 text-sm font-bold transition-all duration-300 group-hover:gap-3"
                                        style={{ color: game.color }}
                                    >
                                        <Gamepad2 size={16} />
                                        <span>Play Now</span>
                                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                </div>

                                {/* Bottom glow line */}
                                <div
                                    className="h-0.5 w-0 group-hover:w-full transition-all duration-700"
                                    style={{ backgroundColor: game.color }}
                                />
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
