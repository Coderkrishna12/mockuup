"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import MovieCard from "@/components/MovieCard";
import { movies, getPhases, getGenres } from "@/data/movies";
import { staggerContainer } from "@/lib/animations";

export default function MoviesPage() {
    const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const allPhases = getPhases();
    const allGenres = getGenres();
    const years = useMemo(() => {
        const uniqueYears = [...new Set(movies.map((m) => m.year))].sort();
        return uniqueYears;
    }, []);

    const filtered = useMemo(() => {
        return movies.filter((m) => {
            if (selectedPhase && m.phase !== selectedPhase) return false;
            if (selectedGenre && !m.genre.includes(selectedGenre)) return false;
            if (selectedYear && m.year !== selectedYear) return false;
            return true;
        });
    }, [selectedPhase, selectedGenre, selectedYear]);

    const clearFilters = () => {
        setSelectedPhase(null);
        setSelectedGenre(null);
        setSelectedYear(null);
    };

    const hasFilters = selectedPhase || selectedGenre || selectedYear;

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10"
                >
                    <h1 className="font-heading text-5xl md:text-7xl text-white tracking-wider mb-2">
                        MCU <span className="text-marvel-red">MOVIES</span>
                    </h1>
                    <p className="text-white/40 max-w-lg">
                        Every film in the Marvel Cinematic Universe, from the beginning to the Multiverse Saga.
                    </p>
                </motion.div>

                {/* Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="glass rounded-xl p-4 mb-8"
                >
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Phase Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40 uppercase tracking-wider">Phase:</span>
                            <div className="flex gap-1">
                                {allPhases.map((phase) => (
                                    <button
                                        key={phase}
                                        onClick={() => setSelectedPhase(selectedPhase === phase ? null : phase)}
                                        className={`px-3 py-1 text-xs rounded-full border transition-all ${selectedPhase === phase
                                                ? "bg-marvel-red border-marvel-red text-white"
                                                : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                                            }`}
                                    >
                                        {phase}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-px h-6 bg-white/10 hidden md:block" />

                        {/* Genre Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40 uppercase tracking-wider">Genre:</span>
                            <select
                                value={selectedGenre || ""}
                                onChange={(e) => setSelectedGenre(e.target.value || null)}
                                className="bg-transparent text-xs text-white/60 border border-white/10 rounded-lg px-3 py-1.5 focus:border-marvel-red focus:outline-none"
                            >
                                <option value="" className="bg-black">All</option>
                                {allGenres.map((g) => (
                                    <option key={g} value={g} className="bg-black">{g}</option>
                                ))}
                            </select>
                        </div>

                        <div className="w-px h-6 bg-white/10 hidden md:block" />

                        {/* Year Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40 uppercase tracking-wider">Year:</span>
                            <select
                                value={selectedYear || ""}
                                onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                                className="bg-transparent text-xs text-white/60 border border-white/10 rounded-lg px-3 py-1.5 focus:border-marvel-red focus:outline-none"
                            >
                                <option value="" className="bg-black">All</option>
                                {years.map((y) => (
                                    <option key={y} value={y} className="bg-black">{y}</option>
                                ))}
                            </select>
                        </div>

                        {hasFilters && (
                            <>
                                <div className="w-px h-6 bg-white/10" />
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-marvel-red hover:text-white transition-colors"
                                >
                                    Clear all
                                </button>
                            </>
                        )}

                        <div className="ml-auto text-xs text-white/30">
                            {filtered.length} movie{filtered.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                </motion.div>

                {/* Movies Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
                >
                    {filtered.map((movie, i) => (
                        <MovieCard key={movie.id} movie={movie} index={i} />
                    ))}
                </motion.div>

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-white/40 text-lg">No movies match your filters.</p>
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
    );
}
