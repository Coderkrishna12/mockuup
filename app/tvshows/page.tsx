"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import TVShowCard from "@/components/TVShowCard";
import CinematicHero3D from "@/components/CinematicHero3D";
import { tvShows, getShowPhases, getShowGenres } from "@/data/tvshows";
import { staggerContainer } from "@/lib/animations";

export default function TVShowsPage() {
    const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

    const phases = getShowPhases();
    const genres = getShowGenres();

    const filtered = useMemo(() => {
        return tvShows.filter((s) => {
            if (selectedPhase && s.phase !== selectedPhase) return false;
            if (selectedGenre && !s.genre.includes(selectedGenre)) return false;
            return true;
        });
    }, [selectedPhase, selectedGenre]);

    const clearFilters = () => {
        setSelectedPhase(null);
        setSelectedGenre(null);
    };

    const hasFilters = selectedPhase || selectedGenre;

    return (
        <div className="min-h-screen">
            {/* ═══ CINEMATIC HERO ═══ */}
            <CinematicHero3D
                characterImg="https://image.tmdb.org/t/p/original/78lPtwv72eTNqFW9COBYI0dWDJa.jpg"
                titlePrefix="STREAM THE"
                titleMain="MARVEL UNIVERSE"
                subtitle="Every series. Every saga. From WandaVision to Secret Invasion — experience the MCU's expanding universe on Disney+."
                primaryCTAText="Browse Shows"
                primaryCTALink="#shows"
                secondaryCTAText="Explore Movies"
                secondaryCTALink="/movies"
                stats={[
                    { val: "15+", label: "Series" },
                    { val: "100+", label: "Episodes" },
                    { val: "5", label: "Phases" },
                ]}
                anchorId="shows"
                accentColor="#ED1D24"
                showArcReactor={true}
            />

            {/* ═══ EXISTING TV SHOWS GRID (unchanged) ═══ */}
            <div id="shows" className="pt-20 md:pt-24 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-10"
                    >
                        <h1 className="font-heading text-5xl md:text-7xl text-white tracking-wider mb-2">
                            MARVEL <span className="text-marvel-red">TV SHOWS</span>
                        </h1>
                        <p className="text-white/40 max-w-lg">
                            Explore the expanding MCU through Disney+ series. From sitcom mysteries to cosmic adventures.
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass rounded-xl p-4 mb-8"
                    >
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            {/* Phase Filter */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-white/40 uppercase tracking-wider">Phase:</span>
                                {phases.map((phase) => (
                                    <button
                                        key={phase}
                                        onClick={() => setSelectedPhase(selectedPhase === phase ? null : phase)}
                                        className={`px-3 py-1 text-xs rounded-full border transition-all ${selectedPhase === phase
                                            ? "bg-marvel-red border-marvel-red text-white"
                                            : "border-white/10 text-white/50 hover:border-white/30"
                                            }`}
                                    >
                                        Phase {phase}
                                    </button>
                                ))}
                            </div>

                            {/* Genre Filter */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-white/40 uppercase tracking-wider">Genre:</span>
                                <select
                                    value={selectedGenre || ""}
                                    onChange={(e) => setSelectedGenre(e.target.value || null)}
                                    className="bg-transparent text-xs text-white/60 border border-white/10 rounded-lg px-3 py-1.5 focus:border-marvel-red focus:outline-none"
                                >
                                    <option value="" className="bg-black">All</option>
                                    {genres.map((g) => (
                                        <option key={g} value={g} className="bg-black">{g}</option>
                                    ))}
                                </select>
                            </div>

                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-marvel-red hover:text-white transition-colors whitespace-nowrap"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Results count */}
                    <div className="text-xs text-white/30 mb-4">
                        {filtered.length} show{filtered.length !== 1 ? "s" : ""}
                    </div>

                    {/* TV Show Grid */}
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        key={`${selectedPhase}-${selectedGenre}`}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
                    >
                        {filtered.map((show, i) => (
                            <TVShowCard key={show.id} show={show} index={i} />
                        ))}
                    </motion.div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-white/40 text-lg">No shows match your filters.</p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-marvel-red hover:text-white transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
