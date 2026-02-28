"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, Home, Film, Tv, Users } from "lucide-react";
import { audioManager } from "@/lib/audio";

const getIconForLabel = (label: string) => {
    switch (label) {
        case "Home": return Home;
        case "Movies": return Film;
        case "TV Shows": return Tv;
        case "Characters": return Users;
        default: return Home;
    }
};

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/characters", label: "Characters" },
    { href: "/movies", label: "Movies" },
    { href: "/tvshows", label: "TV Shows" },
    { href: "/comics", label: "Comics" },
    { href: "/timeline", label: "Timeline" },
    { href: "/arcade", label: "Arcade" },
    { href: "/history", label: "History" },
    { href: "/ar", label: "AR" },
    { href: "/multiverse", label: "Multiverse" },
];

// const demoSteps = [
//     { href: "/", label: "1. Home" },
//     { href: "/movies", label: "2. Movies" },
//     { href: "/timeline", label: "3. Timeline" },
//     { href: "/characters", label: "4. Characters" },
//     { href: "/multiverse", label: "5. Multiverse" },
// ];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    // const [showDemo, setShowDemo] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            {/* Desktop Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 hidden md:block ${scrolled
                    ? "glass-strong shadow-lg shadow-black/50"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group" aria-label="Marvel Universe Home">
                        <Image
                            src="/Marvel-Logo-PNG-File.png"
                            alt="Marvel"
                            width={150}
                            height={12}
                            className="group-hover:brightness-125 transition-all duration-300"
                            priority
                        />
                        {/* <span className="font-heading text-lg tracking-wider text-white/80 hidden lg:inline">
                            UNIVERSE
                        </span> */}
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-marvel-red"
                                onMouseEnter={() => audioManager.playHover()}
                            >
                                <span className={pathname === link.href ? "text-white" : "text-white/60"}>
                                    {link.label}
                                </span>
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-marvel-red"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Controls */}
                    {/* <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowDemo(!showDemo)}
                            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-marvel-gold"
                            aria-label="Demo mode"
                            title="Demo Navigation"
                        >
                            <Zap size={18} />
                        </button>
                    </div> */}
                </div>

                {/* Demo Mode Panel */}
                {/* <AnimatePresence>
                    {showDemo && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-strong border-t border-white/5"
                        >
                            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
                                <span className="text-xs text-marvel-gold font-medium uppercase tracking-wider">Demo Flow:</span>
                                {demoSteps.map((step) => (
                                    <Link
                                        key={step.href}
                                        href={step.href}
                                        onClick={() => setShowDemo(false)}
                                        className="text-xs px-3 py-1 rounded-full border border-marvel-gold/30 text-marvel-gold hover:bg-marvel-gold/10 transition-colors"
                                    >
                                        {step.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence> */}
            </motion.nav>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/10 pb-safe">
                <div className="flex items-center justify-around h-16 px-2">
                    {navLinks.slice(0, 4).map((link) => {
                        const Icon = getIconForLabel(link.label);
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex flex-col items-center justify-center w-16 h-full gap-1 text-[10px] uppercase font-bold transition-all duration-300 ${isActive ? "text-marvel-red" : "text-white/50 hover:text-white/80"
                                    }`}
                            >
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    animate={{
                                        y: isActive ? -2 : 0,
                                        scale: isActive ? 1.1 : 1
                                    }}
                                    className={`relative p-1.5 rounded-full ${isActive ? 'bg-marvel-red/10' : ''}`}
                                >
                                    <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobile-nav-indicator"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-marvel-red"
                                        />
                                    )}
                                </motion.div>
                                <span className={`${isActive ? "opacity-100" : "opacity-70"} tracking-wider`}>{link.label}</span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex flex-col items-center justify-center w-16 h-full gap-1 text-[10px] uppercase font-bold text-white/50 hover:text-white/80 transition-all duration-300"
                        aria-label="Open menu"
                    >
                        <motion.div whileTap={{ scale: 0.9 }} className="p-1.5 rounded-full">
                            <Menu size={20} strokeWidth={2} />
                        </motion.div>
                        <span className="opacity-70 tracking-wider">More</span>
                    </button>
                </div>
            </div>

            {/* Mobile Full Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl"
                    >
                        <div className="flex flex-col h-full p-6">
                            <div className="flex justify-between items-center mb-12">
                                <span className="font-heading text-2xl text-white">
                                    MARVEL <span className="text-marvel-red">UNIVERSE</span>
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-white"
                                    aria-label="Close menu"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <nav className="flex flex-col gap-2">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`block py-4 font-heading text-4xl tracking-wider transition-colors ${pathname === link.href ? "text-marvel-red" : "text-white/60 hover:text-white"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                            <div className="mt-auto flex items-center gap-4">
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
