"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Play, Pause } from "lucide-react";

const CANVAS_W = 600;
const CANVAS_H = 400;
const PLAYER_SIZE = 30;
const STONE_SIZE = 18;
const OBSTACLE_SIZE = 25;
const STONE_COLORS = ["#DC2626", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#8B5CF6"];

export default function StonesPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [stonesCollected, setStonesCollected] = useState(0);
    const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "over">("menu");
    const [highScore, setHighScore] = useState(0);
    const gameRef = useRef({
        playerY: CANVAS_H / 2,
        speed: 3,
        stones: [] as { x: number; y: number; color: string }[],
        obstacles: [] as { x: number; y: number }[],
        frame: 0,
        score: 0,
        collected: 0,
        keys: { up: false, down: false },
        animId: 0,
    });

    const spawnStone = useCallback(() => {
        const g = gameRef.current;
        g.stones.push({
            x: CANVAS_W + 20,
            y: 40 + Math.random() * (CANVAS_H - 80),
            color: STONE_COLORS[Math.floor(Math.random() * STONE_COLORS.length)],
        });
    }, []);

    const spawnObstacle = useCallback(() => {
        const g = gameRef.current;
        g.obstacles.push({
            x: CANVAS_W + 20,
            y: 30 + Math.random() * (CANVAS_H - 60),
        });
    }, []);

    const startGame = useCallback(() => {
        const g = gameRef.current;
        g.playerY = CANVAS_H / 2;
        g.speed = 3;
        g.stones = [];
        g.obstacles = [];
        g.frame = 0;
        g.score = 0;
        g.collected = 0;
        setScore(0);
        setStonesCollected(0);
        setGameState("playing");
    }, []);

    useEffect(() => {
        if (gameState !== "playing") return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const handleKey = (e: KeyboardEvent, pressed: boolean) => {
            if (e.key === "ArrowUp" || e.key === "w") gameRef.current.keys.up = pressed;
            if (e.key === "ArrowDown" || e.key === "s") gameRef.current.keys.down = pressed;
        };
        const keyDown = (e: KeyboardEvent) => handleKey(e, true);
        const keyUp = (e: KeyboardEvent) => handleKey(e, false);
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);

        const loop = () => {
            const g = gameRef.current;
            g.frame++;
            g.speed = 3 + Math.floor(g.frame / 300) * 0.5;

            // Move player
            if (g.keys.up) g.playerY = Math.max(PLAYER_SIZE / 2, g.playerY - 5);
            if (g.keys.down) g.playerY = Math.min(CANVAS_H - PLAYER_SIZE / 2, g.playerY + 5);

            // Spawn items
            if (g.frame % 40 === 0) spawnStone();
            if (g.frame % 60 === 0) spawnObstacle();

            // Move items
            g.stones.forEach((s) => (s.x -= g.speed));
            g.obstacles.forEach((o) => (o.x -= g.speed * 1.2));
            g.stones = g.stones.filter((s) => s.x > -20);
            g.obstacles = g.obstacles.filter((o) => o.x > -20);

            // Collision — stones
            g.stones = g.stones.filter((s) => {
                const dx = 50 - s.x, dy = g.playerY - s.y;
                if (Math.sqrt(dx * dx + dy * dy) < (PLAYER_SIZE + STONE_SIZE) / 2) {
                    g.score += 10;
                    g.collected++;
                    setScore(g.score);
                    setStonesCollected(g.collected);
                    return false;
                }
                return true;
            });

            // Collision — obstacles
            for (const o of g.obstacles) {
                const dx = 50 - o.x, dy = g.playerY - o.y;
                if (Math.sqrt(dx * dx + dy * dy) < (PLAYER_SIZE + OBSTACLE_SIZE) / 2) {
                    setHighScore((h) => Math.max(h, g.score));
                    setGameState("over");
                    return;
                }
            }

            // Draw
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

            // Stars bg
            for (let i = 0; i < 40; i++) {
                const sx = ((i * 97 + g.frame * 0.5) % CANVAS_W);
                const sy = ((i * 131) % CANVAS_H);
                ctx.fillStyle = `rgba(255,255,255,${0.1 + (i % 3) * 0.1})`;
                ctx.fillRect(sx, sy, 1, 1);
            }

            // Player (hero glow)
            ctx.beginPath();
            ctx.arc(50, g.playerY, PLAYER_SIZE / 2, 0, Math.PI * 2);
            ctx.fillStyle = "#FFD700";
            ctx.fill();
            ctx.strokeStyle = "#FFA500";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "#000";
            ctx.font = "14px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("⚡", 50, g.playerY + 5);

            // Stones
            g.stones.forEach((s) => {
                ctx.beginPath();
                ctx.moveTo(s.x, s.y - STONE_SIZE / 2);
                ctx.lineTo(s.x + STONE_SIZE / 2, s.y);
                ctx.lineTo(s.x, s.y + STONE_SIZE / 2);
                ctx.lineTo(s.x - STONE_SIZE / 2, s.y);
                ctx.closePath();
                ctx.fillStyle = s.color;
                ctx.fill();
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Obstacles
            g.obstacles.forEach((o) => {
                ctx.fillStyle = "#DC2626";
                ctx.fillRect(o.x - OBSTACLE_SIZE / 2, o.y - OBSTACLE_SIZE / 2, OBSTACLE_SIZE, OBSTACLE_SIZE);
                ctx.strokeStyle = "#FF6B6B";
                ctx.lineWidth = 1;
                ctx.strokeRect(o.x - OBSTACLE_SIZE / 2, o.y - OBSTACLE_SIZE / 2, OBSTACLE_SIZE, OBSTACLE_SIZE);
            });

            // HUD
            ctx.fillStyle = "white";
            ctx.font = "bold 14px Inter, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(`Score: ${g.score}`, 10, 22);
            ctx.fillText(`💎 ${g.collected}`, CANVAS_W - 60, 22);

            g.animId = requestAnimationFrame(loop);
        };

        gameRef.current.animId = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(gameRef.current.animId);
            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);
        };
    }, [gameState, spawnStone, spawnObstacle]);

    return (
        <div className="min-h-screen pt-20 pb-24 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/arcade" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
                    <ArrowLeft size={16} /> Back to Arcade
                </Link>
                <h1 className="font-heading text-4xl text-white tracking-wider mb-4">
                    INFINITY <span className="text-purple-400">STONE COLLECTOR</span>
                </h1>

                <div className="relative inline-block rounded-xl overflow-hidden border border-white/10">
                    <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="block bg-black max-w-full" style={{ imageRendering: "pixelated" }} />

                    {/* Menu Overlay */}
                    {gameState === "menu" && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                            <p className="text-5xl mb-4">💎</p>
                            <h2 className="font-heading text-2xl text-white mb-2">Infinity Stone Collector</h2>
                            <p className="text-white/40 text-sm mb-6">Arrow keys / W-S to move. Collect stones, avoid red obstacles!</p>
                            <button onClick={startGame} className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700">
                                <Play size={18} /> Start Game
                            </button>
                        </div>
                    )}

                    {/* Game Over */}
                    {gameState === "over" && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                            <p className="text-5xl mb-4">💥</p>
                            <h2 className="font-heading text-3xl text-white mb-2">GAME OVER</h2>
                            <p className="text-white/50 mb-1">Score: {score} • Stones: {stonesCollected}</p>
                            <p className="text-white/30 text-sm mb-6">High Score: {highScore}</p>
                            <button onClick={startGame} className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700">
                                <RotateCcw size={18} /> Play Again
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-xs text-white/30 mt-3">Use ↑↓ arrow keys or W/S to move</p>
            </div>
        </div>
    );
}
