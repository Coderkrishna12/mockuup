"use client";

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera, CameraOff, Volume2, VolumeX, ChevronLeft, ChevronRight,
    Sparkles, Maximize, Minimize, ArrowLeft, Eye
} from "lucide-react";
import Link from "next/link";
import { characters, type Character } from "@/data/characters";
import { getDialogueForCharacter, type DialogueLine } from "@/data/characterDialogues";
import { audioManager } from "@/lib/audio";

/* ═══════════════════════════════════════════════════════════════
   MASK ALIGNMENT CONFIG — defines how each PNG sits relative to face
   ═══════════════════════════════════════════════════════════════ */
type MaskPlacement = "face" | "forehead" | "neck";

interface MaskConfig {
    id: string;
    name: string;
    maskFile: string;
    placement: MaskPlacement;
    // Scale relative to face bounding box (1.0 = exactly face size)
    scaleX: number;
    scaleY: number;
    // Offset from face center as fraction of face dimensions
    offsetY: number; // positive = down, negative = up
    // Opacity of the mask overlay
    opacity: number;
    // Accent color for HUD elements
    color: string;
}

const MASK_CONFIGS: MaskConfig[] = [
    // Full face masks — cover entire face, centered on detected face
    { id: "iron-man", name: "Iron Man Helmet", maskFile: "/characters/masks/iron-man.png", placement: "face", scaleX: 1.5, scaleY: 1.6, offsetY: -0.05, opacity: 0.92, color: "#B22222" },
    { id: "spider-man", name: "Spider-Man Mask", maskFile: "/characters/masks/spider-man.png", placement: "face", scaleX: 1.4, scaleY: 1.5, offsetY: -0.05, opacity: 0.90, color: "#CC0000" },
    { id: "captain-america", name: "Captain America Cowl", maskFile: "/characters/masks/captain-america.png", placement: "face", scaleX: 1.5, scaleY: 1.6, offsetY: -0.05, opacity: 0.90, color: "#2563EB" },
    { id: "black-panther", name: "Black Panther Mask", maskFile: "/characters/masks/black-panther.png", placement: "face", scaleX: 1.5, scaleY: 1.6, offsetY: -0.05, opacity: 0.90, color: "#7C3AED" },
    { id: "hulk", name: "Hulk Face", maskFile: "/characters/masks/hulk.png", placement: "face", scaleX: 1.6, scaleY: 1.6, offsetY: -0.05, opacity: 0.85, color: "#22C55E" },
    { id: "thanos", name: "Thanos Face", maskFile: "/characters/masks/thanos.png", placement: "face", scaleX: 1.6, scaleY: 1.7, offsetY: -0.05, opacity: 0.88, color: "#7C3AED" },
    { id: "ant-man", name: "Ant-Man Helmet", maskFile: "/characters/masks/ant-man.png", placement: "face", scaleX: 1.5, scaleY: 1.6, offsetY: -0.05, opacity: 0.90, color: "#DC2626" },
    { id: "war-machine", name: "War Machine Helmet", maskFile: "/characters/masks/war-machine.png", placement: "face", scaleX: 1.5, scaleY: 1.6, offsetY: -0.05, opacity: 0.90, color: "#6B7280" },
    // Forehead helmet — positioned higher, covers top of head
    { id: "thor", name: "Thor's Winged Helm", maskFile: "/characters/masks/thor.png", placement: "forehead", scaleX: 1.8, scaleY: 1.3, offsetY: -0.45, opacity: 0.88, color: "#3B82F6" },
    // Necklace — positioned at neck/chest area, below face
    { id: "doctor-strange", name: "Eye of Agamotto", maskFile: "/characters/masks/doctor-strange.png", placement: "neck", scaleX: 0.8, scaleY: 0.6, offsetY: 0.85, opacity: 0.92, color: "#A855F7" },
];

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
   HUD OVERLAY — scanlines, brackets, reticle, stats (NO mask drawing)
   ═══════════════════════════════════════════════════════════════ */
function ARHUDOverlay({
    character,
    speaking,
    maskActive,
    color,
}: {
    character: Character;
    speaking: boolean;
    maskActive: boolean;
    color: string;
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

        // Determine primary colour as RGB
        const hexToRGB = (hex: string) => {
            const c = hex.replace("#", "");
            return `${parseInt(c.slice(0, 2), 16)},${parseInt(c.slice(2, 4), 16)},${parseInt(c.slice(4, 6), 16)}`;
        };
        const primaryRGB = hexToRGB(color);

        // Particles
        const particles: { x: number; y: number; vx: number; vy: number; r: number; life: number; maxLife: number }[] = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2.5 + 0.5, life: Math.random() * 150, maxLife: 150 + Math.random() * 100,
            });
        }

        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);
            time += 0.016;

            // Corner brackets
            const m = 30, bSize = 50;
            ctx.strokeStyle = `rgba(${primaryRGB},0.5)`;
            ctx.lineWidth = 2;
            ([[m, m, m + bSize, m, m, m + bSize], [w - m, m, w - m - bSize, m, w - m, m + bSize],
            [m, h - m, m + bSize, h - m, m, h - m - bSize], [w - m, h - m, w - m - bSize, h - m, w - m, h - m - bSize]] as number[][])
                .forEach(([x1, y1, x2, y2, x3, y3]) => {
                    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x1, y1); ctx.lineTo(x3, y3); ctx.stroke();
                });

            // Scanning line
            const scanY = (time * 60) % h;
            ctx.strokeStyle = `rgba(${primaryRGB},0.12)`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(w, scanY); ctx.stroke();

            // Target reticle
            const cx = w / 2, cy = h / 2;
            const rSize = 45 + (speaking ? Math.sin(time * 6) * 15 : Math.sin(time * 2) * 5);
            ctx.strokeStyle = `rgba(${primaryRGB},0.4)`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(cx, cy, rSize, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, rSize * 0.5, 0, Math.PI * 2); ctx.stroke();
            const gap = 12;
            ctx.beginPath();
            ctx.moveTo(cx - rSize - 8, cy); ctx.lineTo(cx - gap, cy);
            ctx.moveTo(cx + gap, cy); ctx.lineTo(cx + rSize + 8, cy);
            ctx.moveTo(cx, cy - rSize - 8); ctx.lineTo(cx, cy - gap);
            ctx.moveTo(cx, cy + gap); ctx.lineTo(cx, cy + rSize + 8);
            ctx.stroke();

            // Top-left character info
            ctx.font = "bold 13px Inter, sans-serif";
            ctx.fillStyle = `rgba(${primaryRGB},0.9)`;
            ctx.textAlign = "left";
            ctx.fillText(`TARGET: ${character.name.toUpperCase()}`, m + 8, m + bSize + 20);
            ctx.font = "10px Inter, sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillText(character.alias, m + 8, m + bSize + 36);

            // Power bar
            const barX = m + 8, barY = m + bSize + 46, barW = 130;
            const avgP = Math.round(Object.values(character.stats).reduce((a: number, b: number) => a + b, 0) / 6);
            ctx.fillStyle = "rgba(255,255,255,0.08)";
            ctx.fillRect(barX, barY, barW, 4);
            ctx.fillStyle = `rgba(${primaryRGB},0.8)`;
            ctx.fillRect(barX, barY, barW * (avgP / 100), 4);
            ctx.font = "9px Inter, sans-serif";
            ctx.fillStyle = `rgba(${primaryRGB},0.8)`;
            ctx.fillText(`PWR ${avgP}%`, barX + barW + 8, barY + 4);

            // Right-side stat bars
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

            // Voice glow pulse
            if (speaking) {
                const pulseR = 60 + Math.sin(time * 8) * 20;
                const grad = ctx.createRadialGradient(cx, cy + h * 0.3, 0, cx, cy + h * 0.3, pulseR);
                grad.addColorStop(0, `rgba(${primaryRGB},0.3)`);
                grad.addColorStop(1, `rgba(${primaryRGB},0)`);
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(cx, cy + h * 0.3, pulseR, 0, Math.PI * 2); ctx.fill();
            }

            // Particles
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

            // Timestamp
            ctx.font = "9px monospace";
            ctx.fillStyle = "rgba(255,255,255,0.25)";
            ctx.textAlign = "right";
            const now = new Date();
            ctx.fillText(
                `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`,
                w - m - 8, h - m - 8
            );

            // Status
            ctx.textAlign = "left";
            ctx.fillStyle = maskActive ? "rgba(34,197,94,0.6)" : "rgba(255,255,255,0.3)";
            ctx.font = "9px monospace";
            ctx.fillText(maskActive ? "● MASK ACTIVE" : "○ MASK STANDBY", m + 8, h - m - 8);

            frameRef.current = requestAnimationFrame(draw);
        }

        frameRef.current = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", resize); };
    }, [character, speaking, maskActive, color]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
}

/* ═══════════════════════════════════════════════════════════════
   MASK CANVAS — draws face-tracked PNG mask on top of video
   ═══════════════════════════════════════════════════════════════ */
function MaskOverlayCanvas({
    videoRef,
    maskConfig,
    active,
}: {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    maskConfig: MaskConfig;
    active: boolean;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const maskImgRef = useRef<HTMLImageElement | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detectorRef = useRef<any>(null);
    const detectorReadyRef = useRef(false);

    // Load mask image whenever config changes
    useEffect(() => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = maskConfig.maskFile;
        img.onload = () => { maskImgRef.current = img; };
        img.onerror = () => { maskImgRef.current = null; };
    }, [maskConfig.maskFile]);

    // Init MediaPipe face detector once
    useEffect(() => {
        let cancelled = false;

        async function init() {
            try {
                const vision = await import("@mediapipe/tasks-vision");
                const { FaceDetector, FilesetResolver } = vision;
                const fileset = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );
                const detector = await FaceDetector.createFromOptions(fileset, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
                        delegate: "GPU",
                    },
                    runningMode: "VIDEO",
                    minDetectionConfidence: 0.5,
                });
                if (!cancelled) {
                    detectorRef.current = detector;
                    detectorReadyRef.current = true;
                }
            } catch (err) {
                console.warn("Face detector init failed:", err);
                if (!cancelled) detectorReadyRef.current = true; // fallback
            }
        }

        init();
        return () => { cancelled = true; };
    }, []);

    // Render loop
    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let running = true;

        const renderFrame = () => {
            if (!running) return;
            if (!video.videoWidth || !video.videoHeight) {
                animRef.current = requestAnimationFrame(renderFrame);
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const W = canvas.width;
            const H = canvas.height;

            // Face detection
            let faceX = W * 0.3;
            let faceY = H * 0.15;
            let faceW = W * 0.4;
            let faceH = H * 0.55;

            if (detectorRef.current && detectorReadyRef.current) {
                try {
                    const result = detectorRef.current.detectForVideo(video, performance.now());
                    if (result.detections && result.detections.length > 0) {
                        const d = result.detections[0];
                        if (d.boundingBox) {
                            // Mirror the x coordinate since video is flipped
                            faceX = W - (d.boundingBox.originX + d.boundingBox.width);
                            faceY = d.boundingBox.originY;
                            faceW = d.boundingBox.width;
                            faceH = d.boundingBox.height;
                        }
                    }
                } catch {
                    // Use defaults
                }
            }

            ctx.clearRect(0, 0, W, H);

            if (maskImgRef.current) {
                // Calculate mask position based on placement type
                const faceCX = faceX + faceW / 2;
                const faceCY = faceY + faceH / 2;

                const maskW = faceW * maskConfig.scaleX;
                const maskH = faceH * maskConfig.scaleY;
                const maskX = faceCX - maskW / 2;
                const maskY = faceCY - maskH / 2 + faceH * maskConfig.offsetY;

                ctx.globalAlpha = maskConfig.opacity;
                ctx.drawImage(maskImgRef.current, maskX, maskY, maskW, maskH);
                ctx.globalAlpha = 1;
            }

            animRef.current = requestAnimationFrame(renderFrame);
        };

        animRef.current = requestAnimationFrame(renderFrame);
        return () => {
            running = false;
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [active, videoRef, maskConfig]);

    if (!active) return null;
    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-[5] pointer-events-none"
            style={{ transform: "scaleX(-1)", objectFit: "cover" }}
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   VOICE COMMAND BOX — plays real MP3 files only
   ═══════════════════════════════════════════════════════════════ */
function VoiceCommandBox({
    line,
    onClick,
    active,
    color,
}: {
    line: DialogueLine;
    onClick: () => void;
    active: boolean;
    color: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 whitespace-nowrap flex items-center gap-2.5 ${active
                ? "text-white shadow-xl scale-105"
                : "border-white/10 bg-black/40 backdrop-blur-lg text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5"
                }`}
            style={active ? { borderColor: color, backgroundColor: `${color}25`, boxShadow: `0 0 25px ${color}40, inset 0 0 15px ${color}10` } : {}}
        >
            {active ? (
                <span className="flex gap-[3px] items-end h-4">
                    {[0, 1, 2, 3].map((i) => (
                        <span
                            key={i}
                            className="w-[3px] rounded-full"
                            style={{
                                backgroundColor: color,
                                animation: `waveform 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
                                height: `${8 + Math.random() * 8}px`,
                            }}
                        />
                    ))}
                </span>
            ) : (
                <Volume2 size={14} className="opacity-50 shrink-0" />
            )}
            <span>{line.label}</span>
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════════
   CHARACTER SELECTOR CARD
   ═══════════════════════════════════════════════════════════════ */
function CharacterSelectorCard({
    maskCfg,
    selected,
    onClick,
}: {
    maskCfg: MaskConfig;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex-shrink-0 w-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selected ? "scale-105 shadow-lg" : "border-white/10 hover:border-white/30"
                }`}
            style={selected ? { borderColor: maskCfg.color, boxShadow: `0 0 15px ${maskCfg.color}40` } : {}}
        >
            <div className="relative w-full aspect-[3/4] bg-black/60 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={maskCfg.maskFile}
                    alt={maskCfg.name}
                    className="w-full h-full object-contain p-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <p className="absolute bottom-1 left-1 right-1 text-[8px] text-white font-bold truncate text-center">
                    {maskCfg.name.split(" ")[0]}
                </p>
            </div>
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN AR EXPERIENCE PAGE
   ═══════════════════════════════════════════════════════════════ */
function ARPageInner() {
    const searchParams = useSearchParams();
    const webcam = useWebcam();
    const containerRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize from URL param
    const initialCharId = searchParams.get("character") || "iron-man";
    const initialIndex = Math.max(0, MASK_CONFIGS.findIndex(c => c.id === initialCharId));
    const [selectedIdx, setSelectedIdx] = useState(initialIndex);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [maskActive, setMaskActive] = useState(false);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [subtitle, setSubtitle] = useState<string | null>(null);
    const [muted, setMuted] = useState(false);

    const currentMask = MASK_CONFIGS[selectedIdx];
    const selectedChar = useMemo(() =>
        characters.find(c => c.id === currentMask.id) || characters[0],
        [currentMask.id]
    );
    const dialogue = getDialogueForCharacter(currentMask.id);

    const selectMask = (index: number) => {
        setSelectedIdx(index);
        setMaskActive(false);
        stopAudio();
        audioManager.playGlitch();
    };

    const prevChar = () => selectMask((selectedIdx - 1 + MASK_CONFIGS.length) % MASK_CONFIGS.length);
    const nextChar = () => selectMask((selectedIdx + 1) % MASK_CONFIGS.length);

    const activateMask = () => {
        setMaskActive(true);
    };

    const stopAudio = useCallback(() => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setPlayingId(null);
        setTimeout(() => setSubtitle(null), 400);
    }, []);

    const playVoiceLine = useCallback((line: DialogueLine) => {
        if (muted) return;
        stopAudio();
        const audio = new Audio(line.audioFile);
        audioRef.current = audio;
        setPlayingId(line.id);
        setSubtitle(line.subtitle);
        audio.play().catch(() => {
            setTimeout(() => { setPlayingId(null); setSubtitle(null); }, 2500);
        });
        audio.onended = () => {
            setTimeout(() => { setPlayingId(null); setSubtitle(null); }, 600);
        };
    }, [muted, stopAudio]);

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

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        };
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
                        onClick={() => { setMuted(!muted); if (!muted) stopAudio(); }}
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

                {/* PNG Mask overlay (tracked to face via MediaPipe) */}
                <MaskOverlayCanvas
                    videoRef={webcam.videoRef}
                    maskConfig={currentMask}
                    active={maskActive && webcam.active}
                />

                {/* HUD overlay */}
                <ARHUDOverlay
                    character={selectedChar}
                    speaking={!!playingId}
                    maskActive={maskActive}
                    color={currentMask.color}
                />

                {/* Character poster (right side) */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentMask.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4 }}
                        className="absolute bottom-40 right-4 w-40 h-52 md:w-48 md:h-64 z-20 rounded-xl overflow-hidden"
                        style={{ boxShadow: `0 0 30px ${currentMask.color}40` }}
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
                        <div className="absolute inset-0 border-2 rounded-xl" style={{ borderColor: `${currentMask.color}40` }} />
                    </motion.div>
                </AnimatePresence>

                {/* Start prompt */}
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
                        <p className="text-white/40 text-sm mb-2">Try character masks with your camera — real PNG masks overlaid on your face</p>
                        <p className="text-white/30 text-xs mb-6">
                            Currently selected: <span style={{ color: currentMask.color }}>{currentMask.name}</span>
                            {currentMask.placement === "neck" ? " (worn at neck)" : currentMask.placement === "forehead" ? " (worn on forehead)" : " (face mask)"}
                        </p>
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
                                <Eye size={16} /> Preview Without Camera
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

                {/* Activate mask button when camera is active but mask not yet active */}
                {webcam.active && !maskActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                        <button
                            onClick={activateMask}
                            className="px-8 py-4 rounded-xl text-white font-heading tracking-wider text-lg transition-all flex items-center gap-3 border"
                            style={{
                                backgroundColor: `${currentMask.color}30`,
                                borderColor: `${currentMask.color}60`,
                                boxShadow: `0 0 40px ${currentMask.color}30`,
                            }}
                        >
                            <Sparkles size={20} /> ACTIVATE {currentMask.name.toUpperCase()}
                        </button>
                    </motion.div>
                )}

                {/* Subtitle overlay */}
                <AnimatePresence>
                    {subtitle && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-44 left-4 right-4 md:left-1/4 md:right-1/4 z-30 text-center"
                        >
                            <span className="inline-block px-6 py-3 rounded-xl bg-black/80 backdrop-blur-lg text-white text-sm font-medium italic border border-white/10">
                                &quot;{subtitle}&quot;
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 z-30">
                {/* Voice lines */}
                {dialogue && dialogue.lines.length > 0 && (
                    <div className="px-4 pb-3">
                        <style>{`@keyframes waveform { 0% { height: 4px; } 100% { height: 16px; } }`}</style>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Volume2 size={10} /> Voice Lines — {currentMask.name}
                        </p>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {dialogue.lines.map((line: DialogueLine) => (
                                <VoiceCommandBox
                                    key={line.id}
                                    line={line}
                                    active={playingId === line.id}
                                    color={currentMask.color}
                                    onClick={() => playingId === line.id ? stopAudio() : playVoiceLine(line)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Character selector strip */}
                <div className="glass-strong border-t border-white/10 p-3">
                    <div className="flex items-center gap-2 max-w-4xl mx-auto">
                        <button onClick={prevChar} className="p-1.5 text-white/40 hover:text-white">
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide py-1">
                            {MASK_CONFIGS.map((cfg, i) => (
                                <CharacterSelectorCard
                                    key={cfg.id}
                                    maskCfg={cfg}
                                    selected={selectedIdx === i}
                                    onClick={() => selectMask(i)}
                                />
                            ))}
                        </div>
                        <button onClick={nextChar} className="p-1.5 text-white/40 hover:text-white">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-white/20 mt-1">
                        {currentMask.name} • {currentMask.placement === "neck" ? "Necklace (worn at neck)" : currentMask.placement === "forehead" ? "Helmet (worn on forehead)" : "Face Mask"} • {selectedIdx + 1} of {MASK_CONFIGS.length}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ARExperiencePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/40 font-heading text-xl tracking-wider animate-pulse">LOADING AR...</div>
            </div>
        }>
            <ARPageInner />
        </Suspense>
    );
}