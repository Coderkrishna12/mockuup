"use client";

import { motion } from "framer-motion";

interface SkeletonCardProps {
    className?: string;
    aspectRatio?: "poster" | "landscape" | "square";
}

export default function SkeletonCard({ className = "", aspectRatio = "poster" }: SkeletonCardProps) {
    const aspectClass = {
        poster: "aspect-[2/3]",
        landscape: "aspect-video",
        square: "aspect-square",
    }[aspectRatio];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`relative ${aspectClass} rounded-lg overflow-hidden bg-white/5 ${className}`}
        >
            <div className="absolute inset-0 skeleton-shimmer" />
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4 skeleton-shimmer" />
                <div className="h-3 bg-white/10 rounded w-1/2 skeleton-shimmer" />
            </div>
        </motion.div>
    );
}

export function SkeletonGrid({ count = 10, aspectRatio = "poster" as const }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} aspectRatio={aspectRatio} />
            ))}
        </div>
    );
}
