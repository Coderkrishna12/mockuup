"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { prefersReducedMotion, isMobileViewport, isWebGLSupported } from "./utils";

/** Hook to detect if WebGL is supported */
export function useWebGLSupport(): boolean {
    const [supported, setSupported] = useState(true);
    useEffect(() => {
        setSupported(isWebGLSupported());
    }, []);
    return supported;
}

/** Hook for responsive mobile detection */
export function useIsMobile(): boolean {
    const [mobile, setMobile] = useState(false);
    useEffect(() => {
        const check = () => setMobile(isMobileViewport());
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return mobile;
}

/** Hook for reduced motion preference */
export function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        setReduced(prefersReducedMotion());
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
    return reduced;
}

/** Hook that returns appropriate particle count based on device */
export function useParticleCount(desktopCount: number, mobileCount?: number): number {
    const mobile = useIsMobile();
    return mobile ? (mobileCount ?? Math.floor(desktopCount * 0.3)) : desktopCount;
}

/** Hook for intersection observer (lazy-load heavy components) */
export function useInView(
    threshold: number = 0.1
): [React.RefObject<HTMLDivElement | null>, boolean] {
    const ref = useRef<HTMLDivElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(el);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView];
}

/** Hook for smooth scroll with Lenis-friendly RAF loop */
export function useAnimationFrame(callback: (delta: number) => void, active: boolean = true): void {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        if (!active) return;

        let lastTime = performance.now();
        let frameId: number;

        const loop = (time: number) => {
            const delta = (time - lastTime) / 1000;
            lastTime = time;
            callbackRef.current(delta);
            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [active]);
}

/** Hook to track scroll progress (0 to 1) */
export function useScrollProgress(): number {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return progress;
}
