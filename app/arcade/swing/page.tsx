"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Play } from "lucide-react";

const W = 600, H = 400;
const GRAVITY = 0.35;
const SWING_FORCE = -8;
const BUILDING_W = 60;

export default function SwingPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [distance, setDistance] = useState(0);
    const [gameState, setGameState] = useState<"menu" | "playing" | "over">("menu");
    const [best, setBest] = useState(0);
    const gameRef = useRef({
        playerX: 100, playerY: 200, velY: 0, velX: 2,
        swinging: false, webY: 0, webLength: 0, angle: 0, angularVel: 0,
        buildings: [] as { x: number; h: number; w: number }[],
        scrollX: 0, frame: 0, dist: 0, animId: 0, alive: true,
    });

    const initBuildings = useCallback(() => {
        const g = gameRef.current;
        g.buildings = [];
        for (let i = 0; i < 20; i++) {
            g.buildings.push({
                x: i * (BUILDING_W + 30 + Math.random() * 40),
                h: 100 + Math.random() * 200,
                w: BUILDING_W + Math.random() * 30,
            });
        }
    }, []);

    const start = useCallback(() => {
        const g = gameRef.current;
        g.playerX = 100; g.playerY = 200; g.velY = 0; g.velX = 3;
        g.swinging = false; g.scrollX = 0; g.frame = 0; g.dist = 0; g.alive = true;
        initBuildings();
        setDistance(0);
        setGameState("playing");
    }, [initBuildings]);

    useEffect(() => {
        if (gameState !== "playing") return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const g = gameRef.current;

        const onDown = () => {
            if (!g.alive) return;
            if (!g.swinging) {
                // Find nearest building top
                let bestB = null, bestDist = Infinity;
                for (const b of g.buildings) {
                    const bx = b.x + b.w / 2 - g.scrollX;
                    const by = H - b.h;
                    const d = Math.sqrt((g.playerX - bx) ** 2 + (g.playerY - by) ** 2);
                    if (bx > g.playerX && d < 250 && d < bestDist) {
                        bestDist = d;
                        bestB = b;
                    }
                }
                if (bestB) {
                    g.swinging = true;
                    const pivotX = bestB.x + bestB.w / 2 - g.scrollX;
                    const pivotY = H - bestB.h;
                    g.webLength = Math.sqrt((g.playerX - pivotX) ** 2 + (g.playerY - pivotY) ** 2);
                    g.angle = Math.atan2(g.playerX - pivotX, g.playerY - pivotY);
                    g.angularVel = g.velX * 0.015;
                    g.webY = pivotX; // store pivot X world
                }
            }
        };
        const onUp = () => {
            if (g.swinging) {
                g.swinging = false;
                g.velX = Math.max(3, g.velX + 1.5);
                g.velY = SWING_FORCE;
            }
        };

        canvas.addEventListener("mousedown", onDown);
        canvas.addEventListener("mouseup", onUp);
        canvas.addEventListener("touchstart", onDown);
        canvas.addEventListener("touchend", onUp);

        const loop = () => {
            g.frame++;

            if (!g.swinging) {
                g.velY += GRAVITY;
                g.playerY += g.velY;
                g.playerX += g.velX * 0.3;
                g.scrollX += g.velX;
            } else {
                g.angularVel += Math.sin(g.angle) * 0.002;
                g.angularVel *= 0.99;
                g.angle += g.angularVel;
                // Find pivot
                const pivotSx = g.webY;
                const pivotBld = g.buildings.find(b => Math.abs(b.x + b.w / 2 - g.scrollX - pivotSx) < 5);
                if (pivotBld) {
                    const pivotX = pivotBld.x + pivotBld.w / 2 - g.scrollX;
                    const pivotY = H - pivotBld.h;
                    g.playerX = pivotX + Math.sin(g.angle) * g.webLength;
                    g.playerY = pivotY + Math.cos(g.angle) * g.webLength;
                }
                g.scrollX += 2;
            }

            g.dist = Math.floor(g.scrollX / 10);
            setDistance(g.dist);

            // Add more buildings
            const lastB = g.buildings[g.buildings.length - 1];
            if (lastB && lastB.x - g.scrollX < W + 200) {
                g.buildings.push({
                    x: lastB.x + lastB.w + 30 + Math.random() * 60,
                    h: 100 + Math.random() * 200,
                    w: BUILDING_W + Math.random() * 30,
                });
            }
            g.buildings = g.buildings.filter((b) => b.x - g.scrollX > -100);

            // Ground collision
            if (g.playerY > H - 20) {
                g.alive = false;
                setBest((b) => Math.max(b, g.dist));
                setGameState("over");
                return;
            }

            // Draw
            // Sky gradient
            const grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, "#0c0c1a");
            grad.addColorStop(1, "#1a1a2e");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);

            // Stars
            for (let i = 0; i < 30; i++) {
                const sx = ((i * 97 + g.scrollX * 0.1) % W);
                const sy = ((i * 131) % (H * 0.6));
                ctx.fillStyle = `rgba(255,255,255,${0.15 + (i % 4) * 0.1})`;
                ctx.fillRect(sx, sy, 1, 1);
            }

            // Buildings
            ctx.fillStyle = "#1f2937";
            g.buildings.forEach((b) => {
                const bx = b.x - g.scrollX;
                ctx.fillRect(bx, H - b.h, b.w, b.h);
                ctx.strokeStyle = "#374151";
                ctx.strokeRect(bx, H - b.h, b.w, b.h);
                // Windows
                for (let wy = H - b.h + 10; wy < H - 10; wy += 20) {
                    for (let wx = bx + 8; wx < bx + b.w - 8; wx += 15) {
                        ctx.fillStyle = Math.random() > 0.3 ? "#FDE68A30" : "#00000040";
                        ctx.fillRect(wx, wy, 6, 8);
                    }
                }
            });

            // Ground
            ctx.fillStyle = "#111827";
            ctx.fillRect(0, H - 20, W, 20);

            // Web line
            if (g.swinging) {
                const pivotBld = g.buildings.find(b => Math.abs(b.x + b.w / 2 - g.scrollX - g.webY) < 5);
                if (pivotBld) {
                    ctx.beginPath();
                    ctx.moveTo(g.playerX, g.playerY);
                    ctx.lineTo(pivotBld.x + pivotBld.w / 2 - g.scrollX, H - pivotBld.h);
                    ctx.strokeStyle = "#ccc";
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }

            // Player
            ctx.beginPath();
            ctx.arc(g.playerX, g.playerY, 8, 0, Math.PI * 2);
            ctx.fillStyle = "#DC2626";
            ctx.fill();
            ctx.strokeStyle = "#2563EB";
            ctx.lineWidth = 2;
            ctx.stroke();

            // HUD
            ctx.fillStyle = "white";
            ctx.font = "bold 14px Inter, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(`Distance: ${g.dist}m`, 10, 22);

            g.animId = requestAnimationFrame(loop);
        };

        g.animId = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(g.animId);
            canvas.removeEventListener("mousedown", onDown);
            canvas.removeEventListener("mouseup", onUp);
            canvas.removeEventListener("touchstart", onDown);
            canvas.removeEventListener("touchend", onUp);
        };
    }, [gameState]);

    return (
        <div className="min-h-screen pt-20 pb-24 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/arcade" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
                    <ArrowLeft size={16} /> Back to Arcade
                </Link>
                <h1 className="font-heading text-4xl text-white tracking-wider mb-4">
                    SPIDER <span className="text-red-500">SWING CHALLENGE</span>
                </h1>

                <div className="relative inline-block rounded-xl overflow-hidden border border-white/10">
                    <canvas ref={canvasRef} width={W} height={H} className="block bg-black max-w-full" />

                    {gameState === "menu" && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                            <p className="text-5xl mb-4">🕸️</p>
                            <h2 className="font-heading text-2xl text-white mb-2">Spider Swing</h2>
                            <p className="text-white/40 text-sm mb-6">Click/tap to attach web, release to let go. Don&apos;t hit the ground!</p>
                            <button onClick={start} className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold flex items-center gap-2">
                                <Play size={18} /> Start
                            </button>
                        </div>
                    )}

                    {gameState === "over" && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                            <h2 className="font-heading text-3xl text-white mb-2">SPLAT!</h2>
                            <p className="text-white/50 mb-1">Distance: {distance}m</p>
                            <p className="text-white/30 text-sm mb-6">Best: {best}m</p>
                            <button onClick={start} className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold flex items-center gap-2">
                                <RotateCcw size={18} /> Try Again
                            </button>
                        </div>
                    )}
                </div>
                <p className="text-xs text-white/30 mt-3">Click and hold to swing, release to launch</p>
            </div>
        </div>
    );
}
