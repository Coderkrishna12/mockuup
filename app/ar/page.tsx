"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera, CameraOff, Volume2, VolumeX, ChevronLeft, ChevronRight,
    Sparkles, Maximize, Minimize, ArrowLeft, Crosshair, Shield,
    Zap, Target, Eye
} from "lucide-react";
import Link from "next/link";
import { characters, type Character } from "@/data/characters";
import { audioManager } from "@/lib/audio";

/* ═══════════════════════════════════════════════════════════════
   CHARACTER MASK DEFINITIONS — what to draw on face per character
   ═══════════════════════════════════════════════════════════════ */
interface CharacterMask {
    name: string;
    maskColor: string;
    glowColor: string;
    eyeColor: string;
    drawMask: (ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number, faceW: number, faceH: number, t: number) => void;
}

const characterMasks: Record<string, CharacterMask> = {
    "iron-man": {
        name: "Iron Man Helmet",
        maskColor: "#B22222",
        glowColor: "#FFD700",
        eyeColor: "#87CEEB",
        drawMask: (ctx, w, h, cx, cy, fw, fh, t) => {
            // Helmet shape
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(cx, cy - fh * 0.05, fw * 0.55, fh * 0.65, 0, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(178, 34, 34, 0.5)";
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Face plate
            ctx.beginPath();
            ctx.moveTo(cx - fw * 0.35, cy - fh * 0.1);
            ctx.lineTo(cx - fw * 0.15, cy + fh * 0.35);
            ctx.lineTo(cx + fw * 0.15, cy + fh * 0.35);
            ctx.lineTo(cx + fw * 0.35, cy - fh * 0.1);
            ctx.closePath();
            ctx.fillStyle = "rgba(255, 215, 0, 0.3)";
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Eye slits
            const eyeGlow = 0.7 + Math.sin(t * 4) * 0.3;
            ctx.fillStyle = `rgba(135, 206, 235, ${eyeGlow})`;
            ctx.shadowColor = "#87CEEB";
            ctx.shadowBlur = 15;
            // Left eye
            ctx.beginPath();
            ctx.moveTo(cx - fw * 0.28, cy - fh * 0.08);
            ctx.lineTo(cx - fw * 0.08, cy - fh * 0.12);
            ctx.lineTo(cx - fw * 0.08, cy - fh * 0.02);
            ctx.closePath();
            ctx.fill();
            // Right eye
            ctx.beginPath();
            ctx.moveTo(cx + fw * 0.28, cy - fh * 0.08);
            ctx.lineTo(cx + fw * 0.08, cy - fh * 0.12);
            ctx.lineTo(cx + fw * 0.08, cy - fh * 0.02);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;

            // Arc reactor glow on chin area
            ctx.beginPath();
            ctx.arc(cx, cy + fh * 0.5, fw * 0.08, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(135, 206, 235, ${0.3 + Math.sin(t * 3) * 0.2})`;
            ctx.shadowColor = "#87CEEB";
            ctx.shadowBlur = 20;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
        },
    },
    "spider-man": {
        name: "Spider-Man Mask",
        maskColor: "#CC0000",
        glowColor: "#FFFFFF",
        eyeColor: "#FFFFFF",
        drawMask: (ctx, w, h, cx, cy, fw, fh, t) => {
            ctx.save();
            // Red mask
            ctx.beginPath();
            ctx.ellipse(cx, cy, fw * 0.52, fh * 0.6, 0, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(204, 0, 0, 0.45)";
            ctx.fill();

            // Web pattern
            ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
            ctx.lineWidth = 1;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy - fh * 0.1);
                ctx.lineTo(cx + Math.cos(angle) * fw * 0.55, cy - fh * 0.1 + Math.sin(angle) * fh * 0.6);
                ctx.stroke();
            }
            // Concentric web rings
            for (let r = 0.15; r < 0.6; r += 0.12) {
                ctx.beginPath();
                ctx.ellipse(cx, cy, fw * r, fh * r * 0.9, 0, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Eyes (large white eye shapes)
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.shadowColor = "#FFFFFF";
            ctx.shadowBlur = 10;
            // Left
            ctx.beginPath();
            ctx.ellipse(cx - fw * 0.18, cy - fh * 0.08, fw * 0.14, fh * 0.12, -0.15, 0, Math.PI * 2);
            ctx.fill();
            // Right
            ctx.beginPath();
            ctx.ellipse(cx + fw * 0.18, cy - fh * 0.08, fw * 0.14, fh * 0.12, 0.15, 0, Math.PI * 2);
            ctx.fill();

            // Black eye borders
            ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
            ctx.lineWidth = 2;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.ellipse(cx - fw * 0.18, cy - fh * 0.08, fw * 0.14, fh * 0.12, -0.15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(cx + fw * 0.18, cy - fh * 0.08, fw * 0.14, fh * 0.12, 0.15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        },
    },
    "doctor-strange": {
        name: "Eye of Agamotto",
        maskColor: "#A855F7",
        glowColor: "#FFD700",
        eyeColor: "#22C55E",
        drawMask: (ctx, w, h, cx, cy, fw, fh, t) => {
            ctx.save();
            // Mystical aura around head
            const auraRadius = fw * 0.65 + Math.sin(t * 2) * fw * 0.05;
            const grad = ctx.createRadialGradient(cx, cy, fw * 0.3, cx, cy, auraRadius);
            grad.addColorStop(0, "rgba(168, 85, 247, 0)");
            grad.addColorStop(0.7, "rgba(168, 85, 247, 0.1)");
            grad.addColorStop(1, "rgba(168, 85, 247, 0.2)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, auraRadius, 0, Math.PI * 2);
            ctx.fill();

            // Eye of Agamotto at neck
            const eyeY = cy + fh * 0.45;
            ctx.beginPath();
            ctx.arc(cx, eyeY, fw * 0.12, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${0.4 + Math.sin(t * 3) * 0.3})`;
            ctx.shadowColor = "#FFD700";
            ctx.shadowBlur = 25;
            ctx.fill();
            // Inner eye
            ctx.beginPath();
            ctx.arc(cx, eyeY, fw * 0.05, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 197, 94, ${0.6 + Math.sin(t * 5) * 0.3})`;
            ctx.shadowColor = "#22C55E";
            ctx.shadowBlur = 15;
            ctx.fill();

            // Mandala circles
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 + Math.sin(t * 2) * 0.2})`;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(cx, cy, fw * (0.55 + i * 0.08), t * (0.5 + i * 0.2), t * (0.5 + i * 0.2) + Math.PI * 1.5);
                ctx.stroke();
            }
            ctx.restore();
        },
    },
};

// Default mask for characters without a specific design
const defaultMask: CharacterMask = {
    name: "Power Aura",
    maskColor: "#ED1D24",
    glowColor: "#FFD700",
    eyeColor: "#FFFFFF",
    drawMask: (ctx, w, h, cx, cy, fw, fh, t) => {
        ctx.save();
        // Generic energy aura
        const grad = ctx.createRadialGradient(cx, cy, fw * 0.2, cx, cy, fw * 0.7);
        grad.addColorStop(0, "rgba(237, 29, 36, 0)");
        grad.addColorStop(0.5, `rgba(237, 29, 36, ${0.1 + Math.sin(t * 2) * 0.05})`);
        grad.addColorStop(1, "rgba(237, 29, 36, 0.15)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, fw * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // Eye glow
        ctx.fillStyle = `rgba(255, 215, 0, ${0.4 + Math.sin(t * 4) * 0.3})`;
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(cx - fw * 0.18, cy - fh * 0.08, fw * 0.06, fh * 0.03, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + fw * 0.18, cy - fh * 0.08, fw * 0.06, fh * 0.03, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    },
};

/* ═══════════════════════════════════════════════════════════════
   CHARACTER VOICE LINES — quotes per character for voice system
   ═══════════════════════════════════════════════════════════════ */
const characterVoiceLines: Record<string, string[]> = {
    "iron-man": ["I am Iron Man.", "Avengers, assemble.", "I love you three thousand.", "Sometimes you gotta run before you can walk."],
    "captain-america": ["I can do this all day.", "Avengers, assemble.", "I'm with you to the end of the line.", "The price of freedom is high."],
    "thor": ["I'm still worthy!", "Bring me Thanos!", "Another!", "Because that's what heroes do."],
    "hulk": ["Hulk smash!", "I'm always angry.", "Puny god.", "I see this as an absolute win!"],
    "spider-man": ["With great power comes great responsibility.", "I'm Spider-Man.", "Hey everyone.", "Mr. Stark, I don't feel so good."],
    "doctor-strange": ["Dormammu, I've come to bargain.", "We're in the endgame now.", "It was the only way.", "The Multiverse is real."],
    "black-panther": ["Wakanda forever!", "I never freeze.", "In times of crisis, the wise build bridges.", "The Black Panther lives."],
    "black-widow": ["I've got red in my ledger.", "We have what we have when we have it.", "I'm always picking up after you boys.", "Whatever it takes."],
    "scarlet-witch": ["You took everything from me.", "I don't need you to tell me who I am.", "I can't feel you.", "You break the rules and become a hero."],
    "thanos": ["I am inevitable.", "Perfectly balanced, as all things should be.", "Dread it. Run from it.", "Fine, I'll do it myself."],
    "loki": ["I am burdened with glorious purpose.", "Kneel before me.", "The sun will shine on us again.", "I assure you, brother."],
    "star-lord": ["I'm Star-Lord, man.", "We're the freakin' Guardians of the Galaxy.", "I'm gonna make some weird stuff.", "Dance off, bro."],
};

/* ═══════════════════════════════════════════════════════════════
   VOICE NARRATOR HOOK
   ═══════════════════════════════════════════════════════════════ */
function useVoiceNarrator() {
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
        // Load voices
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.getVoices();
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 0.9;
        utterance.volume = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v =>
            v.name.includes("Daniel") || v.name.includes("Google UK English Male") ||
            v.name.includes("Microsoft David") || v.name.includes("Alex")
        ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
        if (preferred) utterance.voice = preferred;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
    }, [supported]);

    const stop = useCallback(() => {
        if (supported) { window.speechSynthesis.cancel(); setSpeaking(false); }
    }, [supported]);

    return { speak, stop, speaking, supported };
}

/* ═══════════════════════════════════════════════════════════════
   WEBCAM HOOK
   ═══════════════════════════════════════════════════════════════ */
function useWebcam() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [active, setActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const start = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setActive(true);
            setError(null);
        } catch {
            setError("Camera access denied. Please allow camera permissions.");
            setActive(false);
        }
    }, []);

    const stop = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) videoRef.current.srcObject = null;
        setActive(false);
    }, []);

    useEffect(() => () => { stop(); }, [stop]);

    return { videoRef, active, error, start, stop };
}

/* ═══════════════════════════════════════════════════════════════
   AR HUD OVERLAY — drawn on canvas over webcam
   ═══════════════════════════════════════════════════════════════ */
function ARHUDOverlay({
    character,
    speaking,
    maskActive,
    helmetClosing,
}: {
    character: Character;
    speaking: boolean;
    maskActive: boolean;
    helmetClosing: boolean;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.clientWidth * window.devicePixelRatio;
            canvas.height = canvas.clientHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener("resize", resize);

        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        let time = 0;

        // Floating particles
        const particles: { x: number; y: number; vx: number; vy: number; r: number; life: number; maxLife: number }[] = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2.5 + 0.5, life: Math.random() * 150, maxLife: 150 + Math.random() * 100,
            });
        }

        const mask = characterMasks[character.id] || defaultMask;
        const primaryRGB = mask.maskColor === "#B22222" ? "178,34,34" :
            mask.maskColor === "#CC0000" ? "204,0,0" :
                mask.maskColor === "#A855F7" ? "168,85,247" : "237,29,36";

        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);
            time += 0.016;

            // === Corner brackets ===
            const m = 30;
            const bSize = 50;
            ctx.strokeStyle = `rgba(${primaryRGB},0.5)`;
            ctx.lineWidth = 2;
            [[m, m, m + bSize, m, m, m + bSize], [w - m, m, w - m - bSize, m, w - m, m + bSize],
            [m, h - m, m + bSize, h - m, m, h - m - bSize], [w - m, h - m, w - m - bSize, h - m, w - m, h - m - bSize]]
                .forEach(([x1, y1, x2, y2, x3, y3]) => {
                    ctx.beginPath();
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(x1, y1);
                    ctx.lineTo(x3, y3);
                    ctx.stroke();
                });

            // === Scanning line ===
            const scanY = (time * 60) % h;
            ctx.strokeStyle = `rgba(${primaryRGB},0.12)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(w, scanY);
            ctx.stroke();

            // === Target reticle (center) ===
            const cx = w / 2;
            const cy = h / 2;
            const rSize = 45 + (speaking ? Math.sin(time * 6) * 15 : Math.sin(time * 2) * 5);
            ctx.strokeStyle = `rgba(${primaryRGB},0.4)`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(cx, cy, rSize, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, rSize * 0.5, 0, Math.PI * 2); ctx.stroke();
            // Crosshairs
            const gap = 12;
            ctx.beginPath();
            ctx.moveTo(cx - rSize - 8, cy); ctx.lineTo(cx - gap, cy);
            ctx.moveTo(cx + gap, cy); ctx.lineTo(cx + rSize + 8, cy);
            ctx.moveTo(cx, cy - rSize - 8); ctx.lineTo(cx, cy - gap);
            ctx.moveTo(cx, cy + gap); ctx.lineTo(cx, cy + rSize + 8);
            ctx.stroke();

            // === Character face mask overlay ===
            if (maskActive) {
                const faceW = w * 0.28;
                const faceH = h * 0.4;
                mask.drawMask(ctx, w, h, cx, cy - h * 0.05, faceW, faceH, time);
            }

            // === Helmet closing animation ===
            if (helmetClosing) {
                const progress = Math.min(1, (time % 3) / 1.5);
                const topY = cy - h * 0.25 + (cy - h * 0.05) * progress * 0.5;
                const botY = cy + h * 0.25 - (cy + h * 0.05) * progress * 0.3;
                ctx.fillStyle = `rgba(${primaryRGB}, ${0.3 * progress})`;
                ctx.fillRect(cx - w * 0.2, 0, w * 0.4, topY);
                ctx.fillRect(cx - w * 0.2, botY, w * 0.4, h - botY);
            }

            // === Top-left info HUD ===
            ctx.font = "bold 13px Inter, sans-serif";
            ctx.fillStyle = `rgba(${primaryRGB},0.9)`;
            ctx.textAlign = "left";
            ctx.fillText(`TARGET: ${character.name.toUpperCase()}`, m + 8, m + bSize + 20);
            ctx.font = "10px Inter, sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillText(character.alias, m + 8, m + bSize + 36);

            // Power bar
            const barX = m + 8;
            const barY = m + bSize + 46;
            const barW = 130;
            const avgP = Math.round(Object.values(character.stats).reduce((a: number, b: number) => a + b, 0) / 6);
            ctx.fillStyle = "rgba(255,255,255,0.08)";
            ctx.fillRect(barX, barY, barW, 4);
            ctx.fillStyle = `rgba(${primaryRGB},0.8)`;
            ctx.fillRect(barX, barY, barW * (avgP / 100), 4);
            ctx.font = "9px Inter, sans-serif";
            ctx.fillStyle = `rgba(${primaryRGB},0.8)`;
            ctx.fillText(`PWR ${avgP}%`, barX + barW + 8, barY + 4);

            // === Energy bars (right side) ===
            const stats = Object.entries(character.stats);
            const statBarX = w - m - 120;
            stats.forEach(([key, val], i) => {
                const y = m + bSize + 18 + i * 18;
                ctx.font = "8px monospace";
                ctx.fillStyle = "rgba(255,255,255,0.3)";
                ctx.textAlign = "right";
                ctx.fillText(key.toUpperCase().slice(0, 3), statBarX - 4, y + 3);
                ctx.fillStyle = "rgba(255,255,255,0.06)";
                ctx.fillRect(statBarX, y, 100, 5);
                ctx.fillStyle = `rgba(${primaryRGB},${0.5 + Math.sin(time * 2 + i) * 0.2})`;
                ctx.fillRect(statBarX, y, 100 * ((val as number) / 100), 5);
            });

            // === Voice glow pulse ===
            if (speaking) {
                const pulseR = 60 + Math.sin(time * 8) * 20;
                const grad = ctx.createRadialGradient(cx, cy + h * 0.3, 0, cx, cy + h * 0.3, pulseR);
                grad.addColorStop(0, `rgba(${primaryRGB},0.3)`);
                grad.addColorStop(1, `rgba(${primaryRGB},0)`);
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(cx, cy + h * 0.3, pulseR, 0, Math.PI * 2); ctx.fill();
            }

            // === Particles ===
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy; p.life++;
                if (p.life > p.maxLife || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
                    p.x = Math.random() * w; p.y = Math.random() * h; p.life = 0;
                }
                const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.4;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${primaryRGB},${alpha})`;
                ctx.fill();
            });

            // === Timestamp ===
            ctx.font = "9px monospace";
            ctx.fillStyle = "rgba(255,255,255,0.25)";
            ctx.textAlign = "right";
            const now = new Date();
            ctx.fillText(
                `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`,
                w - m - 8, h - m - 8
            );

            // === Status indicator ===
            ctx.textAlign = "left";
            ctx.fillStyle = maskActive ? "rgba(34,197,94,0.6)" : "rgba(255,255,255,0.3)";
            ctx.font = "9px monospace";
            ctx.fillText(maskActive ? "● MASK ACTIVE" : "○ MASK STANDBY", m + 8, h - m - 8);

            frameRef.current = requestAnimationFrame(draw);
        }

        frameRef.current = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", resize); };
    }, [character, speaking, maskActive, helmetClosing]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
}

/* ═══════════════════════════════════════════════════════════════
   VOICE COMMAND BOX
   ═══════════════════════════════════════════════════════════════ */
function VoiceCommandBox({
    line,
    onClick,
    active,
    color,
}: {
    line: string;
    onClick: () => void;
    active: boolean;
    color: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border whitespace-nowrap ${active
                    ? "text-white shadow-lg"
                    : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
                }`}
            style={active ? { borderColor: color, backgroundColor: `${color}30`, boxShadow: `0 0 15px ${color}30` } : {}}
        >
            {active && <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />}
            &ldquo;{line}&rdquo;
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════════
   CHARACTER SELECTOR CARD
   ═══════════════════════════════════════════════════════════════ */
function CharacterSelectorCard({
    char,
    selected,
    onClick,
}: {
    char: Character;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex-shrink-0 w-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selected ? "border-marvel-red scale-105 shadow-lg shadow-marvel-red/20" : "border-white/10 hover:border-white/30"
                }`}
        >
            <div className="relative w-full aspect-[3/4] bg-black/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={char.imageUrl}
                    alt={char.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                        e.currentTarget.className = "w-full h-full object-contain p-2 opacity-30";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <p className="absolute bottom-1 left-1 right-1 text-[8px] text-white font-bold truncate text-center">{char.name}</p>
            </div>
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN AR EXPERIENCE PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function ARExperiencePage() {
    const searchParams = useSearchParams();
    const webcam = useWebcam();
    const narrator = useVoiceNarrator();
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize from URL param
    const initialCharId = searchParams.get("character") || "iron-man";
    const initialIndex = Math.max(0, characters.findIndex(c => c.id === initialCharId));
    const [selectedChar, setSelectedChar] = useState<Character>(characters[initialIndex] || characters[0]);
    const [charIndex, setCharIndex] = useState(initialIndex);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [maskActive, setMaskActive] = useState(false);
    const [helmetClosing, setHelmetClosing] = useState(false);
    const [activeVoiceLine, setActiveVoiceLine] = useState<string | null>(null);
    const [muted, setMuted] = useState(false);

    const topCharacters = characters.slice(0, 20);
    const voiceLines = characterVoiceLines[selectedChar.id] || selectedChar.quotes.slice(0, 4);
    const mask = characterMasks[selectedChar.id] || defaultMask;

    const selectCharacter = (char: Character, index: number) => {
        setSelectedChar(char);
        setCharIndex(index);
        setMaskActive(false);
        setHelmetClosing(false);
        setActiveVoiceLine(null);
        narrator.stop();
        audioManager.playGlitch();
    };

    const prevChar = () => {
        const i = (charIndex - 1 + topCharacters.length) % topCharacters.length;
        selectCharacter(topCharacters[i], i);
    };
    const nextChar = () => {
        const i = (charIndex + 1) % topCharacters.length;
        selectCharacter(topCharacters[i], i);
    };

    const activateMask = () => {
        setHelmetClosing(true);
        setTimeout(() => {
            setMaskActive(true);
            setHelmetClosing(false);
            // Auto-play first voice line
            if (!muted && voiceLines.length > 0) {
                setActiveVoiceLine(voiceLines[0]);
                narrator.speak(voiceLines[0]);
            }
        }, 1500);
    };

    const playVoiceLine = (line: string) => {
        if (muted) return;
        setActiveVoiceLine(line);
        narrator.speak(line);
    };

    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-black relative" ref={containerRef}>
            {/* Header bar */}
            <div className="absolute top-0 left-0 right-0 z-30 p-3 flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg"
                >
                    <ArrowLeft size={14} /> Exit AR
                </Link>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setMuted(!muted)}
                        className={`p-1.5 rounded-lg backdrop-blur-sm transition-all ${muted ? "bg-red-500/50 text-white" : "bg-black/40 text-white/60 hover:text-white"
                            }`}
                        title={muted ? "Unmute" : "Mute"}
                    >
                        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <button
                        onClick={webcam.active ? webcam.stop : webcam.start}
                        className={`p-1.5 rounded-lg backdrop-blur-sm transition-all ${webcam.active ? "bg-green-500/60 text-white" : "bg-black/40 text-white/60 hover:text-white"
                            }`}
                    >
                        {webcam.active ? <Camera size={16} /> : <CameraOff size={16} />}
                    </button>
                    <button onClick={toggleFullscreen} className="p-1.5 rounded-lg bg-black/40 text-white/60 hover:text-white backdrop-blur-sm">
                        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    </button>
                </div>
            </div>

            {/* Main viewport */}
            <div className="relative w-full h-screen overflow-hidden">
                {/* Webcam video */}
                <video
                    ref={webcam.videoRef}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${webcam.active ? "opacity-100" : "opacity-0"
                        }`}
                    playsInline
                    muted
                    style={{ transform: "scaleX(-1)" }}
                />

                {/* Background when camera off */}
                {!webcam.active && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                backgroundSize: "40px 40px",
                            }}
                        />
                    </div>
                )}

                {/* AR HUD overlay */}
                <ARHUDOverlay
                    character={selectedChar}
                    speaking={narrator.speaking}
                    maskActive={maskActive}
                    helmetClosing={helmetClosing}
                />

                {/* Character poster (right side) */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedChar.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4 }}
                        className="absolute bottom-40 right-4 w-40 h-52 md:w-48 md:h-64 z-20 rounded-xl overflow-hidden"
                        style={{ boxShadow: `0 0 30px ${mask.maskColor}40` }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={selectedChar.imageUrl}
                            alt={selectedChar.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                                e.currentTarget.className = "w-full h-full object-contain p-6 opacity-30";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                            <p className="font-heading text-sm text-white tracking-wider">{selectedChar.name}</p>
                            <p className="text-[10px] text-white/50">{selectedChar.alias}</p>
                        </div>
                        <div className="absolute inset-0 border-2 rounded-xl" style={{ borderColor: `${mask.maskColor}40` }} />
                    </motion.div>
                </AnimatePresence>

                {/* Start prompt (when no camera and mask not active) */}
                {!webcam.active && !maskActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
                    >
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-4">
                            <Sparkles size={40} className="text-marvel-gold" />
                        </motion.div>
                        <h2 className="font-heading text-4xl md:text-5xl text-white tracking-wider mb-2">
                            AR <span className="text-marvel-red">EXPERIENCE</span>
                        </h2>
                        <p className="text-white/40 text-sm mb-6">Enable camera and try character masks</p>
                        <div className="pointer-events-auto flex flex-col items-center gap-3">
                            <button
                                onClick={() => { webcam.start(); }}
                                className="px-6 py-3 bg-marvel-red hover:bg-marvel-red/80 text-white font-heading tracking-wider rounded-lg transition-all flex items-center gap-2"
                            >
                                <Camera size={18} /> ACTIVATE CAMERA
                            </button>
                            <button
                                onClick={activateMask}
                                className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm rounded-lg transition-all border border-white/10 flex items-center gap-2"
                            >
                                <Eye size={16} /> Try Without Camera
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Camera error */}
                {webcam.error && (
                    <div className="absolute top-16 left-4 right-4 z-30 glass rounded-lg p-3 border border-red-500/30 text-center">
                        <p className="text-red-400 text-xs">{webcam.error}</p>
                    </div>
                )}

                {/* Mask control (visible when camera is active) */}
                {webcam.active && !maskActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                        <button
                            onClick={activateMask}
                            className="px-8 py-4 bg-marvel-red/90 hover:bg-marvel-red text-white font-heading text-lg tracking-wider rounded-xl transition-all flex items-center gap-3 shadow-2xl"
                            style={{ boxShadow: `0 0 40px ${mask.maskColor}40` }}
                        >
                            🥽 TRY {selectedChar.name.toUpperCase()}
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Bottom panel: character selector + voice commands */}
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/95 to-transparent pt-6 pb-3 px-3">
                {/* Voice command buttons */}
                {maskActive && voiceLines.length > 0 && (
                    <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {voiceLines.map((line) => (
                            <VoiceCommandBox
                                key={line}
                                line={line}
                                onClick={() => playVoiceLine(line)}
                                active={activeVoiceLine === line && narrator.speaking}
                                color={mask.maskColor}
                            />
                        ))}
                    </div>
                )}

                {/* Character selector */}
                <div className="flex items-center gap-2">
                    <button onClick={prevChar} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                        <ChevronLeft size={16} />
                    </button>
                    <div className="flex-1 overflow-x-auto flex gap-2 scrollbar-hide">
                        {topCharacters.map((char, i) => (
                            <CharacterSelectorCard
                                key={char.id}
                                char={char}
                                selected={char.id === selectedChar.id}
                                onClick={() => selectCharacter(char, i)}
                            />
                        ))}
                    </div>
                    <button onClick={nextChar} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Active mask label */}
                {maskActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 flex items-center justify-center gap-2 text-xs"
                    >
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: mask.maskColor }} />
                        <span style={{ color: mask.maskColor }}>{mask.name} Active</span>
                        <span className="text-white/20">•</span>
                        <button
                            onClick={() => { setMaskActive(false); narrator.stop(); setActiveVoiceLine(null); }}
                            className="text-white/30 hover:text-white text-xs"
                        >
                            Deactivate
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
