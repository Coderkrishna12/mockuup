"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import { characters } from "@/data/characters";

/* ═══════════════════════════════════════════════════════════════
   TRENDING CAROUSEL DATA
   ═════════════════════════════════════════════════════════════ */
const trendingSlides = [
    {
        id: 1,
        title: "AVENGERS: SECRET WARS",
        subtitle: "THE MULTIVERSE SAGA CONCLUDES",
        tag: "UPCOMING MOVIE",
        image: "/characters/renders/iron-man.png",
        gradient: "linear-gradient(135deg, #1a0000, #2d0a0a)",
        accentColor: "#E8002D",
    },
    {
        id: 2,
        title: "THOR: VALHALLA",
        subtitle: "A NEW CHAPTER FOR THE GOD OF THUNDER",
        tag: "PHASE 7",
        image: "/characters/renders/thor.png",
        gradient: "linear-gradient(135deg, #0a0a1a, #0a1428)",
        accentColor: "#1A5B9C",
    },
    {
        id: 3,
        title: "DOCTOR STRANGE 3",
        subtitle: "THE SORCERER SUPREME RETURNS",
        tag: "NOW STREAMING",
        image: "/characters/renders/doctor-strange.png",
        gradient: "linear-gradient(135deg, #0a0512, #1a0a28)",
        accentColor: "#8B5CF6",
    },
    {
        id: 4,
        title: "THE MAD TITAN",
        subtitle: "WITNESS THE RISE OF THANOS",
        tag: "DISNEY+ ORIGINAL",
        image: "/characters/renders/thanos.png",
        gradient: "linear-gradient(135deg, #140a1a, #1a0a28)",
        accentColor: "#F0C040",
    },
];

/* ═══════════════════════════════════════════════════════════════
   AVENGERS INITIATIVE DATA (expanding cards)
   ═════════════════════════════════════════════════════════════ */
const avengersCards = [
    { key: "ironman", name: "IRON MAN", image: "/characters/renders/iron-man.png", color: "#E8002D", quote: "I am Iron Man." },
    { key: "thor", name: "THOR", image: "/characters/renders/thor.png", color: "#1A5B9C", quote: "Bring me Thanos!" },
    { key: "strange", name: "DR. STRANGE", image: "/characters/renders/doctor-strange.png", color: "#8B5CF6", quote: "We are in the endgame now." },
    { key: "cap", name: "CAPTAIN AMERICA", image: "/characters/renders/captain-america.png", color: "#1E3A8A", quote: "I can do this all day." },
    { key: "hulk", name: "HULK", image: "/characters/renders/hulk.png", color: "#166534", quote: "Hulk smash!" },
    { key: "spider", name: "SPIDER-MAN", image: "/characters/renders/spider-man-render.png", color: "#DC2626", quote: "With great power comes great responsibility." },
];

/* ═══════════════════════════════════════════════════════════════
   CHARACTER DATABASE DATA (grid with search/filter)
   ═════════════════════════════════════════════════════════════ */
interface CharDBEntry {
    id: string;
    name: string;
    alias: string;
    team: string;
    image: string;
    color: string;
    powers: { strength: number; intelligence: number; speed: number; durability: number };
}

const charDB: CharDBEntry[] = [
    { id: "iron-man", name: "Iron Man", alias: "Tony Stark", team: "Avengers", image: "/characters/renders/iron-man.png", color: "#E8002D", powers: { strength: 85, intelligence: 100, speed: 70, durability: 85 } },
    { id: "thor", name: "Thor", alias: "Thor Odinson", team: "Avengers", image: "/characters/renders/thor.png", color: "#1A5B9C", powers: { strength: 95, intelligence: 50, speed: 80, durability: 95 } },
    { id: "captain-america", name: "Captain America", alias: "Steve Rogers", team: "Avengers", image: "/characters/renders/captain-america.png", color: "#1E3A8A", powers: { strength: 60, intelligence: 60, speed: 50, durability: 65 } },
    { id: "hulk", name: "Hulk", alias: "Bruce Banner", team: "Avengers", image: "/characters/renders/hulk.png", color: "#166534", powers: { strength: 100, intelligence: 90, speed: 55, durability: 100 } },
    { id: "spider-man", name: "Spider-Man", alias: "Peter Parker", team: "Avengers", image: "/characters/renders/spider-man-render.png", color: "#DC2626", powers: { strength: 65, intelligence: 85, speed: 70, durability: 60 } },
    { id: "doctor-strange", name: "Doctor Strange", alias: "Stephen Strange", team: "Avengers", image: "/characters/renders/doctor-strange.png", color: "#8B5CF6", powers: { strength: 30, intelligence: 95, speed: 40, durability: 50 } },
    { id: "black-panther", name: "Black Panther", alias: "T'Challa", team: "Avengers", image: "/characters/renders/black-panther.png", color: "#7C3AED", powers: { strength: 70, intelligence: 80, speed: 65, durability: 75 } },
    { id: "thanos", name: "Thanos", alias: "The Mad Titan", team: "Villain", image: "/characters/renders/thanos.png", color: "#F0C040", powers: { strength: 100, intelligence: 85, speed: 50, durability: 100 } },
    { id: "black-widow", name: "Black Widow", alias: "Natasha Romanoff", team: "Avengers", image: "/characters/renders/black-widow.png", color: "#B91C1C", powers: { strength: 30, intelligence: 75, speed: 45, durability: 35 } },
    { id: "hawkeye", name: "Hawkeye", alias: "Clint Barton", team: "Avengers", image: "/characters/renders/hawkeye.png", color: "#A855F7", powers: { strength: 25, intelligence: 55, speed: 40, durability: 30 } },
    { id: "captain-marvel", name: "Captain Marvel", alias: "Carol Danvers", team: "Avengers", image: "/characters/renders/captain-marvel.png", color: "#EAB308", powers: { strength: 95, intelligence: 65, speed: 90, durability: 95 } },
    { id: "ant-man", name: "Ant-Man", alias: "Scott Lang", team: "Avengers", image: "/characters/renders/ant-man.png", color: "#EF4444", powers: { strength: 55, intelligence: 50, speed: 45, durability: 45 } },
    { id: "loki", name: "Loki", alias: "Loki Laufeyson", team: "Villain", image: "/characters/renders/loki.png", color: "#22C55E", powers: { strength: 50, intelligence: 90, speed: 55, durability: 60 } },
    { id: "falcon", name: "Falcon", alias: "Sam Wilson", team: "Avengers", image: "/characters/renders/falcon.png", color: "#DC2626", powers: { strength: 35, intelligence: 55, speed: 60, durability: 30 } },
    { id: "vision", name: "Vision", alias: "The Vision", team: "Avengers", image: "/characters/renders/vision.png", color: "#059669", powers: { strength: 75, intelligence: 90, speed: 65, durability: 80 } },
    { id: "war-machine", name: "War Machine", alias: "James Rhodes", team: "Avengers", image: "/characters/renders/war-machine.png", color: "#374151", powers: { strength: 80, intelligence: 55, speed: 65, durability: 85 } },
    { id: "star-lord", name: "Star-Lord", alias: "Peter Quill", team: "Guardians", image: "/characters/renders/star-lord.png", color: "#F97316", powers: { strength: 40, intelligence: 50, speed: 45, durability: 40 } },
    { id: "gamora", name: "Gamora", alias: "Zen-Whoberi", team: "Guardians", image: "/characters/renders/gamora.png", color: "#10B981", powers: { strength: 55, intelligence: 65, speed: 60, durability: 55 } },
    { id: "groot", name: "Groot", alias: "I Am Groot", team: "Guardians", image: "/characters/renders/groot.png", color: "#78350F", powers: { strength: 80, intelligence: 20, speed: 20, durability: 85 } },
    { id: "rocket", name: "Rocket", alias: "Rocket Raccoon", team: "Guardians", image: "/characters/renders/rocket.png", color: "#A16207", powers: { strength: 25, intelligence: 80, speed: 45, durability: 30 } },
    { id: "winter-soldier", name: "Winter Soldier", alias: "Bucky Barnes", team: "Avengers", image: "/characters/renders/winter-soldier.png", color: "#64748B", powers: { strength: 55, intelligence: 50, speed: 50, durability: 55 } },
    { id: "nick-fury", name: "Nick Fury", alias: "Nicholas J. Fury", team: "S.H.I.E.L.D.", image: "/characters/renders/nick-fury.png", color: "#1F2937", powers: { strength: 25, intelligence: 85, speed: 30, durability: 25 } },
    { id: "wasp", name: "Wasp", alias: "Hope van Dyne", team: "Avengers", image: "/characters/renders/wasp.png", color: "#EAB308", powers: { strength: 45, intelligence: 75, speed: 55, durability: 40 } },
];

const allTeams = [...new Set(charDB.map((c) => c.team))];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════════ */
export default function CharacterShowcase() {
    return (
        <>
            <TrendingCarousel />
            <AvengersInitiative />
            <CharacterDatabase />
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 1: TRENDING CAROUSEL
   ═════════════════════════════════════════════════════════════ */
function TrendingCarousel() {
    const [current, setCurrent] = useState(0);
    const [transitioning, setTransitioning] = useState(false);

    const goTo = useCallback(
        (idx: number) => {
            if (transitioning) return;
            setTransitioning(true);
            setCurrent(idx);
            setTimeout(() => setTransitioning(false), 800);
        },
        [transitioning]
    );

    const next = useCallback(() => {
        goTo((current + 1) % trendingSlides.length);
    }, [current, goTo]);

    useEffect(() => {
        const interval = setInterval(next, 5000);
        return () => clearInterval(interval);
    }, [next]);

    const slide = trendingSlides[current];

    return (
        <section
            className="relative w-full min-h-[80vh] overflow-hidden flex items-center"
            style={{ ["--accent" as string]: slide.accentColor }}
        >
            {/* BG gradient */}
            <div className="absolute inset-0 transition-all duration-800" style={{ background: slide.gradient }} />
            {/* Glow */}
            <div
                className="absolute top-1/2 right-[10%] w-[50vw] h-[50vw] -translate-y-1/2 blur-[80px] pointer-events-none transition-all duration-800"
                style={{ background: `radial-gradient(circle, ${slide.accentColor}22, transparent 60%)` }}
            />

            {/* Content grid */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-[5%] grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
                {/* Left */}
                <div className="flex flex-col gap-6">
                    <span
                        className="font-heading text-sm tracking-[3px] flex items-center gap-2.5"
                        style={{ color: slide.accentColor }}
                    >
                        <span className="w-8 h-0.5 inline-block" style={{ backgroundColor: slide.accentColor }} />
                        {slide.tag}
                    </span>

                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={slide.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="font-heading text-6xl md:text-7xl lg:text-8xl text-white tracking-wider leading-[0.95]"
                        >
                            {slide.title}
                        </motion.h2>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`sub-${slide.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="text-white/50 text-lg"
                        >
                            {slide.subtitle}
                        </motion.p>
                    </AnimatePresence>

                    <div className="flex gap-4">
                        <button
                            className="px-8 py-3 font-heading text-white text-lg tracking-widest transition-all hover:-translate-y-1"
                            style={{
                                backgroundColor: slide.accentColor,
                                clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                                boxShadow: `0 8px 30px ${slide.accentColor}40`,
                            }}
                        >
                            LEARN MORE
                        </button>
                        <button className="px-6 py-3 font-heading text-white/70 text-lg tracking-widest border border-white/20 hover:bg-white/10 hover:text-white transition-all">
                            ▶ WATCH TRAILER
                        </button>
                    </div>
                </div>

                {/* Right — character render */}
                <div className="hidden lg:flex justify-center items-end">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0, x: 40, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -30, scale: 0.95 }}
                            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="max-h-[65vh] object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.6)]"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {trendingSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="w-10 h-1 rounded-sm overflow-hidden relative"
                        style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    >
                        {i === current && (
                            <motion.span
                                className="absolute inset-0 rounded-sm"
                                style={{ backgroundColor: slide.accentColor }}
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 5, ease: "linear" }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Counter */}
            <div className="absolute bottom-12 right-[5%] z-20 font-heading text-white/30 tracking-wider text-lg">
                <span className="text-white text-2xl">0{current + 1}</span>
                <span className="mx-1">/</span>
                <span>0{trendingSlides.length}</span>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: AVENGERS INITIATIVE (Expanding Cards)
   ═════════════════════════════════════════════════════════════ */
function AvengersInitiative() {
    const [active, setActive] = useState<string | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);

    const highlight = hovered || active;
    const glowColor = avengersCards.find((c) => c.key === highlight)?.color || "#E8002D";

    return (
        <section
            className="relative py-32 min-h-screen overflow-hidden"
            style={{ ["--glow-color" as string]: glowColor, background: "#050505" }}
        >
            {/* Glow background */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] pointer-events-none transition-all duration-600 z-0"
                style={{ background: `radial-gradient(circle, ${glowColor}1A, transparent 60%)`, filter: "blur(80px)" }}
            />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6">
                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-10 h-0.5 bg-marvel-red" />
                        <span className="font-heading text-sm tracking-[3px] text-marvel-red">CHOOSE YOUR HERO</span>
                    </div>
                    <h2 className="font-heading text-5xl md:text-7xl text-white tracking-wider">
                        THE AVENGERS <span className="text-marvel-red">INITIATIVE</span>
                    </h2>
                </div>

                {/* Expanding card gallery */}
                <div className="flex gap-4 h-[550px]">
                    {avengersCards.map((card) => {
                        const isActive = active === card.key || hovered === card.key;
                        return (
                            <div
                                key={card.key}
                                className="relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                                style={{
                                    flex: isActive ? 3 : 1,
                                    borderColor: isActive ? card.color : "rgba(255,255,255,0.06)",
                                    background: "rgba(15,15,15,0.8)",
                                }}
                                onClick={() => setActive(active === card.key ? null : card.key)}
                                onMouseEnter={() => setHovered(card.key)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                {/* Character image anchored at bottom */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[90%] flex justify-center items-end pointer-events-none z-[1]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        className="max-h-full max-w-full object-contain object-bottom transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                                        style={{
                                            filter: isActive ? "saturate(1.1) brightness(1)" : "saturate(0.7) brightness(0.8)",
                                            transform: isActive ? "scale(1) translateY(0)" : "scale(0.85) translateY(20px)",
                                        }}
                                    />
                                </div>

                                {/* Info overlay (visible on hover/active) */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 z-[2] p-6 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                    style={{
                                        background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6) 60%, transparent)",
                                        opacity: isActive ? 1 : 0,
                                        transform: isActive ? "translateY(0)" : "translateY(20px)",
                                    }}
                                >
                                    <h3 className="font-heading text-4xl text-white tracking-wider mb-1">{card.name}</h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: card.color, boxShadow: `0 0 8px ${card.color}` }}
                                        />
                                        <span className="text-xs tracking-widest" style={{ color: card.color }}>
                                            EARTH-616
                                        </span>
                                    </div>
                                    <p
                                        className="text-white/60 text-sm leading-relaxed pl-3 mb-4"
                                        style={{ borderLeft: `2px solid ${card.color}` }}
                                    >
                                        &ldquo;{card.quote}&rdquo;
                                    </p>
                                    <span className="font-heading text-sm tracking-widest" style={{ color: active === card.key ? card.color : "white" }}>
                                        {active === card.key ? "● ACTIVE" : "SELECT →"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Responsive fallback for mobile */}
            <style>{`
                @media (max-width: 1024px) {
                    .flex.h-\\[550px\\] { flex-direction: column !important; height: auto !important; }
                    .flex.h-\\[550px\\] > div { flex: none !important; height: 200px; }
                    .flex.h-\\[550px\\] > div:hover { height: 350px; }
                }
            `}</style>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: CHARACTER DATABASE GRID
   ═════════════════════════════════════════════════════════════ */
function CharacterDatabase() {
    const [search, setSearch] = useState("");
    const [activeTeam, setActiveTeam] = useState("All");

    const filtered = useMemo(() => {
        return charDB.filter((c) => {
            const matchSearch =
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.alias.toLowerCase().includes(search.toLowerCase());
            const matchTeam = activeTeam === "All" || c.team === activeTeam;
            return matchSearch && matchTeam;
        });
    }, [search, activeTeam]);

    return (
        <section className="relative py-24 overflow-hidden" style={{ background: "#050505" }}>
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-10 h-0.5 bg-marvel-red" />
                        <span className="font-heading text-sm tracking-[3px] text-marvel-red">MARVEL DATABASE</span>
                    </div>
                    <h2 className="font-heading text-5xl md:text-7xl text-white tracking-wider mb-2">CHARACTERS</h2>
                    <p className="text-white/40">{charDB.length} heroes, villains, and legends</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 mb-8 border-b border-white/5">
                    {/* Search */}
                    <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-lg px-4 py-3 min-w-[300px] focus-within:border-marvel-red transition-colors">
                        <Search size={18} className="text-white/40 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search characters..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none text-white outline-none w-full text-sm placeholder:text-white/30"
                        />
                    </div>

                    {/* Team filters */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setActiveTeam("All")}
                            className={`px-4 py-2 text-xs font-heading tracking-widest rounded border transition-all ${activeTeam === "All"
                                    ? "bg-marvel-red border-marvel-red text-white"
                                    : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30"
                                }`}
                        >
                            ALL
                        </button>
                        {allTeams.map((team) => (
                            <button
                                key={team}
                                onClick={() => setActiveTeam(team)}
                                className={`px-4 py-2 text-xs font-heading tracking-widest rounded border transition-all ${activeTeam === team
                                        ? "bg-marvel-red border-marvel-red text-white"
                                        : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30"
                                    }`}
                            >
                                {team.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map((char) => (
                            <CharacterCard key={char.id} char={char} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filtered.length === 0 && (
                    <div className="text-center py-24">
                        <h3 className="font-heading text-3xl text-white/30 tracking-widest mb-2">NO HEROES FOUND</h3>
                        <p className="text-white/20">Try a different search or filter.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   CHARACTER CARD (grid item)
   ═════════════════════════════════════════════════════════════ */
function CharacterCard({ char }: { char: CharDBEntry }) {
    const [hovered, setHovered] = useState(false);

    // Check if this character exists in our data/characters.ts for linking
    const hasDetailPage = characters.some((c) => c.id === char.id);

    const card = (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="relative h-[380px] rounded-xl overflow-hidden cursor-pointer border transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{
                ["--char-color" as string]: char.color,
                background: "rgba(15,15,15,0.8)",
                borderColor: hovered ? char.color : "rgba(255,255,255,0.06)",
                transform: hovered ? "translateY(-8px)" : "translateY(0)",
                boxShadow: hovered
                    ? `0 20px 40px rgba(0,0,0,0.5), 0 0 30px ${char.color}33`
                    : "none",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Image */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[85%] flex justify-center items-end pointer-events-none z-[1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={char.image}
                    alt={char.name}
                    className="max-h-full max-w-[90%] object-contain object-bottom transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                    style={{
                        filter: hovered ? "saturate(1.1) brightness(1)" : "saturate(0.6) brightness(0.7)",
                        transform: hovered ? "scale(1) translateY(0)" : "scale(0.9) translateY(10px)",
                    }}
                />
            </div>

            {/* Overlay */}
            <div
                className="absolute bottom-0 left-0 right-0 p-5 z-[2] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.5) 80%, transparent)",
                    transform: hovered ? "translateY(0)" : "translateY(40px)",
                }}
            >
                <span className="text-[10px] font-heading tracking-widest" style={{ color: char.color }}>
                    {char.team.toUpperCase()}
                </span>
                <h3 className="font-heading text-2xl text-white tracking-wider my-1">{char.name}</h3>
                <p className="text-xs text-white/50 mb-3">{char.alias}</p>

                {/* Power stats */}
                <div
                    className="flex flex-col gap-1.5 transition-all duration-400"
                    style={{
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? "translateY(0)" : "translateY(10px)",
                        transitionDelay: hovered ? "150ms" : "0ms",
                    }}
                >
                    {(["strength", "intelligence", "speed", "durability"] as const).map((stat) => (
                        <div key={stat} className="flex items-center gap-2">
                            <span className="text-[10px] font-heading tracking-wider text-white/50 w-7 uppercase">
                                {stat.slice(0, 3)}
                            </span>
                            <div className="flex-1 h-[3px] bg-white/10 rounded-sm overflow-hidden">
                                <div
                                    className="h-full rounded-sm transition-all duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                                    style={{
                                        backgroundColor: char.color,
                                        width: hovered ? `${char.powers[stat]}%` : "0%",
                                        transitionDelay: hovered ? "300ms" : "0ms",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    if (hasDetailPage) {
        return <Link href={`/characters/${char.id}`}>{card}</Link>;
    }
    return card;
}
