"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [mounted, setMounted] = useState(false);
    const hasPlayed = useRef(false);

    useEffect(() => {
        setMounted(true);
        // Only play once per session
        if (typeof window !== "undefined" && sessionStorage.getItem("marvel-loaded")) {
            setIsLoading(false);
            return;
        }
        if (hasPlayed.current) return;
        hasPlayed.current = true;

        // Simulate loading progress
        const duration = 2500;
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(100, (elapsed / duration) * 100);
            setProgress(pct);

            if (pct >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsLoading(false);
                    sessionStorage.setItem("marvel-loaded", "true");
                }, 400);
            }
        }, 16);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loading-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
                    aria-label="Loading Marvel Universe"
                    role="progressbar"
                    aria-valuenow={Math.round(progress)}
                >
                    {/* Radial background glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(237,29,36,0.15)_0%,transparent_60%)]" />

                    {/* Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {mounted && Array.from({ length: 30 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 rounded-full bg-marvel-red/60"
                                initial={{
                                    x: `${Math.random() * 100}%`,
                                    y: "110%",
                                    opacity: 0,
                                }}
                                animate={{
                                    y: "-10%",
                                    opacity: [0, 1, 1, 0],
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                    ease: "linear",
                                }}
                            />
                        ))}
                    </div>

                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Marvel M Icon */}
                        <motion.div
                            initial={{ scale: 0.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                            className="mb-6 drop-shadow-[0_0_25px_rgba(237,29,36,0.6)]"
                        >
                            <Image
                                src="/M_icon.png"
                                alt="Marvel Icon"
                                width={96}
                                height={96}
                                className="h-24 w-auto object-contain rounded-xl"
                            />
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="font-heading text-4xl md:text-5xl tracking-[0.2em] text-white mb-2"
                        >
                            MARVEL
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="font-heading text-xl tracking-[0.4em] text-marvel-red mb-8"
                        >
                            UNIVERSE
                        </motion.p>

                        {/* Progress Bar */}
                        <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-marvel-red rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>

                        {/* Loading text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="mt-4 text-xs text-white/30 tracking-widest uppercase"
                        >
                            Entering the cinematic universe
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
