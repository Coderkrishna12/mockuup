"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { audioManager } from "@/lib/audio";
import type { Character } from "@/data/characters";

interface CharacterCardProps {
    character: Character;
    index?: number;
}

export default function CharacterCard({ character, index = 0 }: CharacterCardProps) {
    const maxStat = Math.max(
        character.stats.strength,
        character.stats.speed,
        character.stats.intelligence,
        character.stats.power,
        character.stats.combat,
        character.stats.durability
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="group relative gpu-accelerated"
            style={{ perspective: "1000px" }}
            onMouseEnter={() => audioManager.playHover()}
        >
            <Link href={`/characters/${character.id}`} className="block" aria-label={`View ${character.name}`}>
                <div className="relative h-[400px] md:h-[450px] rounded-lg overflow-hidden bg-[#0a0a0a] cursor-pointer">
                    {/* Front Face */}
                    <div className="absolute inset-0 transition-all duration-700 ease-out [backface-visibility:hidden] group-hover:[transform:rotateY(180deg)]">
                        {/* Portrait */}
                        <Image
                            src={character.imageUrl}
                            alt={character.name}
                            fill
                            onError={(e) => {
                                e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                                e.currentTarget.className = "object-contain p-6 opacity-40";
                            }}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                        {/* Faction badges */}
                        <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                            {character.factions.slice(0, 2).map((faction) => (
                                <span
                                    key={faction}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-marvel-red/80 backdrop-blur-sm text-white font-medium"
                                >
                                    {faction}
                                </span>
                            ))}
                        </div>

                        {/* Name & Alias */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-heading text-2xl text-white tracking-wider">
                                {character.name}
                            </h3>
                            <p className="text-xs text-marvel-gold/80">{character.alias}</p>

                            {/* Power Stats Preview */}
                            <div className="mt-3 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-white/40 w-12">PWR</span>
                                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-marvel-red rounded-full transition-all duration-1000"
                                            style={{ width: `${character.stats.power}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-white/40 w-12">STR</span>
                                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-marvel-gold rounded-full transition-all duration-1000"
                                            style={{ width: `${character.stats.strength}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back Face (revealed on hover) */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] group-hover:[transform:rotateY(0deg)] transition-all duration-700 ease-out bg-[#0a0a0a] p-5 flex flex-col">
                        {/* Header */}
                        <div className="mb-4">
                            <h3 className="font-heading text-2xl text-white tracking-wider">{character.name}</h3>
                            <p className="text-xs text-white/40">{character.realName}</p>
                        </div>

                        {/* Bio */}
                        <p className="text-xs text-white/60 leading-relaxed mb-4 line-clamp-3">
                            {character.bio}
                        </p>

                        {/* Stats */}
                        <div className="space-y-2 mb-4">
                            {Object.entries(character.stats).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2">
                                    <span className="text-[10px] text-white/40 w-14 uppercase">{key.slice(0, 3)}</span>
                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${value}%`,
                                                backgroundColor: value === maxStat ? "#FFD700" : "#ED1D24",
                                            }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-white/40 w-6 text-right">{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Powers */}
                        <div className="mt-auto">
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Abilities</p>
                            <div className="flex gap-1 flex-wrap">
                                {character.powers.slice(0, 3).map((power) => (
                                    <span
                                        key={power}
                                        className="text-[9px] px-2 py-0.5 rounded-full border border-white/10 text-white/50"
                                    >
                                        {power}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
