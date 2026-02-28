"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Swords, Shield, Zap, Heart, RotateCcw } from "lucide-react";
import { arcadeCharacters, type ArcadeCharacter } from "@/data/arcade";

type GameState = "select" | "fight" | "victory" | "defeat";

export default function BattlePage() {
    const [state, setState] = useState<GameState>("select");
    const [player, setPlayer] = useState<ArcadeCharacter | null>(null);
    const [enemy, setEnemy] = useState<ArcadeCharacter | null>(null);
    const [playerHP, setPlayerHP] = useState(0);
    const [enemyHP, setEnemyHP] = useState(0);
    const [specialCooldown, setSpecialCooldown] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [shakePlayer, setShakePlayer] = useState(false);
    const [shakeEnemy, setShakeEnemy] = useState(false);
    const logRef = useRef<HTMLDivElement>(null);

    const selectCharacter = (char: ArcadeCharacter) => {
        setPlayer(char);
        const enemies = arcadeCharacters.filter((c) => c.id !== char.id);
        const e = enemies[Math.floor(Math.random() * enemies.length)];
        setEnemy(e);
        setPlayerHP(char.health);
        setEnemyHP(e.health);
        setSpecialCooldown(0);
        setLog([`${char.name} vs ${e.name}! FIGHT!`]);
        setState("fight");
    };

    const addLog = useCallback((msg: string) => {
        setLog((prev) => [...prev.slice(-8), msg]);
    }, []);

    useEffect(() => {
        logRef.current?.scrollTo(0, logRef.current.scrollHeight);
    }, [log]);

    const attack = () => {
        if (!isPlayerTurn || !player || !enemy) return;
        const dmg = Math.floor(player.power * (0.15 + Math.random() * 0.15));
        setEnemyHP((prev) => {
            const next = Math.max(0, prev - dmg);
            if (next <= 0) setState("victory");
            return next;
        });
        setShakeEnemy(true);
        setTimeout(() => setShakeEnemy(false), 300);
        addLog(`${player.name} attacks for ${dmg} damage!`);
        setSpecialCooldown((c) => Math.max(0, c - 1));
        setIsPlayerTurn(false);
    };

    const special = () => {
        if (!isPlayerTurn || specialCooldown > 0 || !player || !enemy) return;
        const dmg = Math.floor(player.power * (0.3 + Math.random() * 0.2));
        setEnemyHP((prev) => {
            const next = Math.max(0, prev - dmg);
            if (next <= 0) setState("victory");
            return next;
        });
        setShakeEnemy(true);
        setTimeout(() => setShakeEnemy(false), 500);
        addLog(`⚡ ${player.name} uses ${player.specialName} for ${dmg} damage!`);
        setSpecialCooldown(3);
        setIsPlayerTurn(false);
    };

    const dodge = () => {
        if (!isPlayerTurn || !player) return;
        addLog(`${player.name} dodges and prepares for next attack!`);
        setSpecialCooldown((c) => Math.max(0, c - 1));
        setIsPlayerTurn(false);
    };

    // Enemy turn
    useEffect(() => {
        if (isPlayerTurn || state !== "fight" || !enemy || !player) return;
        const timer = setTimeout(() => {
            const roll = Math.random();
            if (roll < 0.15) {
                addLog(`${enemy.name} misses!`);
            } else if (roll < 0.3) {
                const dmg = Math.floor(enemy.power * (0.25 + Math.random() * 0.2));
                setPlayerHP((prev) => {
                    const next = Math.max(0, prev - dmg);
                    if (next <= 0) setState("defeat");
                    return next;
                });
                setShakePlayer(true);
                setTimeout(() => setShakePlayer(false), 500);
                addLog(`💥 ${enemy.name} uses ${enemy.specialName} for ${dmg} damage!`);
            } else {
                const dmg = Math.floor(enemy.power * (0.1 + Math.random() * 0.15));
                setPlayerHP((prev) => {
                    const next = Math.max(0, prev - dmg);
                    if (next <= 0) setState("defeat");
                    return next;
                });
                setShakePlayer(true);
                setTimeout(() => setShakePlayer(false), 300);
                addLog(`${enemy.name} attacks for ${dmg} damage!`);
            }
            setIsPlayerTurn(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, [isPlayerTurn, state, enemy, player, addLog]);

    const restart = () => {
        setState("select");
        setPlayer(null);
        setEnemy(null);
        setLog([]);
        setIsPlayerTurn(true);
    };

    const HPBar = ({ current, max, color, label }: { current: number; max: number; color: string; label: string }) => (
        <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-white/70 font-bold">{label}</span>
                <span className="text-white/50">{current}/{max}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ width: `${(current / max) * 100}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-20 pb-24 px-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/arcade" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
                    <ArrowLeft size={16} /> Back to Arcade
                </Link>

                <h1 className="font-heading text-4xl md:text-6xl text-white tracking-wider mb-2">
                    HERO <span className="text-marvel-red">BATTLE ARENA</span>
                </h1>

                {/* Character Select */}
                <AnimatePresence mode="wait">
                    {state === "select" && (
                        <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
                            <p className="text-white/40 mb-6">Choose your fighter:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {arcadeCharacters.map((char) => (
                                    <button
                                        key={char.id}
                                        onClick={() => selectCharacter(char)}
                                        className="group glass rounded-xl p-4 border border-white/5 hover:border-white/30 transition-all text-center"
                                    >
                                        <div className="text-5xl mb-2">{char.emoji}</div>
                                        <p className="font-heading text-sm text-white tracking-wider">{char.name}</p>
                                        <div className="mt-2 space-y-1">
                                            <div className="flex justify-between text-[10px] text-white/40">
                                                <span>HP</span><span>{char.health}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-white/40">
                                                <span>PWR</span><span>{char.power}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-white/40">
                                                <span>SPD</span><span>{char.speed}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Fight */}
                    {state === "fight" && player && enemy && (
                        <motion.div key="fight" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
                            {/* Health Bars */}
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className={shakePlayer ? "animate-pulse" : ""}>
                                    <div className="text-3xl mb-2 text-center">{player.emoji}</div>
                                    <HPBar current={playerHP} max={player.health} color={player.color} label={player.name} />
                                </div>
                                <div className={shakeEnemy ? "animate-pulse" : ""}>
                                    <div className="text-3xl mb-2 text-center">{enemy.emoji}</div>
                                    <HPBar current={enemyHP} max={enemy.health} color={enemy.color} label={enemy.name} />
                                </div>
                            </div>

                            {/* Battle Log */}
                            <div ref={logRef} className="glass rounded-lg p-3 mb-6 h-32 overflow-y-auto text-xs space-y-1 scrollbar-hide">
                                {log.map((l, i) => (
                                    <p key={i} className={`${i === log.length - 1 ? "text-white" : "text-white/40"}`}>{l}</p>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={attack}
                                    disabled={!isPlayerTurn}
                                    className="px-6 py-3 bg-marvel-red text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
                                >
                                    <Swords size={18} /> Attack
                                </button>
                                <button
                                    onClick={special}
                                    disabled={!isPlayerTurn || specialCooldown > 0}
                                    className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-yellow-700 transition-colors"
                                >
                                    <Zap size={18} /> {player.specialName} {specialCooldown > 0 && `(${specialCooldown})`}
                                </button>
                                <button
                                    onClick={dodge}
                                    disabled={!isPlayerTurn}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                >
                                    <Shield size={18} /> Dodge
                                </button>
                            </div>

                            {!isPlayerTurn && <p className="text-center text-white/30 text-sm mt-4 animate-pulse">Enemy&apos;s turn...</p>}
                        </motion.div>
                    )}

                    {/* Victory / Defeat */}
                    {(state === "victory" || state === "defeat") && (
                        <motion.div key="end" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-16 text-center">
                            <div className="text-7xl mb-4">{state === "victory" ? "🏆" : "💀"}</div>
                            <h2 className="font-heading text-5xl text-white tracking-wider mb-2">
                                {state === "victory" ? (
                                    <span className="text-marvel-gold">VICTORY!</span>
                                ) : (
                                    <span className="text-red-500">DEFEATED</span>
                                )}
                            </h2>
                            <p className="text-white/40 mb-8">
                                {state === "victory"
                                    ? `${player?.name} wins the battle!`
                                    : `${enemy?.name} was too powerful this time.`}
                            </p>
                            <button
                                onClick={restart}
                                className="px-6 py-3 bg-marvel-red text-white rounded-lg font-bold inline-flex items-center gap-2 hover:bg-red-700 transition-colors"
                            >
                                <RotateCcw size={18} /> Play Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
