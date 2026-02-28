"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Volume2, VolumeX, Mic } from "lucide-react";
import { getDialogueForCharacter, type DialogueLine } from "@/data/characterDialogues";
import type { Character } from "@/data/characters";

interface Props {
    character: Character;
    universeColor: string;
    onClose: () => void;
    onOpenAR?: () => void;
}

export default function CharacterInteractionPanel({ character, universeColor, onClose, onOpenAR }: Props) {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [subtitle, setSubtitle] = useState<string | null>(null);
    const [waveform, setWaveform] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const dialogue = getDialogueForCharacter(character.id);

    const hasMask = [
        "iron-man", "spider-man", "captain-america", "thor", "hulk",
        "black-panther", "doctor-strange", "thanos", "ant-man", "war-machine",
    ].includes(character.id);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setPlayingId(null);
        setSubtitle(null);
        setWaveform(false);
    }, []);

    const playLine = useCallback((line: DialogueLine) => {
        stopAudio();

        const audio = new Audio(line.audioFile);
        audioRef.current = audio;
        setPlayingId(line.id);
        setSubtitle(line.subtitle);
        setWaveform(true);

        audio.play().catch(() => {
            // If audio fails, still show subtitle briefly
            setTimeout(() => {
                setPlayingId(null);
                setSubtitle(null);
                setWaveform(false);
            }, 2500);
        });

        audio.onended = () => {
            setWaveform(false);
            setTimeout(() => {
                setPlayingId(null);
                setSubtitle(null);
            }, 800);
        };
    }, [stopAudio]);

    useEffect(() => {
        return () => stopAudio();
    }, [stopAudio]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[70] max-h-[80vh] overflow-y-auto"
            style={{
                background: `linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%)`,
                borderTop: `2px solid ${universeColor}40`,
                boxShadow: `0 -20px 60px rgba(0,0,0,0.8), 0 -4px 30px ${universeColor}20`,
            }}
        >
            {/* Top glow bar */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${universeColor}, transparent)` }}
            />

            <div className="max-w-4xl mx-auto px-6 py-6">
                {/* Header */}
                <div className="flex items-start gap-5 mb-6">
                    {/* Mask preview */}
                    <div className="relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-white/10">
                        <Image
                            src={hasMask ? `/characters/masks/${character.id}.png` : `/characters/poses/${character.id}.png`}
                            alt={character.name}
                            fill
                            className="object-contain p-1"
                            onError={(e) => {
                                e.currentTarget.src = character.imageUrl;
                                e.currentTarget.className = "object-cover";
                            }}
                        />
                        {/* Glow */}
                        <div
                            className="absolute inset-0 rounded-2xl"
                            style={{ boxShadow: `inset 0 0 20px ${universeColor}30` }}
                        />
                    </div>

                    {/* Character info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-2xl md:text-3xl text-white tracking-wider leading-tight">
                            {character.name}
                        </h3>
                        <p className="text-xs text-white/40 mt-0.5">{character.alias}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {character.factions.slice(0, 3).map((t) => (
                                <span
                                    key={t}
                                    className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/40"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {hasMask && onOpenAR && (
                            <button
                                onClick={() => { stopAudio(); onOpenAR(); }}
                                className="px-4 py-2 rounded-xl text-xs font-medium transition-all border"
                                style={{
                                    borderColor: `${universeColor}60`,
                                    color: universeColor,
                                    background: `${universeColor}10`,
                                }}
                            >
                                🥽 AR Mask
                            </button>
                        )}
                        <button
                            onClick={() => { stopAudio(); onClose(); }}
                            className="p-2 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Dialogue Grid */}
                {dialogue && dialogue.lines.length > 0 ? (
                    <div className="mb-4">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <Volume2 size={10} /> Iconic Dialogues
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {dialogue.lines.map((line) => {
                                const isPlaying = playingId === line.id;
                                return (
                                    <button
                                        key={line.id}
                                        onClick={() => isPlaying ? stopAudio() : playLine(line)}
                                        className="relative text-left px-4 py-3 rounded-xl border text-xs font-medium transition-all overflow-hidden group"
                                        style={{
                                            borderColor: isPlaying ? universeColor : "rgba(255,255,255,0.08)",
                                            background: isPlaying ? `${universeColor}15` : "rgba(255,255,255,0.03)",
                                            color: isPlaying ? universeColor : "rgba(255,255,255,0.7)",
                                        }}
                                    >
                                        {/* Waveform background animation */}
                                        {isPlaying && (
                                            <div className="absolute inset-0 flex items-end justify-center gap-[2px] px-2 py-1 opacity-20">
                                                {Array.from({ length: 20 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-[3px] rounded-full"
                                                        style={{
                                                            backgroundColor: universeColor,
                                                            height: `${20 + Math.sin(Date.now() / 200 + i) * 15}%`,
                                                            animation: `waveBar 0.${3 + (i % 4)}s ease-in-out infinite alternate`,
                                                            animationDelay: `${i * 0.05}s`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {isPlaying ? <VolumeX size={12} /> : <Mic size={12} className="opacity-40" />}
                                            {line.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 py-6 text-center">
                        <p className="text-xs text-white/20">No voice lines available for this character yet.</p>
                    </div>
                )}

                {/* Subtitle Display */}
                <AnimatePresence>
                    {subtitle && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center py-3"
                        >
                            <p
                                className="text-sm md:text-base font-medium italic tracking-wide"
                                style={{ color: universeColor }}
                            >
                                &quot;{subtitle}&quot;
                            </p>
                            {/* Pulse dot */}
                            {waveform && (
                                <div className="flex justify-center mt-2 gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                                            style={{
                                                backgroundColor: universeColor,
                                                animationDelay: `${i * 0.2}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Waveform animation keyframes */}
            <style jsx>{`
                @keyframes waveBar {
                    0% { transform: scaleY(0.3); }
                    100% { transform: scaleY(1); }
                }
            `}</style>
        </motion.div>
    );
}