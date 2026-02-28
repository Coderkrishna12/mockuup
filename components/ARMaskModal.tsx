"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, CameraOff, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { getDialogueForCharacter, type DialogueLine } from "@/data/characterDialogues";

interface MaskCharacter {
    id: string;
    name: string;
    maskFile: string;
}

const MASK_CHARACTERS: MaskCharacter[] = [
    { id: "iron-man", name: "Iron Man", maskFile: "/characters/masks/iron-man.png" },
    { id: "spider-man", name: "Spider-Man", maskFile: "/characters/masks/spider-man.png" },
    { id: "captain-america", name: "Captain America", maskFile: "/characters/masks/captain-america.png" },
    { id: "thor", name: "Thor", maskFile: "/characters/masks/thor.png" },
    { id: "hulk", name: "Hulk", maskFile: "/characters/masks/hulk.png" },
    { id: "black-panther", name: "Black Panther", maskFile: "/characters/masks/black-panther.png" },
    { id: "doctor-strange", name: "Doctor Strange", maskFile: "/characters/masks/doctor-strange.png" },
    { id: "thanos", name: "Thanos", maskFile: "/characters/masks/thanos.png" },
    { id: "ant-man", name: "Ant-Man", maskFile: "/characters/masks/ant-man.png" },
    { id: "war-machine", name: "War Machine", maskFile: "/characters/masks/war-machine.png" },
];

interface Props {
    initialCharacterId?: string;
    onClose: () => void;
}

export default function ARMaskModal({ initialCharacterId, onClose }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);
    const streamRef = useRef<MediaStream | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const maskImgRef = useRef<HTMLImageElement | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detectorRef = useRef<any>(null);

    const initialIdx = MASK_CHARACTERS.findIndex((c) => c.id === initialCharacterId);
    const [selectedIdx, setSelectedIdx] = useState(initialIdx >= 0 ? initialIdx : 0);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [detectorReady, setDetectorReady] = useState(false);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [subtitle, setSubtitle] = useState<string | null>(null);

    const currentChar = MASK_CHARACTERS[selectedIdx];
    const dialogue = getDialogueForCharacter(currentChar.id);

    // Load mask image when character changes
    useEffect(() => {
        const img = new Image();
        img.src = currentChar.maskFile;
        img.onload = () => { maskImgRef.current = img; };
        img.onerror = () => { maskImgRef.current = null; };
    }, [currentChar.maskFile]);

    // Init face detector
    useEffect(() => {
        let cancelled = false;

        async function initDetector() {
            try {
                const vision = await import("@mediapipe/tasks-vision");
                const { FaceDetector, FilesetResolver } = vision;

                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                const detector = await FaceDetector.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
                        delegate: "GPU",
                    },
                    runningMode: "VIDEO",
                    minDetectionConfidence: 0.5,
                });

                if (!cancelled) {
                    detectorRef.current = {
                        detect: (video: HTMLVideoElement) => {
                            const result = detector.detectForVideo(video, performance.now());
                            return Promise.resolve(result);
                        }
                    };
                    setDetectorReady(true);
                }
            } catch (err) {
                console.warn("Face detector init failed, using fallback mode:", err);
                if (!cancelled) setDetectorReady(true); // allow fallback
            }
        }

        initDetector();
        return () => { cancelled = true; };
    }, []);

    // Start camera
    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setCameraActive(true);
            setCameraError(null);
        } catch {
            setCameraError("Camera access denied. Please allow camera permissions.");
        }
    }, []);

    // Stop camera
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        setCameraActive(false);
    }, []);

    // Render loop: draw video + mask overlay
    useEffect(() => {
        if (!cameraActive || !videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let running = true;

        const renderFrame = async () => {
            if (!running || !video.videoWidth) {
                animFrameRef.current = requestAnimationFrame(renderFrame);
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Mirror the video
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0);
            ctx.restore();

            // Face detection + mask overlay
            if (maskImgRef.current) {
                let faceX = canvas.width * 0.25;
                let faceY = canvas.height * 0.1;
                let faceW = canvas.width * 0.5;
                let faceH = canvas.height * 0.6;

                if (detectorRef.current) {
                    try {
                        const result = await detectorRef.current.detect(video);
                        if (result.detections && result.detections.length > 0) {
                            const face = result.detections[0].boundingBox;
                            // Mirror the x coordinate
                            faceX = canvas.width - (face.originX + face.width);
                            faceY = face.originY;
                            faceW = face.width;
                            faceH = face.height;
                        }
                    } catch {
                        // Use default center position
                    }
                }

                // Scale mask slightly larger than face
                const maskScale = 1.6;
                const maskW = faceW * maskScale;
                const maskH = faceH * maskScale;
                const maskX = faceX + (faceW - maskW) / 2;
                const maskY = faceY + (faceH - maskH) / 2 - faceH * 0.1;

                ctx.globalAlpha = 0.88;
                ctx.drawImage(maskImgRef.current, maskX, maskY, maskW, maskH);
                ctx.globalAlpha = 1;
            }

            animFrameRef.current = requestAnimationFrame(renderFrame);
        };

        animFrameRef.current = requestAnimationFrame(renderFrame);
        return () => {
            running = false;
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [cameraActive]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
            if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        };
    }, [stopCamera]);

    // Voice playback
    const stopAudio = useCallback(() => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setPlayingId(null);
        setSubtitle(null);
    }, []);

    const playLine = useCallback((line: DialogueLine) => {
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
    }, [stopAudio]);

    // Switch character
    const prevChar = () => { stopAudio(); setSelectedIdx((i) => (i - 1 + MASK_CHARACTERS.length) % MASK_CHARACTERS.length); };
    const nextChar = () => { stopAudio(); setSelectedIdx((i) => (i + 1) % MASK_CHARACTERS.length); };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-xl flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <span className="text-lg">🥽</span>
                    <div>
                        <h2 className="font-heading text-xl text-white tracking-wider">AR MASK MODE</h2>
                        <p className="text-[10px] text-white/40">Try on character masks with your camera</p>
                    </div>
                </div>
                <button onClick={() => { stopCamera(); stopAudio(); onClose(); }} className="p-2 text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
                {/* Camera view */}
                <div className="flex-1 relative rounded-2xl overflow-hidden bg-black border border-white/10">
                    {/* Hidden video element for camera */}
                    <video ref={videoRef} className="hidden" playsInline muted />

                    {/* Canvas with mask overlay */}
                    {cameraActive ? (
                        <canvas ref={canvasRef} className="w-full h-full object-contain" />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            {/* Mask preview when camera is off */}
                            <div className="relative w-40 h-40">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={currentChar.maskFile}
                                    alt={currentChar.name}
                                    className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(237,29,36,0.4)]"
                                />
                            </div>
                            <p className="text-white/60 text-sm">{currentChar.name} Mask</p>
                            {cameraError ? (
                                <p className="text-red-400 text-xs text-center max-w-xs">{cameraError}</p>
                            ) : (
                                <button
                                    onClick={startCamera}
                                    className="px-6 py-3 rounded-xl bg-marvel-red hover:bg-red-700 text-white text-sm font-medium transition-all flex items-center gap-2"
                                >
                                    <Camera size={16} /> Start Camera
                                </button>
                            )}
                            {!detectorReady && (
                                <p className="text-white/30 text-[10px] flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" /> Loading face detection model...
                                </p>
                            )}
                        </div>
                    )}

                    {/* Camera controls overlay */}
                    {cameraActive && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                            <button
                                onClick={stopCamera}
                                className="px-4 py-2 rounded-xl bg-red-600/80 backdrop-blur text-white text-xs font-medium flex items-center gap-1.5 hover:bg-red-600 transition-all"
                            >
                                <CameraOff size={14} /> Stop Camera
                            </button>
                        </div>
                    )}

                    {/* Subtitle overlay */}
                    <AnimatePresence>
                        {subtitle && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute bottom-16 left-4 right-4 text-center"
                            >
                                <span className="inline-block px-6 py-3 rounded-xl bg-black/80 backdrop-blur-lg text-white text-sm font-medium italic border border-white/10">
                                    &quot;{subtitle}&quot;
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right panel: Character switcher + Voice lines */}
                <div className="w-full md:w-72 flex flex-col gap-4">
                    {/* Character Switcher */}
                    <div className="glass rounded-xl p-4 border border-white/5">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Character Mask</p>
                        <div className="flex items-center gap-2">
                            <button onClick={prevChar} className="p-2 text-white/40 hover:text-white transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex-1 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={currentChar.maskFile} alt="" className="w-full h-full object-contain p-0.5" />
                                </div>
                                <div>
                                    <p className="text-sm text-white font-medium">{currentChar.name}</p>
                                    <p className="text-[10px] text-white/30">{selectedIdx + 1} of {MASK_CHARACTERS.length}</p>
                                </div>
                            </div>
                            <button onClick={nextChar} className="p-2 text-white/40 hover:text-white transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Quick mask thumbnails */}
                        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                            {MASK_CHARACTERS.map((c, i) => (
                                <button
                                    key={c.id}
                                    onClick={() => { stopAudio(); setSelectedIdx(i); }}
                                    className={`flex-shrink-0 w-9 h-9 rounded-lg border transition-all overflow-hidden ${i === selectedIdx ? "border-marvel-red bg-marvel-red/10 scale-110" : "border-white/10 bg-white/5 hover:border-white/30"}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={c.maskFile} alt={c.name} className="w-full h-full object-contain p-0.5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Voice Lines */}
                    <div className="glass rounded-xl p-4 border border-white/5 flex-1 overflow-y-auto">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <Volume2 size={10} /> Voice Lines
                        </p>
                        {dialogue && dialogue.lines.length > 0 ? (
                            <div className="space-y-2">
                                {dialogue.lines.map((line) => {
                                    const isPlaying = playingId === line.id;
                                    return (
                                        <button
                                            key={line.id}
                                            onClick={() => isPlaying ? stopAudio() : playLine(line)}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all border ${isPlaying
                                                ? "border-marvel-red bg-marvel-red/10 text-marvel-red"
                                                : "border-white/5 bg-white/3 text-white/60 hover:bg-white/5 hover:text-white/80"
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {isPlaying ? (
                                                    <span className="flex gap-[2px]">
                                                        {[0, 1, 2].map((i) => (
                                                            <span key={i} className="w-[3px] h-3 bg-marvel-red rounded-full animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                                                        ))}
                                                    </span>
                                                ) : (
                                                    <Volume2 size={12} className="opacity-40" />
                                                )}
                                                {line.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-xs text-white/20">No voice lines available for {currentChar.name}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}