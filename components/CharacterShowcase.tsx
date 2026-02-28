"use client";

import { useRef, useState, useMemo } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { characters } from "@/data/characters";

/* ═══════════════════════════════════════════════════════════════
   HERO SHOWCASE DATA — each character gets a full-screen section
   ═════════════════════════════════════════════════════════════ */
const showcaseHeroes = [
    {
        id: "iron-man",
        name: "IRON MAN",
        subtitle: "THE ARMORED AVENGER",
        tag: "FOUNDING MEMBER",
        image: "/characters/renders/iron-man.png",
        gradient: "linear-gradient(135deg, #1a0000 0%, #2d0a0a 50%, #0a0000 100%)",
        accentColor: "#E8002D",
        quote: "I am Iron Man.",
        releaseInfo: "FIRST APPEARANCE: 2008",
        stats: { STR: 85, SPD: 70, INT: 100, PWR: 85 },
    },
    {
        id: "spider-man",
        name: "SPIDER-MAN",
        subtitle: "THE WEB-SLINGER",
        tag: "NEIGHBORHOOD HERO",
        image: "/characters/renders/spider-man-render.png",
        gradient: "linear-gradient(135deg, #1a0005 0%, #2d0a15 50%, #0a0005 100%)",
        accentColor: "#DC2626",
        quote: "With great power comes great responsibility.",
        releaseInfo: "FIRST APPEARANCE: 2016",
        stats: { STR: 75, SPD: 80, INT: 85, PWR: 70 },
    },
    {
        id: "thor",
        name: "THOR",
        subtitle: "GOD OF THUNDER",
        tag: "ASGARDIAN AVENGER",
        image: "/characters/renders/thor.png",
        gradient: "linear-gradient(135deg, #0a0a1a 0%, #0a1428 50%, #050a14 100%)",
        accentColor: "#1A5B9C",
        quote: "Bring me Thanos!",
        releaseInfo: "FIRST APPEARANCE: 2011",
        stats: { STR: 95, SPD: 70, INT: 60, PWR: 100 },
    },
    {
        id: "captain-america",
        name: "CAPTAIN AMERICA",
        subtitle: "THE FIRST AVENGER",
        tag: "SYMBOL OF FREEDOM",
        image: "/characters/renders/captain-america.png",
        gradient: "linear-gradient(135deg, #0a0a14 0%, #0a1428 50%, #050a14 100%)",
        accentColor: "#1E3A8A",
        quote: "I can do this all day.",
        releaseInfo: "FIRST APPEARANCE: 2011",
        stats: { STR: 80, SPD: 65, INT: 70, PWR: 65 },
    },
    {
        id: "doctor-strange",
        name: "DOCTOR STRANGE",
        subtitle: "SORCERER SUPREME",
        tag: "MASTER OF MYSTIC ARTS",
        image: "/characters/renders/doctor-strange.png",
        gradient: "linear-gradient(135deg, #0a0512 0%, #1a0a28 50%, #050512 100%)",
        accentColor: "#8B5CF6",
        quote: "We're in the endgame now.",
        releaseInfo: "FIRST APPEARANCE: 2016",
        stats: { STR: 40, SPD: 50, INT: 95, PWR: 98 },
    },
    {
        id: "black-panther",
        name: "BLACK PANTHER",
        subtitle: "KING OF WAKANDA",
        tag: "WAKANDA FOREVER",
        image: "/characters/renders/black-panther.png",
        gradient: "linear-gradient(135deg, #0a0512 0%, #140a1e 50%, #050512 100%)",
        accentColor: "#7C3AED",
        quote: "Wakanda forever!",
        releaseInfo: "FIRST APPEARANCE: 2016",
        stats: { STR: 75, SPD: 72, INT: 90, PWR: 70 },
    },
    {
        id: "thanos",
        name: "THANOS",
        subtitle: "THE MAD TITAN",
        tag: "THE ULTIMATE VILLAIN",
        image: "/characters/renders/thanos.png",
        gradient: "linear-gradient(135deg, #140a1a 0%, #1a0a28 50%, #0a0514 100%)",
        accentColor: "#F0C040",
        quote: "I am inevitable.",
        releaseInfo: "FIRST APPEARANCE: 2012",
        stats: { STR: 100, SPD: 50, INT: 85, PWR: 100 },
    },
    {
        id: "hulk",
        name: "HULK",
        subtitle: "THE INCREDIBLE HULK",
        tag: "STRONGEST AVENGER",
        image: "/characters/renders/hulk.png",
        gradient: "linear-gradient(135deg, #001a00 0%, #0a1a0a 50%, #000a00 100%)",
        accentColor: "#166534",
        quote: "Hulk smash!",
        releaseInfo: "FIRST APPEARANCE: 2008",
        stats: { STR: 100, SPD: 55, INT: 95, PWR: 95 },
    },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════════ */
export default function CharacterShowcase() {
    return (
        <>
            {/* Section intro header */}
            <div className="relative z-10 py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-marvel-red" />
                            <span className="font-heading text-sm tracking-[4px] text-marvel-red">SCROLL TO EXPLORE</span>
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-marvel-red" />
                        </div>
                        <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white tracking-wider">
                            EARTH&apos;S MIGHTIEST <span className="text-marvel-red">HEROES</span>
                        </h2>
                    </motion.div>
                </div>
            </div>

            {/* Full-screen hero cinematic sections */}
            {showcaseHeroes.map((hero, index) => (
                <HeroSection key={hero.id} hero={hero} index={index} />
            ))}

            {/* Character database grid */}
            <CharacterDatabase />
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════
   FULL-SCREEN HERO SECTION — one per character, cinematic promo style
   ═════════════════════════════════════════════════════════════ */
function HeroSection({
    hero,
    index,
}: {
    hero: (typeof showcaseHeroes)[number];
    index: number;
}) {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.15, 0.45, 0.75, 1], [0, 1, 1, 1, 0]);
    const isEven = index % 2 === 0;

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[100svh] flex items-center py-20 lg:py-0 overflow-hidden"
            style={{ background: hero.gradient }}
        >
            {/* Ambient glow */}
            <div
                className="absolute pointer-events-none transition-opacity duration-1000"
                style={{
                    top: "20%",
                    [isEven ? "right" : "left"]: "5%",
                    width: "60vw",
                    height: "60vw",
                    background: `radial-gradient(circle, ${hero.accentColor}15 0%, transparent 55%)`,
                    filter: "blur(80px)",
                    opacity: isInView ? 1 : 0,
                }}
            />

            {/* Top accent line */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${hero.accentColor}50, transparent)` }}
            />

            {/* Large background text watermark */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
                <span
                    className="font-heading text-[18vw] leading-none tracking-[0.1em] opacity-[0.03] whitespace-nowrap"
                    style={{ color: hero.accentColor }}
                >
                    {hero.name}
                </span>
            </div>

            <motion.div style={{ opacity }} className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12">
                <div className={`grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-4 ${!isEven ? "lg:[direction:rtl]" : ""}`}>
                    {/* Text Side */}
                    <motion.div
                        style={{ y: textY }}
                        className={`flex flex-col gap-4 md:gap-5 ${!isEven ? "lg:[direction:ltr]" : ""}`}
                    >
                        {/* Tag */}
                        <motion.span
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="font-heading text-sm tracking-[3px] flex items-center gap-3"
                            style={{ color: hero.accentColor }}
                        >
                            <span className="w-8 h-0.5 inline-block" style={{ backgroundColor: hero.accentColor }} />
                            {hero.tag}
                        </motion.span>

                        {/* Name — huge, split into lines */}
                        <motion.h2
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-wider leading-[0.85]"
                        >
                            {hero.name.split(" ").map((word, i) => (
                                <span key={i} className="block">
                                    {i > 0 ? <span style={{ color: hero.accentColor }}>{word}</span> : word}
                                </span>
                            ))}
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-white/35 text-base md:text-lg tracking-[4px] uppercase"
                        >
                            {hero.subtitle}
                        </motion.p>

                        {/* Quote */}
                        <motion.blockquote
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="text-white/50 text-base md:text-lg italic pl-4 max-w-md"
                            style={{ borderLeft: `3px solid ${hero.accentColor}` }}
                        >
                            &ldquo;{hero.quote}&rdquo;
                        </motion.blockquote>

                        {/* Stat pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="flex flex-wrap gap-4 md:gap-5 mt-2"
                        >
                            {Object.entries(hero.stats).map(([key, value]) => (
                                <div key={key} className="text-center">
                                    <div
                                        className="font-heading text-3xl md:text-4xl tracking-wider"
                                        style={{ color: value >= 90 ? hero.accentColor : "white" }}
                                    >
                                        {value}
                                    </div>
                                    <div className="text-[10px] text-white/40 tracking-[3px] mt-1">{key}</div>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="flex items-center gap-5 mt-4"
                        >
                            <Link
                                href={`/characters/${hero.id}`}
                                className="group relative inline-flex items-center gap-2 px-8 py-3.5 font-heading text-white text-base tracking-widest transition-all hover:-translate-y-1"
                                style={{
                                    backgroundColor: hero.accentColor,
                                    clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                                    boxShadow: `0 10px 40px ${hero.accentColor}50`,
                                }}
                            >
                                EXPLORE HERO
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </Link>
                            <span className="text-xs text-white/25 tracking-[2px]">{hero.releaseInfo}</span>
                        </motion.div>
                    </motion.div>

                    {/* Character Render Side */}
                    <motion.div
                        style={{ y: imageY }}
                        className={`flex justify-center items-end ${!isEven ? "lg:[direction:ltr]" : ""}`}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.75, x: isEven ? 100 : -100 }}
                            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.75, x: isEven ? 100 : -100 }}
                            transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                            className="relative"
                        >
                            {/* Glow behind character */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle at center 60%, ${hero.accentColor}12 0%, transparent 50%)`,
                                }}
                            />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={hero.image}
                                alt={hero.name}
                                className="relative z-10 max-h-[50vh] md:max-h-[75vh] w-auto object-contain mx-auto"
                                style={{
                                    filter: `drop-shadow(0 0 60px ${hero.accentColor}25) drop-shadow(0 20px 40px rgba(0,0,0,0.6))`,
                                }}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none" />
            {/* Top fade from previous section */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#050505] to-transparent z-20 pointer-events-none" />
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   CHARACTER DATABASE DATA
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
   CHARACTER DATABASE GRID
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
                <div className="mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-10 h-0.5 bg-marvel-red" />
                        <span className="font-heading text-sm tracking-[3px] text-marvel-red">MARVEL DATABASE</span>
                    </div>
                    <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl text-white tracking-wider mb-2">CHARACTERS</h2>
                    <p className="text-white/40">{charDB.length} heroes, villains, and legends</p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 mb-8 border-b border-white/5">
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

                <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((char) => (
                            <CharacterGridCard key={char.id} char={char} />
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
   CHARACTER GRID CARD
   ═════════════════════════════════════════════════════════════ */
function CharacterGridCard({ char }: { char: CharDBEntry }) {
    const [hovered, setHovered] = useState(false);
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
                background: "rgba(15,15,15,0.8)",
                borderColor: hovered ? char.color : "rgba(255,255,255,0.06)",
                transform: hovered ? "translateY(-8px)" : "translateY(0)",
                boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.5), 0 0 30px ${char.color}33` : "none",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
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
            <div
                className="absolute bottom-0 left-0 right-0 p-5 z-[2] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.5) 80%, transparent)",
                    transform: hovered ? "translateY(0)" : "translateY(40px)",
                }}
            >
                <span className="text-[10px] font-heading tracking-widest" style={{ color: char.color }}>{char.team.toUpperCase()}</span>
                <h3 className="font-heading text-2xl text-white tracking-wider my-1">{char.name}</h3>
                <p className="text-xs text-white/50 mb-3">{char.alias}</p>
                <div
                    className="flex flex-col gap-1.5 transition-all"
                    style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(10px)", transitionDelay: hovered ? "150ms" : "0ms", transitionDuration: "400ms" }}
                >
                    {(["strength", "intelligence", "speed", "durability"] as const).map((stat) => (
                        <div key={stat} className="flex items-center gap-2">
                            <span className="text-[10px] font-heading tracking-wider text-white/50 w-7 uppercase">{stat.slice(0, 3)}</span>
                            <div className="flex-1 h-[3px] bg-white/10 rounded-sm overflow-hidden">
                                <div
                                    className="h-full rounded-sm"
                                    style={{
                                        backgroundColor: char.color,
                                        width: hovered ? `${char.powers[stat]}%` : "0%",
                                        transitionDelay: hovered ? "300ms" : "0ms",
                                        transitionDuration: "800ms",
                                        transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    if (hasDetailPage) return <Link href={`/characters/${char.id}`}>{card}</Link>;
    return card;
}