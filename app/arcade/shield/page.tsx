"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Play } from "lucide-react";

const W = 500, H = 500;
const CENTER = W / 2;

export default function ShieldPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [wave, setWave] = useState(1);
    const [health, setHealth] = useState(3);
    const [gameState, setGameState] = useState<"menu" | "playing" | "over">("menu");
    const [best, setBest] = useState(0);
    const gameRef = useRef({
        shieldAngle: 0,
        projectiles: [] as { x: number; y: number; angle: number; speed: number; big: boolean }[],
        frame: 0, score: 0, wave: 1, hp: 3, animId: 0, spawnRate: 80,
    });

    const start = useCallback(() => {
        const g = gameRef.current;
        g.shieldAngle = 0; g.projectiles = [];
        g.frame = 0; g.score = 0; g.wave = 1; g.hp = 3; g.spawnRate = 80;
        setScore(0); setWave(1); setHealth(3);
        setGameState("playing");
    }, []);

    useEffect(() => {
        if (gameState !== "playing") return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const g = gameRef.current;

        const onMove = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            const mx = (e.clientX - r.left) * (W / r.width) - CENTER;
            const my = (e.clientY - r.top) * (H / r.height) - CENTER;
            g.shieldAngle = Math.atan2(my, mx);
        };
        canvas.addEventListener("mousemove", onMove);

        const loop = () => {
            g.frame++;
            if (g.frame % 600 === 0) { g.wave++; g.spawnRate = Math.max(20, 80 - g.wave * 8); setWave(g.wave); }

            if (g.frame % g.spawnRate === 0) {
                const s = Math.random() * 4;
                let sx: number, sy: number;
                if (s < 1) { sx = Math.random() * W; sy = -10; }
                else if (s < 2) { sx = W + 10; sy = Math.random() * H; }
                else if (s < 3) { sx = Math.random() * W; sy = H + 10; }
                else { sx = -10; sy = Math.random() * H; }
                g.projectiles.push({ x: sx, y: sy, angle: Math.atan2(CENTER - sy, CENTER - sx), speed: 2 + g.wave * 0.3, big: Math.random() > 0.7 });
            }

            g.projectiles.forEach((p) => { p.x += Math.cos(p.angle) * p.speed; p.y += Math.sin(p.angle) * p.speed; });

            const sx = CENTER + Math.cos(g.shieldAngle) * 60;
            const sy = CENTER + Math.sin(g.shieldAngle) * 60;

            g.projectiles = g.projectiles.filter((p) => {
                if (Math.sqrt((p.x - sx) ** 2 + (p.y - sy) ** 2) < 48) { g.score += p.big ? 20 : 10; setScore(g.score); return false; }
                if (Math.sqrt((p.x - CENTER) ** 2 + (p.y - CENTER) ** 2) < 15) { g.hp--; setHealth(g.hp); if (g.hp <= 0) { setBest((b) => Math.max(b, g.score)); setGameState("over"); } return false; }
                return p.x > -20 && p.x < W + 20 && p.y > -20 && p.y < H + 20;
            });

            ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0, 0, W, H);
            ctx.strokeStyle = "#ffffff08"; ctx.lineWidth = 1;
            for (let i = 0; i < W; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
            for (let i = 0; i < H; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }

            ctx.beginPath(); ctx.arc(CENTER, CENTER, 12, 0, Math.PI * 2); ctx.fillStyle = "#3B82F6"; ctx.fill();
            ctx.beginPath(); ctx.arc(sx, sy, 40, g.shieldAngle - 0.8, g.shieldAngle + 0.8); ctx.strokeStyle = "#3B82F6"; ctx.lineWidth = 6; ctx.stroke();
            ctx.beginPath(); ctx.arc(sx, sy, 32, g.shieldAngle - 0.6, g.shieldAngle + 0.6); ctx.strokeStyle = "#DC2626"; ctx.lineWidth = 4; ctx.stroke();

            g.projectiles.forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, p.big ? 6 : 4, 0, Math.PI * 2); ctx.fillStyle = p.big ? "#F97316" : "#EF4444"; ctx.fill(); });

            ctx.fillStyle = "white"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "left";
            ctx.fillText(`Score: ${g.score}  Wave: ${g.wave}`, 10, 22);
            ctx.textAlign = "right"; ctx.fillText("❤️".repeat(g.hp), W - 10, 22);

            g.animId = requestAnimationFrame(loop);
        };
        g.animId = requestAnimationFrame(loop);
        return () => { cancelAnimationFrame(g.animId); canvas.removeEventListener("mousemove", onMove); };
    }, [gameState]);

    return (
        <div className="min-h-screen pt-20 pb-24 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/arcade" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
                    <ArrowLeft size={16} /> Back to Arcade
                </Link>
                <h1 className="font-heading text-4xl text-white tracking-wider mb-4">SHIELD <span className="text-blue-400">DEFENSE</span></h1>
                <div className="relative inline-block rounded-xl overflow-hidden border border-white/10">
                    <canvas ref={canvasRef} width={W} height={H} className="block bg-black max-w-full" />
                    {gameState === "menu" && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                            <p className="text-5xl mb-4">🛡️</p>
                            <h2 className="font-heading text-2xl text-white mb-2">Shield Defense</h2>
                            <p className="text-white/40 text-sm mb-6">Move mouse to rotate shield. Block projectiles!</p>
                            <button onClick={start} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2"><Play size={18} /> Start</button>
                        </div>
                    )}
                    {gameState === "over" && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                            <h2 className="font-heading text-3xl text-white mb-2">SHIELD BROKEN</h2>
                            <p className="text-white/50 mb-1">Score: {score} • Wave: {wave}</p>
                            <p className="text-white/30 text-sm mb-6">Best: {best}</p>
                            <button onClick={start} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2"><RotateCcw size={18} /> Try Again</button>
                        </div>
                    )}
                </div>
                <p className="text-xs text-white/30 mt-3">Move cursor to rotate shield</p>
            </div>
        </div>
    );
}
