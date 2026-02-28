"use client";

import { useRef, useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize, Minimize, RotateCcw, Hand, Loader2, AlertTriangle } from "lucide-react";

/* ═══════════ Power type → visual theme ═══════════ */
const powerThemes: Record<string, { color: string; emissive: string; particleColor: string; envPreset: string }> = {
    Technology: { color: "#3B82F6", emissive: "#1D4ED8", particleColor: "#60A5FA", envPreset: "city" },
    Strength: { color: "#EF4444", emissive: "#B91C1C", particleColor: "#F87171", envPreset: "sunset" },
    Magic: { color: "#A855F7", emissive: "#7E22CE", particleColor: "#C084FC", envPreset: "night" },
    Cosmic: { color: "#FFD700", emissive: "#B8860B", particleColor: "#FDE68A", envPreset: "dawn" },
    Speed: { color: "#06B6D4", emissive: "#0E7490", particleColor: "#67E8F9", envPreset: "warehouse" },
    "Martial Arts": { color: "#F97316", emissive: "#C2410C", particleColor: "#FB923C", envPreset: "forest" },
};

/* ═══════════ Procedural character form ═══════════ */
function CharacterForm({
    color,
    emissive,
    stats,
}: {
    color: string;
    emissive: string;
    stats: Record<string, number>;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const bodyRef = useRef<THREE.Mesh>(null);
    const headRef = useRef<THREE.Mesh>(null);

    const avgPower = useMemo(() => {
        const vals = Object.values(stats);
        return vals.reduce((a, b) => a + b, 0) / vals.length / 100;
    }, [stats]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Breathing / idle animation
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t * 0.8) * 0.05;
            groupRef.current.rotation.y += 0.002;
        }

        // Core pulse
        if (coreRef.current) {
            const scale = 1 + Math.sin(t * 2) * 0.08;
            coreRef.current.scale.set(scale, scale, scale);
            (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
                0.5 + Math.sin(t * 3) * 0.3;
        }

        // Body gentle sway
        if (bodyRef.current) {
            bodyRef.current.rotation.z = Math.sin(t * 0.5) * 0.02;
        }

        // Head bob
        if (headRef.current) {
            headRef.current.rotation.x = Math.sin(t * 0.7) * 0.03;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Torso — main body form */}
            <mesh ref={bodyRef} position={[0, 0.3, 0]}>
                <capsuleGeometry args={[0.35, 0.7, 16, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={0.15}
                    roughness={0.2}
                    metalness={0.8}
                    transparent
                    opacity={0.85}
                />
            </mesh>

            {/* Head */}
            <mesh ref={headRef} position={[0, 1.0, 0]}>
                <sphereGeometry args={[0.22, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={0.2}
                    roughness={0.15}
                    metalness={0.85}
                />
            </mesh>

            {/* Visor / eye glow */}
            <mesh position={[0, 1.02, 0.18]}>
                <boxGeometry args={[0.22, 0.04, 0.05]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={3}
                    toneMapped={false}
                />
            </mesh>

            {/* Power core in chest */}
            <mesh ref={coreRef} position={[0, 0.5, 0.25]}>
                <dodecahedronGeometry args={[0.1, 0]} />
                <meshStandardMaterial
                    color="white"
                    emissive={color}
                    emissiveIntensity={1}
                    transparent
                    opacity={0.9}
                    toneMapped={false}
                />
            </mesh>

            {/* Shoulders */}
            <mesh position={[-0.45, 0.65, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[0.45, 0.65, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Arms */}
            <mesh position={[-0.5, 0.25, 0]} rotation={[0, 0, 0.15]}>
                <capsuleGeometry args={[0.07, 0.5, 8, 16]} />
                <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.05} roughness={0.25} metalness={0.75} />
            </mesh>
            <mesh position={[0.5, 0.25, 0]} rotation={[0, 0, -0.15]}>
                <capsuleGeometry args={[0.07, 0.5, 8, 16]} />
                <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.05} roughness={0.25} metalness={0.75} />
            </mesh>

            {/* Legs */}
            <mesh position={[-0.15, -0.5, 0]}>
                <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[0.15, -0.5, 0]}>
                <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Base glow ring */}
            <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.6, 0.8, 64]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Energy orbit rings — per stat */}
            {Object.entries(stats).map(([key, value], i) => {
                const statColors = ["#EF4444", "#3B82F6", "#A855F7", "#FFD700", "#F97316", "#22C55E"];
                return (
                    <EnergyRing
                        key={key}
                        radius={0.8 + i * 0.18}
                        value={value}
                        color={statColors[i % statColors.length]}
                        speed={0.3 + i * 0.15}
                        tilt={(20 + i * 25) * (Math.PI / 180)}
                    />
                );
            })}
        </group>
    );
}

/* ═══════════ Energy stat ring ═══════════ */
function EnergyRing({
    radius,
    value,
    color,
    speed,
    tilt,
}: {
    radius: number;
    value: number;
    color: string;
    speed: number;
    tilt: number;
}) {
    const ref = useRef<THREE.Group>(null);

    useFrame(() => {
        if (ref.current) ref.current.rotation.y += speed * 0.005;
    });

    const arc = (value / 100) * Math.PI * 2;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * arc;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const curve = new THREE.CatmullRomCurve3(pts, false);
    const geom = new THREE.TubeGeometry(curve, 64, 0.012, 6, false);

    return (
        <group ref={ref} rotation={[tilt, 0, 0]}>
            <mesh geometry={geom}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.6}
                />
            </mesh>
            <mesh position={[Math.cos(arc) * radius, 0, Math.sin(arc) * radius]}>
                <sphereGeometry args={[0.025, 12, 12]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
            </mesh>
        </group>
    );
}

/* ═══════════ Ambient particles ═══════════ */
function AmbientParticles({ color, count = 100 }: { color: string; count?: number }) {
    const ref = useRef<THREE.Points>(null);
    const positions = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 1.5 + Math.random() * 2.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            p[i * 3 + 2] = r * Math.cos(phi);
        }
        return p;
    }, [count]);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.0008;
            ref.current.rotation.x += 0.0003;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial color={color} size={0.025} transparent opacity={0.5} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
}

/* ═══════════ Loading indicator inside canvas ═══════════ */
function LoadingIndicator() {
    const { progress } = useProgress();
    return null; // progress handled in HTML overlay
}

/* ═══════════ Scene with camera reset ═══════════ */
function SceneWithControls({
    stats,
    primaryPowerType,
    resetTrigger,
}: {
    stats: Record<string, number>;
    primaryPowerType: string;
    resetTrigger: number;
}) {
    const theme = powerThemes[primaryPowerType] || powerThemes.Technology;
    const controlsRef = useRef<any>(null);
    const { camera } = useThree();

    useEffect(() => {
        if (controlsRef.current) {
            camera.position.set(0, 0.5, 3);
            controlsRef.current.target.set(0, 0.3, 0);
            controlsRef.current.update();
        }
    }, [resetTrigger, camera]);

    return (
        <>
            {/* Cinematic lighting */}
            <ambientLight intensity={0.15} />
            <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" castShadow />
            <pointLight position={[-3, 2, -2]} intensity={0.4} color={theme.color} />
            {/* Rim light */}
            <pointLight position={[0, 1, -3]} intensity={0.6} color={theme.color} />
            <spotLight
                position={[0, 5, 0]}
                angle={0.5}
                penumbra={0.8}
                intensity={0.5}
                color={theme.color}
                castShadow
            />

            {/* HDR Environment */}
            <Environment preset={theme.envPreset as any} background={false} />

            <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
                <CharacterForm color={theme.color} emissive={theme.emissive} stats={stats} />
            </Float>

            <AmbientParticles color={theme.particleColor} />

            {/* Ground shadow */}
            <ContactShadows
                position={[0, -0.85, 0]}
                opacity={0.4}
                scale={4}
                blur={2}
                far={4}
                color={theme.emissive}
            />

            <OrbitControls
                ref={controlsRef}
                enableDamping
                dampingFactor={0.05}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.8}
                minDistance={1.8}
                maxDistance={5}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={(5 * Math.PI) / 6}
                target={[0, 0.3, 0]}
            />
        </>
    );
}

/* ═══════════ Exported Component ═══════════ */
export default function CharacterModelViewer({
    name,
    alias,
    stats,
    primaryPowerType,
    posterUrl,
}: {
    name: string;
    alias: string;
    stats: Record<string, number>;
    primaryPowerType: string;
    posterUrl: string;
}) {
    const theme = powerThemes[primaryPowerType] || powerThemes.Technology;
    const [webglSupported, setWebglSupported] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const [resetTrigger, setResetTrigger] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const avgPower = Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / Object.values(stats).length);

    // Check WebGL support
    useEffect(() => {
        try {
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
            if (!gl) setWebglSupported(false);
        } catch {
            setWebglSupported(false);
        }
    }, []);

    // Auto-hide hint after 4 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowHint(false), 4000);
        return () => clearTimeout(timer);
    }, []);

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

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    // WebGL fallback → static poster
    if (!webglSupported) {
        return (
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-black/40">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-8">
                    <AlertTriangle size={32} className="text-yellow-400" />
                    <p className="text-sm text-white/60">WebGL is not supported on this device.</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={posterUrl} alt={name} className="max-h-64 rounded-lg object-cover mt-4 opacity-80" />
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full rounded-xl overflow-hidden border border-white/5 bg-black/40 ${isFullscreen ? "fixed inset-0 z-[100] rounded-none border-0" : "aspect-square md:aspect-[4/3]"
                }`}
        >
            {/* Scanner line overlay */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.01) 3px, rgba(255,255,255,0.01) 4px)`,
                }}
            />

            {/* Corner brackets */}
            {[
                "top-3 left-3 border-l-2 border-t-2",
                "top-3 right-3 border-r-2 border-t-2",
                "bottom-3 left-3 border-l-2 border-b-2",
                "bottom-3 right-3 border-r-2 border-b-2",
            ].map((cls) => (
                <div key={cls} className={`absolute w-6 h-6 z-10 pointer-events-none ${cls}`} style={{ borderColor: `${theme.color}50` }} />
            ))}

            {/* Loading overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80"
                    >
                        <Loader2 size={32} className="animate-spin mb-3" style={{ color: theme.color }} />
                        <p className="text-xs text-white/40 uppercase tracking-widest">Loading 3D Model</p>
                        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden mt-3">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: theme.color }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rotate hint */}
            <AnimatePresence>
                {showHint && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            animate={{ x: [-20, 20, -20] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm"
                        >
                            <Hand size={16} className="text-white/60" />
                            <span className="text-xs text-white/60">Drag to rotate • Scroll to zoom</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [0, 0.5, 3], fov: 45 }}
                gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
                dpr={[1, 1.5]}
                shadows
                style={{ background: "transparent" }}
                onCreated={() => setTimeout(() => setLoading(false), 1500)}
            >
                <Suspense fallback={<LoadingIndicator />}>
                    <SceneWithControls
                        stats={stats}
                        primaryPowerType={primaryPowerType}
                        resetTrigger={resetTrigger}
                    />
                </Suspense>
            </Canvas>

            {/* HUD bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-heading text-sm tracking-wider text-white">{name}</p>
                        <p className="text-[10px] text-white/40">{alias} • 3D Model Viewer</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{ width: `${avgPower}%`, backgroundColor: theme.color }}
                            />
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: theme.color }}>{avgPower}</span>
                    </div>
                </div>
            </div>

            {/* Control buttons */}
            <div className="absolute top-3 right-10 z-20 flex items-center gap-2">
                <button
                    onClick={() => setResetTrigger((n) => n + 1)}
                    className="p-1.5 rounded-md bg-black/40 backdrop-blur-sm text-white/50 hover:text-white transition-all border border-white/5 hover:border-white/20"
                    title="Reset camera"
                >
                    <RotateCcw size={14} />
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-md bg-black/40 backdrop-blur-sm text-white/50 hover:text-white transition-all border border-white/5 hover:border-white/20"
                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                    {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                </button>
            </div>

            {/* Top-left label */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span
                    className="text-[10px] uppercase tracking-widest px-2 py-1 rounded text-white/30 bg-white/5 border border-white/5"
                >
                    3D Character Model
                </span>
            </div>
        </div>
    );
}
