"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import CharacterCard from "@/components/CharacterCard";
import { characters, getFactions, getPowerTypes, type Faction, type PowerType } from "@/data/characters";
import { staggerContainer } from "@/lib/animations";

export default function CharactersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
    const [selectedPowerType, setSelectedPowerType] = useState<PowerType | null>(null);

    const factions = getFactions();
    const powerTypes = getPowerTypes();

    const filtered = useMemo(() => {
        return characters.filter((c) => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matches =
                    c.name.toLowerCase().includes(q) ||
                    c.alias.toLowerCase().includes(q) ||
                    c.realName.toLowerCase().includes(q);
                if (!matches) return false;
            }
            if (selectedFaction && !c.factions.includes(selectedFaction)) return false;
            if (selectedPowerType && !c.powerTypes.includes(selectedPowerType)) return false;
            return true;
        });
    }, [searchQuery, selectedFaction, selectedPowerType]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedFaction(null);
        setSelectedPowerType(null);
    };

    const hasFilters = searchQuery || selectedFaction || selectedPowerType;

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
                        CHARACTER <span className="text-marvel-red">ROSTER</span>
                    </h1>
                    <p className="text-white/40 max-w-lg">
                        Heroes, villains, and everyone in between. Hover to reveal character details.
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="glass rounded-xl p-4 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search characters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 bg-transparent text-sm text-white border border-white/10 rounded-lg focus:border-marvel-red focus:outline-none placeholder:text-white/20"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                                    aria-label="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Faction Filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-white/40 uppercase tracking-wider">Team:</span>
                            {factions.slice(0, 6).map((faction) => (
                                <button
                                    key={faction}
                                    onClick={() => setSelectedFaction(selectedFaction === faction ? null : faction)}
                                    className={`px-3 py-1 text-xs rounded-full border transition-all ${selectedFaction === faction
                                            ? "bg-marvel-red border-marvel-red text-white"
                                            : "border-white/10 text-white/50 hover:border-white/30"
                                        }`}
                                >
                                    {faction}
                                </button>
                            ))}
                        </div>

                        {/* Power Type Filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-white/40 uppercase tracking-wider">Power:</span>
                            <select
                                value={selectedPowerType || ""}
                                onChange={(e) => setSelectedPowerType((e.target.value || null) as PowerType | null)}
                                className="bg-transparent text-xs text-white/60 border border-white/10 rounded-lg px-3 py-1.5 focus:border-marvel-red focus:outline-none"
                            >
                                <option value="" className="bg-black">All</option>
                                {powerTypes.map((pt) => (
                                    <option key={pt} value={pt} className="bg-black">{pt}</option>
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
                    {filtered.length} character{filtered.length !== 1 ? "s" : ""}
                </div>

                {/* Character Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    key={`${selectedFaction}-${selectedPowerType}-${searchQuery}`}
                >
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            layout
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                        >
                            {filtered.map((character, i) => (
                                <CharacterCard
                                    key={character.id}
                                    character={character}
                                    index={i}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-white/40 text-lg">No characters match your search.</p>
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
