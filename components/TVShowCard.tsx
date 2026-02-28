"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { audioManager } from "@/lib/audio";
import type { TVShow } from "@/data/tvshows";

interface TVShowCardProps {
    show: TVShow;
    index?: number;
}

export default function TVShowCard({ show, index = 0 }: TVShowCardProps) {
    const statusColor =
        show.status === "Ongoing"
            ? "bg-green-500"
            : show.status === "Upcoming"
                ? "bg-yellow-500"
                : "bg-white/20";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="group relative gpu-accelerated"
            onMouseEnter={() => audioManager.playHover()}
        >
            <Link href={`/tvshows/${show.id}`} className="block" aria-label={`View ${show.title}`}>
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-marvel-red/30 transition-all duration-500">
                    {/* Poster Image */}
                    <Image
                        src={show.posterUrl}
                        alt={show.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                            e.currentTarget.className = "object-contain p-8 opacity-30";
                        }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Phase & Year badge */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white/70 border border-white/10">
                            Phase {show.phase}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-marvel-red/80 backdrop-blur-sm text-white font-medium">
                            {show.year}
                        </span>
                    </div>

                    {/* Status badge */}
                    {show.status !== "Completed" && (
                        <div className="absolute top-10 left-3">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full text-white font-bold uppercase tracking-wider ${statusColor}`}>
                                {show.status}
                            </span>
                        </div>
                    )}

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-heading text-lg md:text-xl text-white tracking-wider leading-tight group-hover:text-marvel-red transition-colors">
                            {show.title}
                        </h3>
                        <p className="text-[11px] text-white/40 mt-1">
                            {show.creator}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] text-white/30">
                                {show.seasons}S • {show.episodes}E
                            </span>
                            <span className="text-[10px] text-white/20">
                                {show.episodeRuntime}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
