"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Play } from "lucide-react";

const W = 500, H = 400;
const NODE_R = 20;

export default function ReactorPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [energy, setEnergy] = useState(50);
    const [gameState, setGameState] = useState<"menu" | "playing" | "over">("menu");
    const [best, setBest] = useState(0);
    const gameRef = useRef({
        nodes: [] as { x: number; y: number; life: number; maxLife: number }[],
        frame: 0, score: 0, energy: 50, animId: 0, spawnRate: 90,
        pulsePhase: 0,
    });

    const start = useCallback(() => {
        const g = gameRef.current;
        g.nodes = []; g.frame = 0; g.score = 0; g.energy = 50; g.spawnRate = 90;
        setScore(0); setEnergy(50);
        setGameState("playing");
    }, []);

    useEffect(() => {
        if (gameState !== "playing") return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const g = gameRef.current;

        const onClick = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            const mx = (e.clientX - r.left) * (W / r.width);
            const my = (e.clientY - r.top) * (H / r.height);
            g.nodes = g.nodes.filter((n) => {
                if (Math.sqrt((mx - n.x) ** 2 + (my - n.y) ** 2) < NODE_R + 10) {
                    g.score += Math.ceil(n.life / n.maxLife * 20);
                    g.energy = Math.min(100, g.energy + 5);
                    setScore(g.score); setEnergy(g.energy);
                    return false;
                }
                return true;
            });
        };
        canvas.addEventListener("click", onClick);

        const loop = () => {
            g.frame++;
            g.pulsePhase += 0.05;

            // Drain energy
            g.energy -= 0.08 + g.frame * 0.00003;
            setEnergy(Math.round(g.energy));
            if (g.energy <= 0) { setBest((b) => Math.max(b, g.score)); setGameState("over"); return; }

            // Speed up
            if (g.frame % 500 === 0) g.spawnRate = Math.max(30, g.spawnRate - 8);

            // Spawn nodes
            if (g.frame % g.spawnRate === 0) {
                g.nodes.push({
                    x: 60 + Math.random() * (W - 120),
                    y: 60 + Math.random() * (H - 120),
                    life: 120, maxLife: 120,
                });
            }

            // Decay nodes
            g.nodes.forEach((n) => n.life--);
            const expired = g.nodes.filter((n) => n.life <= 0).length;
            if (expired > 0) { g.energy -= expired * 8; setEnergy(Math.round(g.energy)); }
            g.nodes = g.nodes.filter((n) => n.life > 0);

            // Draw
            ctx.fillStyle = "#0a0a0f"; ctx.fillRect(0, 0, W, H);

            // Reactor core (center)
            const cx = W / 2, cy = H / 2;
            const pulse = Math.sin(g.pulsePhase) * 0.3 + 1;
            const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 80 * pulse);
            grd.addColorStop(0, `rgba(56,189,248,${0.3 * (g.energy / 100)})`);
            grd.addColorStop(1, "transparent");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, W, H);

            // Core circle
            ctx.beginPath();
            ctx.arc(cx, cy, 25 + Math.sin(g.pulsePhase * 2) * 3, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(56,189,248,${0.5 + g.energy / 200})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Ring
            ctx.beginPath();
            ctx.arc(cx, cy, 50, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(56,189,248,0.15)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Energy nodes
            g.nodes.forEach((n) => {
                const pct = n.life / n.maxLife;
                const r = NODE_R * (0.5 + pct * 0.5);
                ctx.beginPath();
                ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                const hue = pct > 0.5 ? 200 : pct > 0.25 ? 40 : 0;
                ctx.fillStyle = `hsla(${hue},80%,50%,${0.3 + pct * 0.5})`;
                ctx.fill();
                ctx.strokeStyle = `hsla(${hue},80%,60%,${pct})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Urgency ring
                if (pct < 0.3) {
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, r + 6 + Math.sin(g.frame * 0.2) * 3, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(239,68,68,${0.6 - pct})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });

            // Energy bar
            ctx.fillStyle = "#1f2937";
            ctx.fillRect(10, H - 30, W - 20, 16);
            const barW = (W - 20) * (g.energy / 100);
            const barColor = g.energy > 50 ? "#38BDF8" : g.energy > 25 ? "#F59E0B" : "#EF4444";
            ctx.fillStyle = barColor;
            ctx.fillRect(10, H - 30, barW, 16);
            ctx.strokeStyle = "#374151";
            ctx.strokeRect(10, H - 30, W - 20, 16);

            // HUD
            ctx.fillStyle = "white"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "left";
            ctx.fillText(`Score: ${g.score}`, 10, 22);
            ctx.textAlign = "right";
            ctx.fillText(`Energy: ${Math.round(g.energy)}%`, W - 10, 22);

            g.animId = requestAnimationFrame(loop);
        };
        g.animId = requestAnimationFrame(loop);
        return () => { cancelAnimationFrame(g.animId); canvas.removeEventListener("click", onClick); };
    }, [gameState]);

    return (
        <div className="min-h-screen pt-20 pb-24 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/arcade" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
                    <ArrowLeft size={16} /> Back to Arcade
                </Link>
                <h1 className="font-heading text-4xl text-white tracking-wider mb-4">STARK <span className="text-yellow-400">REACTOR CHARGE</span></h1>
                <div className="relative inline-block rounded-xl overflow-hidden border border-white/10">
                    <canvas ref={canvasRef} width={W} height={H} className="block bg-black max-w-full" />
                    {gameState === "menu" && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                            <p className="text-5xl mb-4">⚡</p>
                            <h2 className="font-heading text-2xl text-white mb-2">Stark Reactor</h2>
                            <p className="text-white/40 text-sm mb-6">Click energy nodes to stabilize the reactor. Do not let energy reach 0!</p>
                            <button onClick={start} className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-bold flex items-center gap-2"><Play size={18} /> Start</button>
                        </div>
                    )}
                    {gameState === "over" && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                            <h2 className="font-heading text-3xl text-white mb-2">REACTOR FAILED</h2>
                            <p className="text-white/50 mb-1">Score: {score}</p>
                            <p className="text-white/30 text-sm mb-6">Best: {best}</p>
                            <button onClick={start} className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-bold flex items-center gap-2"><RotateCcw size={18} /> Try Again</button>
                        </div>
                    )}
                </div>
                <p className="text-xs text-white/30 mt-3">Click glowing nodes before they expire</p>
            </div>
        </div>
    );
}
