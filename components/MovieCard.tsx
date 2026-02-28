"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { staggerItem } from "@/lib/animations";
import { audioManager } from "@/lib/audio";
import type { Movie } from "@/data/movies";

interface MovieCardProps {
    movie: Movie;
    index?: number;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
    return (
        <motion.div
            variants={staggerItem}
            custom={index}
            className="group relative gpu-accelerated"
            onMouseEnter={() => audioManager.playHover()}
        >
            <Link href={`/movies/${movie.id}`} className="block" aria-label={`View details for ${movie.title}`}>
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#0a0a0a]">
                    {/* Poster Image */}
                    <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        fill
                        unoptimized={true}
                        onError={(e) => {
                            e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                            e.currentTarget.className = "object-contain p-4 opacity-50 transition-transform duration-700 ease-out group-hover:scale-110";
                        }}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Red glow border on hover */}
                    <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-marvel-red/50 group-hover:glow-red transition-all duration-500" />

                    {/* Phase badge */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold bg-black/60 backdrop-blur-sm rounded text-white/80 border border-white/10">
                        Phase {movie.phase}
                    </div>

                    {/* Year badge */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 text-xs font-bold bg-marvel-red/80 backdrop-blur-sm rounded text-white">
                        {movie.year}
                    </div>

                    {/* Content revealed on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="font-heading text-xl md:text-2xl text-white tracking-wide leading-tight mb-1">
                            {movie.title}
                        </h3>
                        <p className="text-xs text-white/50 mb-2">{movie.director}</p>
                        <div className="flex gap-1 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {movie.genre.slice(0, 3).map((g) => (
                                <span
                                    key={g}
                                    className="text-[10px] px-2 py-0.5 rounded-full border border-white/20 text-white/60"
                                >
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
