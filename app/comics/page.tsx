"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, BookOpen } from "lucide-react";
import { comics, getComicEras } from "@/data/comics";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function ComicsPage() {
    const [search, setSearch] = useState("");
    const [selectedEra, setSelectedEra] = useState<string | null>(null);
    const eras = getComicEras();

    const filtered = useMemo(() => {
        return comics.filter((c) => {
            if (selectedEra && c.era !== selectedEra) return false;
            if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.writer.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [search, selectedEra]);

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <h1 className="font-heading text-5xl md:text-7xl text-white tracking-wider mb-2">
                        MARVEL <span className="text-marvel-red">COMICS</span>
                    </h1>
                    <p className="text-white/40 max-w-lg">
                        Explore the legendary comics that built the Marvel Universe. From Golden Age origins to modern masterpieces.
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-xl p-4 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        {/* Search */}
                        <div className="relative flex-1 max-w-xs">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search comics..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent text-sm text-white/70 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 focus:border-marvel-red focus:outline-none"
                            />
                        </div>

                        {/* Era filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-white/40 uppercase tracking-wider">Era:</span>
                            {eras.map((era) => (
                                <button
                                    key={era}
                                    onClick={() => setSelectedEra(selectedEra === era ? null : era)}
                                    className={`px-3 py-1 text-xs rounded-full border transition-all ${selectedEra === era
                                        ? "bg-marvel-red border-marvel-red text-white"
                                        : "border-white/10 text-white/50 hover:border-white/30"
                                        }`}
                                >
                                    {era}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="text-xs text-white/30 mb-4">{filtered.length} comic{filtered.length !== 1 ? "s" : ""}</div>

                {/* Comics Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    key={`${selectedEra}-${search}`}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
                >
                    {filtered.map((comic) => (
                        <motion.div key={comic.id} variants={staggerItem}>
                            <Link
                                href={`/comics/${comic.id}`}
                                className="group block"
                            >
                                <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-white/5 group-hover:border-marvel-red/30 transition-all duration-300">
                                    <Image
                                        src={comic.coverUrl}
                                        alt={comic.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            e.currentTarget.src = "/marvel-logo.svg";
                                            e.currentTarget.className = "object-contain p-8 opacity-30";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />

                                    {/* Era badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-white/70">
                                            {comic.era}
                                        </span>
                                    </div>

                                    {/* Year badge */}
                                    <div className="absolute top-2 right-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-marvel-red text-white">
                                            {comic.year}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <h3 className="font-heading text-sm text-white leading-tight mb-0.5">
                                            {comic.title}
                                        </h3>
                                        <p className="text-[10px] text-white/40">{comic.writer}</p>
                                    </div>

                                    {/* Hover icon */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-12 h-12 rounded-full bg-marvel-red/80 backdrop-blur-sm flex items-center justify-center">
                                            <BookOpen size={20} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-white/40 text-lg">No comics match your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
