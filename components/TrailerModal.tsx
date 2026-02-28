"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TrailerModalProps {
    trailerUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function TrailerModal({ trailerUrl, isOpen, onClose }: TrailerModalProps) {
    if (!trailerUrl) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-marvel-red/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            src={`${trailerUrl}?autoplay=1&rel=0`}
                            title="Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                        />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-marvel-red/80 transition-all"
                            aria-label="Close trailer"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
