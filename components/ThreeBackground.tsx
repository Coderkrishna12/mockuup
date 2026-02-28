"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useParticleCount, useReducedMotion } from "@/lib/hooks";

function Particles({ count }: { count: number }) {
    const meshRef = useRef<THREE.Points>(null);
    const reducedMotion = useReducedMotion();

    const [positions, colors, sizes] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const siz = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Spread particles in a spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 3 + Math.random() * 12;

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            // Color: mix of red, gold, blue, white
            const colorChoice = Math.random();
            if (colorChoice < 0.3) {
                // Marvel red
                col[i * 3] = 0.93;
                col[i * 3 + 1] = 0.11;
                col[i * 3 + 2] = 0.14;
            } else if (colorChoice < 0.5) {
                // Gold
                col[i * 3] = 1;
                col[i * 3 + 1] = 0.84;
                col[i * 3 + 2] = 0;
            } else if (colorChoice < 0.65) {
                // Electric blue
                col[i * 3] = 0.12;
                col[i * 3 + 1] = 0.56;
                col[i * 3 + 2] = 1;
            } else {
                // White/silver
                col[i * 3] = 0.8 + Math.random() * 0.2;
                col[i * 3 + 1] = 0.8 + Math.random() * 0.2;
                col[i * 3 + 2] = 0.85 + Math.random() * 0.15;
            }

            siz[i] = 0.02 + Math.random() * 0.06;
        }

        return [pos, col, siz];
    }, [count]);

    useFrame((state) => {
        if (!meshRef.current || reducedMotion) return;
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.y = time * 0.02;
        meshRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function ThreeBackground() {
    const particleCount = useParticleCount(8000, 2000);

    return (
        <div className="absolute inset-0 z-0" aria-hidden="true">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 75 }}
                gl={{
                    antialias: false,
                    powerPreference: "high-performance",
                    alpha: true,
                }}
                dpr={[1, 1.5]}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.1} />
                <Particles count={particleCount} />
            </Canvas>
        </div>
    );
}
