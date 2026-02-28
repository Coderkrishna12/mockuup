"use client";

import { useRef, useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, ExternalLink, AlertTriangle, CheckCircle, HelpCircle, XCircle } from "lucide-react";

import { multiverseUniverses, type MultiverseUniverse } from "@/data/timeline";
import { characters, type Character } from "@/data/characters";
import { useParticleCount, useReducedMotion } from "@/lib/hooks";
import { audioManager } from "@/lib/audio";
import CharacterInteractionPanel from "@/components/CharacterInteractionPanel";
import dynamic from "next/dynamic";

const ARMaskModal = dynamic(() => import("@/components/ARMaskModal"), { ssr: false }) as React.ComponentType<{ initialCharacterId: string; onClose: () => void }>;

/* ═══════════════ Portal transition keyframes ═══════════════ */
const portalCSS = `
@keyframes portalSpin {
  0%   { transform: scale(0) rotate(0deg);   opacity:0; }
  40%  { transform: scale(1.2) rotate(360deg); opacity:1; }
  100% { transform: scale(30) rotate(720deg);  opacity:0; }
}
@keyframes portalPulse {
  0%, 100% { box-shadow: 0 0 30px var(--portal-color), inset 0 0 30px var(--portal-color); }
  50%      { box-shadow: 0 0 60px var(--portal-color), inset 0 0 60px var(--portal-color); }
}
.portal-ring {
  animation: portalSpin 1.2s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
}
.portal-pulse {
  animation: portalPulse 0.6s ease-in-out infinite;
}
@keyframes characterFloat {
  0%, 100% { transform: translate3d(var(--drift-x, 0px), 0px, 0) rotate(var(--rot-start, 0deg)); }
  50% { transform: translate3d(calc(var(--drift-x, 0px) * -1), var(--float-y, -20px), 0) rotate(var(--rot-end, 0deg)); }
}
@keyframes fogDrift {
  0%   { transform: translateX(-30%) translateY(10%); opacity: 0.03; }
  50%  { transform: translateX(30%) translateY(-10%); opacity: 0.06; }
  100% { transform: translateX(-30%) translateY(10%); opacity: 0.03; }
}
@keyframes ambientOrb {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
  33% { transform: translate(30px, -50px) scale(1.2); opacity: 0.25; }
  66% { transform: translate(-20px, 30px) scale(0.8); opacity: 0.1; }
}
`;

/* ═══════════════════ THREE.JS COMPONENTS ═══════════════════ */

function UniverseBubble({
    universe,
    position,
    onClick,
    isSelected,
}: {
    universe: MultiverseUniverse;
    position: [number, number, number];
    onClick: () => void;
    isSelected: boolean;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const color = new THREE.Color(universe.color);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.15;
        const scale = hovered || isSelected ? 1.2 : 1;
        meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        if (glowRef.current) {
            const glowScale = (hovered || isSelected ? 1.8 : 1.4) + Math.sin(time * 2) * 0.05;
            glowRef.current.scale.set(glowScale, glowScale, glowScale);
        }
    });

    return (
        <group position={position}>
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={hovered || isSelected ? 0.15 : 0.05} side={THREE.BackSide} />
            </mesh>
            <mesh
                ref={meshRef}
                onClick={(e) => { e.stopPropagation(); onClick(); audioManager.playGlitch(); }}
                onPointerEnter={() => { setHovered(true); audioManager.playHover(); document.body.style.cursor = "pointer"; }}
                onPointerLeave={() => { setHovered(false); document.body.style.cursor = "default"; }}
            >
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial
                    color={color} emissive={color} emissiveIntensity={hovered || isSelected ? 0.5 : 0.2}
                    transparent opacity={0.8} roughness={0.3} metalness={0.7}
                />
            </mesh>
            <Text position={[0, -0.7, 0]} fontSize={0.12} color="white" anchorX="center" anchorY="middle" font="/fonts/inter.woff" fillOpacity={hovered || isSelected ? 1 : 0.5}>
                {universe.designation}
            </Text>
        </group>
    );
}

function CosmicParticles({ count }: { count: number }) {
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 30;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        return pos;
    }, [count]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.3} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
}

function MultiverseScene({
    onSelectUniverse,
    selectedId,
}: {
    onSelectUniverse: (u: MultiverseUniverse) => void;
    selectedId: string | null;
}) {
    const particleCount = useParticleCount(3000, 1000);
    const positions: [number, number, number][] = useMemo(() => {
        const count = multiverseUniverses.length;
        return multiverseUniverses.map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const radius = 2.5 + Math.sin(i * 1.5) * 0.5;
            return [Math.cos(angle) * radius, (Math.random() - 0.5) * 1.5, Math.sin(angle) * radius] as [number, number, number];
        });
    }, []);

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} intensity={0.5} color="#FFD700" />
            <pointLight position={[-5, -5, -5]} intensity={0.3} color="#ED1D24" />
            <CosmicParticles count={particleCount} />
            {multiverseUniverses.map((universe, i) => (
                <Float key={universe.id} speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
                    <UniverseBubble universe={universe} position={positions[i]} onClick={() => onSelectUniverse(universe)} isSelected={selectedId === universe.id} />
                </Float>
            ))}
            <OrbitControls enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.5} minDistance={3} maxDistance={12} enablePan={false} />
        </>
    );
}

/* ═══════════════════ FLOATING CHARACTER ═══════════════════ */

interface FloatingCharacterProps {
    character: Character;
    index: number;
    total: number;
    universeColor: string;
    mousePos: { x: number; y: number };
    onClick: () => void;
}

function FloatingCharacter({ character, index, total, universeColor, mousePos, onClick }: FloatingCharacterProps) {
    const [hovered, setHovered] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Depth layering: alternate between foreground and background
    const depth = index % 3 === 0 ? 1.1 : index % 3 === 1 ? 0.85 : 1;
    const zIndex = depth > 1 ? 20 : depth < 1 ? 5 : 10;

    // Position spread across center area
    const spreadX = total > 1 ? ((index / (total - 1)) * 70 + 15) : 50;
    const spreadY = 35 + Math.sin(index * 2.1) * 15;

    // Floating animation parameters (randomized per character)
    const floatY = -(15 + (index * 7) % 12); // -15px to -27px
    const duration = 4 + (index * 1.3) % 3;   // 4s to 7s
    const delay = index * 0.6;
    const driftX = 4 + (index * 3) % 6;       // 4px to 10px drift

    // Parallax offset from mouse
    const parallaxFactor = depth > 1 ? 15 : depth < 1 ? 5 : 10;
    const parallaxX = (mousePos.x - 0.5) * parallaxFactor * -1;
    const parallaxY = (mousePos.y - 0.5) * parallaxFactor * -1;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 40 }}
            animate={{ opacity: loaded ? 1 : 0, scale: depth, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, y: 30 }}
            transition={{ delay: delay * 0.15, duration: 0.8, type: "spring", damping: 20 }}
            className="absolute cursor-pointer group"
            style={{
                left: `${spreadX}%`,
                top: `${spreadY}%`,
                transform: `translate(-50%, -50%) translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
                zIndex,
                willChange: "transform, opacity",
            }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Soft glow behind character */}
            <div
                className="absolute inset-0 rounded-full blur-3xl transition-all duration-500 -z-10"
                style={{
                    background: `radial-gradient(circle, ${universeColor}${hovered ? "40" : "15"} 0%, transparent 70%)`,
                    transform: `scale(${hovered ? 2.5 : 1.8})`,
                }}
            />

            {/* Character PNG with floating animation */}
            <div
                style={{
                    animation: `characterFloat ${duration}s ease-in-out ${delay}s infinite`,
                    ["--float-y" as string]: `${floatY}px`,
                    ["--drift-x" as string]: `${driftX}px`,
                    ["--rot-start" as string]: `${-1 + index * 0.3}deg`,
                    ["--rot-end" as string]: `${1 - index * 0.3}deg`,
                } as React.CSSProperties}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`/characters/poses/${character.id}.png`}
                    alt={character.name}
                    className="transition-all duration-500 drop-shadow-2xl select-none pointer-events-none"
                    style={{
                        height: `${280 + depth * 70}px`,
                        maxWidth: `${220 + depth * 60}px`,
                        objectFit: "contain",
                        filter: `drop-shadow(0 0 ${hovered ? 30 : 15}px ${universeColor}60) ${hovered ? `drop-shadow(0 0 50px ${universeColor}30)` : ""}`,
                        transform: `scale(${hovered ? 1.12 : 1})`,
                    }}
                    onLoad={() => setLoaded(true)}
                    onError={(e) => {
                        e.currentTarget.src = character.imageUrl;
                        e.currentTarget.style.borderRadius = "12px";
                        e.currentTarget.style.height = "160px";
                        e.currentTarget.style.width = "110px";
                        e.currentTarget.style.objectFit = "cover";
                        setLoaded(true);
                    }}
                />
            </div>

            {/* Glowing base ellipse */}
            <div
                className="mx-auto mt-1 rounded-full transition-all duration-500"
                style={{
                    width: `${60 + depth * 25}px`,
                    height: "6px",
                    background: `radial-gradient(ellipse, ${universeColor}${hovered ? "70" : "40"} 0%, transparent 70%)`,
                }}
            />

            {/* Name tooltip on hover */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap z-30"
                    >
                        <span
                            className="text-[10px] px-3 py-1 rounded-full font-heading tracking-widest border"
                            style={{
                                backgroundColor: `${universeColor}15`,
                                borderColor: `${universeColor}40`,
                                color: universeColor,
                            }}
                        >
                            {character.name}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ═══════════════════ STATUS ICONS ═══════════════════ */
import type { LucideIcon } from "lucide-react";

const statusConfig: Record<string, { icon: LucideIcon; label: string; className: string }> = {
    stable: { icon: CheckCircle, label: "Stable", className: "text-green-400" },
    unstable: { icon: AlertTriangle, label: "Unstable", className: "text-yellow-400" },
    destroyed: { icon: XCircle, label: "Destroyed", className: "text-red-400" },
    unknown: { icon: HelpCircle, label: "Unknown", className: "text-white/40" },
};

/* ═══════════════════ MAIN PAGE ═══════════════════ */
export default function MultiversePage() {
    const [selectedUniverse, setSelectedUniverse] = useState<MultiverseUniverse | null>(null);
    const [compareUniverse, setCompareUniverse] = useState<MultiverseUniverse | null>(null);
    const [portalActive, setPortalActive] = useState(false);
    const [portalColor, setPortalColor] = useState("#ED1D24");
    const [compareMode, setCompareMode] = useState(false);
    const [interactingCharacter, setInteractingCharacter] = useState<Character | null>(null);
    const [arCharacterId, setArCharacterId] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const centerRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    /* Inject CSS once */
    useEffect(() => {
        if (typeof document === "undefined") return;
        if (document.getElementById("portal-css")) return;
        const style = document.createElement("style");
        style.id = "portal-css";
        style.textContent = portalCSS;
        document.head.appendChild(style);
    }, []);

    /* Mouse tracking for parallax */
    useEffect(() => {
        if (reducedMotion) return;
        const handleMouseMove = (e: MouseEvent) => {
            if (!centerRef.current) return;
            const rect = centerRef.current.getBoundingClientRect();
            setMousePos({
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height,
            });
        };
        const el = centerRef.current;
        el?.addEventListener("mousemove", handleMouseMove);
        return () => el?.removeEventListener("mousemove", handleMouseMove);
    }, [reducedMotion]);

    const handleSelectUniverse = useCallback((u: MultiverseUniverse) => {
        if (compareMode && selectedUniverse) {
            setCompareUniverse(u);
            audioManager.playGlitch();
            return;
        }
        setInteractingCharacter(null);
        setPortalColor(u.color);
        setPortalActive(true);
        audioManager.playGlitch();
        setTimeout(() => {
            setSelectedUniverse(u);
            setPortalActive(false);
        }, 800);
    }, [compareMode, selectedUniverse]);

    const selectedCharacters = useMemo(() => {
        if (!selectedUniverse) return [];
        return selectedUniverse.keyCharacters
            .map((id) => characters.find((c) => c.id === id))
            .filter((c): c is Character => c !== undefined);
    }, [selectedUniverse]);

    const compareCharacters = useMemo(() => {
        if (!compareUniverse) return [];
        return compareUniverse.keyCharacters
            .map((id) => characters.find((c) => c.id === id))
            .filter((c): c is Character => c !== undefined);
    }, [compareUniverse]);

    return (
        <div className="min-h-screen pt-20 md:pt-24 relative overflow-hidden">
            {/* ═══ Cinematic fog / light rays ═══ */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
                    style={{ animation: "fogDrift 20s ease-in-out infinite", background: `radial-gradient(ellipse at 30% 50%, ${selectedUniverse?.color || "#ED1D24"}10 0%, transparent 60%)` }}
                />
                <div
                    className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
                    style={{ animation: "fogDrift 25s ease-in-out 5s infinite reverse", background: `radial-gradient(ellipse at 70% 40%, #FFD70008 0%, transparent 50%)` }}
                />
                {/* Ambient glow orbs */}
                {selectedUniverse && [0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="absolute rounded-full blur-3xl"
                        style={{
                            width: `${80 + i * 40}px`,
                            height: `${80 + i * 40}px`,
                            left: `${20 + i * 30}%`,
                            top: `${30 + i * 15}%`,
                            background: `${selectedUniverse.color}${12 + i * 5}`,
                            animation: `ambientOrb ${8 + i * 3}s ease-in-out ${i * 2}s infinite`,
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 mb-0">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h1 className="font-heading text-5xl md:text-7xl text-white tracking-wider mb-2">
                        MULTIVERSE <span className="text-marvel-purple">EXPLORER</span>
                    </h1>
                    <p className="text-white/40 max-w-lg">
                        Navigate the multiverse. Click a reality bubble to explore its universe and characters.
                    </p>
                </motion.div>
            </div>

            {/* 3D Canvas + Floating Characters Overlay */}
            <div className="relative z-10 h-[70vh] w-full" ref={centerRef}>
                {/* 3D scene */}
                <Canvas
                    camera={{ position: [0, 2, 7], fov: 60 }}
                    gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
                    dpr={[1, 1.5]}
                    style={{ background: "transparent" }}
                >
                    <Suspense fallback={null}>
                        <MultiverseScene onSelectUniverse={handleSelectUniverse} selectedId={selectedUniverse?.id || null} />
                    </Suspense>
                </Canvas>

                {/* ═══ FLOATING CHARACTERS CENTER STAGE ═══ */}
                <div className="absolute inset-0 pointer-events-none z-20">
                    <AnimatePresence mode="popLayout">
                        {selectedUniverse && selectedCharacters.map((char, i) => (
                            <div key={`${selectedUniverse.id}-${char.id}`} className="pointer-events-auto">
                                <FloatingCharacter
                                    character={char}
                                    index={i}
                                    total={selectedCharacters.length}
                                    universeColor={selectedUniverse.color}
                                    mousePos={mousePos}
                                    onClick={() => setInteractingCharacter(char)}
                                />
                            </div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Universe label overlay when selected */}
                <AnimatePresence>
                    {selectedUniverse && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-6 left-6 z-20"
                        >
                            <p className="font-heading text-lg tracking-widest" style={{ color: selectedUniverse.color }}>
                                {selectedUniverse.designation}
                            </p>
                            <p className="text-[10px] text-white/30 mt-0.5">Click a character to interact</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Universe Selector */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {multiverseUniverses.map((u) => (
                        <button
                            key={u.id}
                            onClick={() => handleSelectUniverse(u)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full border text-xs font-medium transition-all ${selectedUniverse?.id === u.id ? "text-white" : "border-white/10 text-white/40 hover:border-white/30"}`}
                            style={selectedUniverse?.id === u.id ? { borderColor: u.color, backgroundColor: `${u.color}20`, color: u.color } : {}}
                        >
                            {u.designation}
                        </button>
                    ))}
                </div>
            </div>

            {/* Comparison toggle */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 pb-4 flex items-center gap-3">
                <button
                    onClick={() => { setCompareMode(!compareMode); setCompareUniverse(null); }}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all border ${compareMode ? "border-marvel-purple bg-marvel-purple/20 text-marvel-purple" : "border-white/10 text-white/40 hover:border-white/30"}`}
                >
                    {compareMode ? "✦ Comparison Mode Active" : "Compare Universes"}
                </button>
                {compareMode && (
                    <p className="text-xs text-white/30">
                        {selectedUniverse ? `Selected: ${selectedUniverse.designation} — now pick a second` : "Select two universes to compare"}
                    </p>
                )}
            </div>

            {/* Portal Transition Overlay */}
            <AnimatePresence>
                {portalActive && (
                    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 pointer-events-none">
                        <div className="portal-ring w-20 h-20 rounded-full border-4 portal-pulse" style={{ borderColor: portalColor, ["--portal-color" as string]: portalColor }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comparison Panel */}
            <AnimatePresence>
                {compareMode && compareUniverse && selectedUniverse && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                        className="fixed inset-x-0 bottom-0 top-20 z-50 bg-black/95 backdrop-blur-xl overflow-y-auto"
                    >
                        <div className="max-w-6xl mx-auto px-6 py-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="font-heading text-3xl text-white tracking-wider">
                                    UNIVERSE <span className="text-marvel-purple">COMPARISON</span>
                                </h2>
                                <button onClick={() => { setCompareUniverse(null); setCompareMode(false); }} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/5">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                {[selectedUniverse, compareUniverse].map((u, idx) => {
                                    const chars = idx === 0 ? selectedCharacters : compareCharacters;
                                    const StatusIcon = statusConfig[u.status].icon;
                                    return (
                                        <div key={u.id} className="glass rounded-xl p-6 border border-white/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: u.color, boxShadow: `0 0 20px ${u.color}40` }} />
                                                <div>
                                                    <h3 className="font-heading text-xl text-white tracking-wider">{u.name}</h3>
                                                    <p className="text-xs" style={{ color: u.color }}>{u.designation}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <StatusIcon size={14} className={statusConfig[u.status].className} />
                                                <span className={`text-xs ${statusConfig[u.status].className}`}>{statusConfig[u.status].label}</span>
                                            </div>
                                            <p className="text-xs text-white/50 leading-relaxed mb-4">{u.description}</p>
                                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Characters</p>
                                            <div className="flex flex-wrap gap-2">
                                                {chars.map(c => <span key={c.id} className="text-xs px-2 py-1 rounded bg-white/5 text-white/60">{c.name}</span>)}
                                            </div>
                                            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-4 mb-2">Events ({u.events.length})</p>
                                            <div className="flex flex-wrap gap-1">
                                                {u.events.map(e => (
                                                    <span key={e} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40">
                                                        {e.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detail Panel (right side) */}
            <AnimatePresence>
                {selectedUniverse && !interactingCharacter && (
                    <motion.div
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-20 right-0 bottom-0 w-full max-w-sm z-40 glass-strong border-l border-white/10 overflow-y-auto"
                    >
                        <div className="p-6">
                            <button onClick={() => setSelectedUniverse(null)} className="absolute top-4 right-4 text-white/40 hover:text-white" aria-label="Close panel">
                                <X size={20} />
                            </button>
                            <div className="w-12 h-12 rounded-full mb-4" style={{ backgroundColor: selectedUniverse.color, boxShadow: `0 0 30px ${selectedUniverse.color}40` }} />
                            <h2 className="font-heading text-3xl text-white tracking-wider mb-1">{selectedUniverse.name}</h2>
                            <p className="text-sm mb-4" style={{ color: selectedUniverse.color }}>{selectedUniverse.designation}</p>
                            <div className="flex items-center gap-2 mb-6">
                                {(() => {
                                    const config = statusConfig[selectedUniverse.status];
                                    const Icon = config.icon;
                                    return <span className={`flex items-center gap-1 text-xs ${config.className}`}><Icon size={14} /> {config.label}</span>;
                                })()}
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed mb-8">{selectedUniverse.description}</p>

                            {/* Character List */}
                            {selectedCharacters.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-heading text-lg text-white tracking-wider mb-3">KEY CHARACTERS</h3>
                                    <div className="space-y-2">
                                        {selectedCharacters.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => setInteractingCharacter(c)}
                                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group text-left"
                                            >
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                                    <Image src={c.portraitUrl} alt={c.name} fill className="object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white group-hover:text-marvel-red transition-colors">{c.name}</p>
                                                    <p className="text-[10px] text-white/30">{c.alias}</p>
                                                </div>
                                                <ExternalLink size={12} className="ml-auto text-white/20" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Events */}
                            <div>
                                <h3 className="font-heading text-lg text-white tracking-wider mb-3">KEY EVENTS</h3>
                                <div className="space-y-2">
                                    {selectedUniverse.events.map((eventId) => (
                                        <div key={eventId} className="p-3 rounded-lg bg-white/5 border border-white/5">
                                            <p className="text-xs text-white/60">{eventId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Character Interaction Panel (bottom) */}
            <AnimatePresence>
                {interactingCharacter && selectedUniverse && (
                    <CharacterInteractionPanel
                        character={interactingCharacter}
                        universeColor={selectedUniverse.color}
                        onClose={() => setInteractingCharacter(null)}
                        onOpenAR={() => { setArCharacterId(interactingCharacter.id); setInteractingCharacter(null); }}
                    />
                )}
            </AnimatePresence>

            {/* AR Mask Modal */}
            <AnimatePresence>
                {arCharacterId && (
                    <ARMaskModal
                        initialCharacterId={arCharacterId}
                        onClose={() => setArCharacterId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}