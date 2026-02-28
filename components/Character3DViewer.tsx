"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════ Power type → color + particle style ═══════════ */
const powerThemes: Record<string, { color: string; emissive: string; particleColor: string }> = {
    Technology: { color: "#3B82F6", emissive: "#1D4ED8", particleColor: "#60A5FA" },
    Strength: { color: "#EF4444", emissive: "#B91C1C", particleColor: "#F87171" },
    Magic: { color: "#A855F7", emissive: "#7E22CE", particleColor: "#C084FC" },
    Cosmic: { color: "#FFD700", emissive: "#B8860B", particleColor: "#FDE68A" },
    Speed: { color: "#06B6D4", emissive: "#0E7490", particleColor: "#67E8F9" },
    "Martial Arts": { color: "#F97316", emissive: "#C2410C", particleColor: "#FB923C" },
    Psychic: { color: "#EC4899", emissive: "#BE185D", particleColor: "#F472B6" },
    Shapeshifting: { color: "#22C55E", emissive: "#15803D", particleColor: "#4ADE80" },
};

/* ═══════════ Orbiting stat ring ═══════════ */
function StatOrbitRing({
    radius,
    value,
    color,
    rotationSpeed,
    tilt,
}: {
    radius: number;
    value: number;
    color: string;
    rotationSpeed: number;
    tilt: number;
}) {
    const ringRef = useRef<THREE.Group>(null);
    const dotRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!ringRef.current) return;
        ringRef.current.rotation.y += rotationSpeed * 0.01;
    });

    const arcLength = (value / 100) * Math.PI * 2;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * arcLength;
        points.push(
            new THREE.Vector3(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            )
        );
    }
    const curve = new THREE.CatmullRomCurve3(points, false);
    const tubeGeom = new THREE.TubeGeometry(curve, 64, 0.015, 8, false);

    return (
        <group ref={ringRef} rotation={[tilt, 0, 0]}>
            <mesh geometry={tubeGeom}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.7}
                />
            </mesh>
            {/* Dot at end of arc */}
            <mesh
                ref={dotRef}
                position={[
                    Math.cos(arcLength) * radius,
                    0,
                    Math.sin(arcLength) * radius,
                ]}
            >
                <sphereGeometry args={[0.035, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1.5}
                />
            </mesh>
        </group>
    );
}

/* ═══════════ Holographic core ═══════════ */
function HolographicCore({ color, emissive }: { color: string; emissive: string }) {
    const coreRef = useRef<THREE.Mesh>(null);
    const wireRef = useRef<THREE.Mesh>(null);
    const shieldRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (coreRef.current) {
            coreRef.current.rotation.y = t * 0.3;
            coreRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
        }
        if (wireRef.current) {
            wireRef.current.rotation.y = -t * 0.15;
            wireRef.current.rotation.z = t * 0.1;
        }
        if (shieldRef.current) {
            shieldRef.current.rotation.y = t * 0.4;
            const pulse = 1 + Math.sin(t * 2) * 0.03;
            shieldRef.current.scale.set(pulse, pulse, pulse);
        }
    });

    return (
        <group>
            {/* Inner glowing core */}
            <mesh ref={coreRef}>
                <icosahedronGeometry args={[0.45, 2]} />
                <meshStandardMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={1.2}
                    transparent
                    opacity={0.6}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>

            {/* Wireframe icosahedron */}
            <mesh ref={wireRef}>
                <icosahedronGeometry args={[0.6, 1]} />
                <meshStandardMaterial
                    color={color}
                    wireframe
                    transparent
                    opacity={0.3}
                    emissive={emissive}
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Outer shield sphere */}
            <mesh ref={shieldRef}>
                <sphereGeometry args={[0.85, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.05}
                    emissive={emissive}
                    emissiveIntensity={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}

/* ═══════════ Floating particles ═══════════ */
function PowerParticles({ color, count = 80 }: { color: string; count?: number }) {
    const particlesRef = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 1.2 + Math.random() * 1.8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (!particlesRef.current) return;
        particlesRef.current.rotation.y += 0.001;
        particlesRef.current.rotation.x += 0.0005;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color={color}
                size={0.03}
                transparent
                opacity={0.6}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

/* ═══════════ Character info HUD text ═══════════ */
function HUDOverlay({
    name,
    alias,
    powerLevel,
    color,
}: {
    name: string;
    alias: string;
    powerLevel: number;
    color: string;
}) {
    return (
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <div className="glass rounded-lg px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-heading text-lg tracking-wider text-white">{name}</p>
                        <p className="text-xs text-white/40">{alias}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{ width: `${powerLevel}%`, backgroundColor: color }}
                            />
                        </div>
                        <span className="text-xs font-bold" style={{ color }}>{powerLevel}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════ Main 3D Scene ═══════════ */
function CharacterScene({
    stats,
    primaryPowerType,
}: {
    stats: Record<string, number>;
    primaryPowerType: string;
}) {
    const theme = powerThemes[primaryPowerType] || powerThemes.Technology;
    const statEntries = Object.entries(stats);
    const statColors = ["#EF4444", "#3B82F6", "#A855F7", "#FFD700", "#F97316", "#22C55E"];

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color={theme.color} />
            <pointLight position={[-5, -3, 3]} intensity={0.3} color="#ffffff" />

            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                <HolographicCore color={theme.color} emissive={theme.emissive} />
            </Float>

            {/* Stat orbit rings */}
            {statEntries.map(([key, value], i) => (
                <StatOrbitRing
                    key={key}
                    radius={1.0 + i * 0.2}
                    value={value}
                    color={statColors[i % statColors.length]}
                    rotationSpeed={0.5 + i * 0.3}
                    tilt={((i * 30 + 20) * Math.PI) / 180}
                />
            ))}

            <PowerParticles color={theme.particleColor} />

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                minDistance={2}
                maxDistance={6}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={(3 * Math.PI) / 4}
            />
        </>
    );
}

/* ═══════════ Exported Component ═══════════ */
export default function Character3DViewer({
    name,
    alias,
    stats,
    primaryPowerType,
}: {
    name: string;
    alias: string;
    stats: Record<string, number>;
    primaryPowerType: string;
}) {
    const [loaded, setLoaded] = useState(false);
    const theme = powerThemes[primaryPowerType] || powerThemes.Technology;
    const avgPower = Math.round(
        Object.values(stats).reduce((a, b) => a + b, 0) / Object.values(stats).length
    );

    return (
        <div className="relative w-full aspect-square md:aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-black/40">
            {/* Scanner lines effect */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(${theme.color === "#3B82F6" ? "59,130,246" : theme.color === "#EF4444" ? "239,68,68" : theme.color === "#A855F7" ? "168,85,247" : "255,215,0"},0.03) 2px,
                        rgba(${theme.color === "#3B82F6" ? "59,130,246" : theme.color === "#EF4444" ? "239,68,68" : theme.color === "#A855F7" ? "168,85,247" : "255,215,0"},0.03) 4px
                    )`,
                }}
            />

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 z-10 pointer-events-none" style={{ borderColor: `${theme.color}60` }} />
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 z-10 pointer-events-none" style={{ borderColor: `${theme.color}60` }} />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 z-10 pointer-events-none" style={{ borderColor: `${theme.color}60` }} />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 z-10 pointer-events-none" style={{ borderColor: `${theme.color}60` }} />

            {/* Loading shimmer */}
            {!loaded && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${theme.color} transparent ${theme.color}40 ${theme.color}40` }} />
                        <span className="text-xs text-white/40 uppercase tracking-widest">Initializing Hologram</span>
                    </div>
                </div>
            )}

            <Canvas
                camera={{ position: [0, 0, 3.5], fov: 50 }}
                style={{ background: "transparent" }}
                onCreated={() => setLoaded(true)}
            >
                <CharacterScene stats={stats} primaryPowerType={primaryPowerType} />
            </Canvas>

            {/* HUD */}
            <HUDOverlay name={name} alias={alias} powerLevel={avgPower} color={theme.color} />

            {/* Top-right label */}
            <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded text-white/30 bg-white/5 border border-white/5">
                    Holographic Display
                </span>
            </div>
        </div>
    );
}
