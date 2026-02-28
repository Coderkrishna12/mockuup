import React, { useEffect, useRef } from 'react';

interface SmoothScrollProps {
    children: React.ReactNode;
}

/**
 * Lenis-style smooth scroll wrapper.
 * Uses requestAnimationFrame to interpolate scroll position,
 * giving all scroll interactions a buttery, cinematic feel.
 */
const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const currentScroll = useRef(0);
    const targetScroll = useRef(0);
    const ease = 0.08; // Lower = smoother/slower

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        // Set body to fixed, let our container handle scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';

        const updateHeight = () => {
            document.body.style.height = container.scrollHeight + 'px';
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            targetScroll.current += e.deltaY;
            targetScroll.current = Math.max(0, Math.min(targetScroll.current, container.scrollHeight - window.innerHeight));
        };

        // Touch support
        let touchStart = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStart = e.touches[0].clientY;
        };
        const handleTouchMove = (e: TouchEvent) => {
            const delta = touchStart - e.touches[0].clientY;
            touchStart = e.touches[0].clientY;
            targetScroll.current += delta;
            targetScroll.current = Math.max(0, Math.min(targetScroll.current, container.scrollHeight - window.innerHeight));
        };

        // Handle keyboard scroll
        const handleKeyDown = (e: KeyboardEvent) => {
            const scrollAmount = 100;
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                targetScroll.current += scrollAmount;
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                targetScroll.current -= scrollAmount;
            } else if (e.key === 'Home') {
                targetScroll.current = 0;
            } else if (e.key === 'End') {
                targetScroll.current = container.scrollHeight - window.innerHeight;
            }
            targetScroll.current = Math.max(0, Math.min(targetScroll.current, container.scrollHeight - window.innerHeight));
        };

        // Handle anchor link clicks
        const handleHashClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
            if (anchor) {
                e.preventDefault();
                const id = anchor.getAttribute('href')?.slice(1);
                if (id) {
                    const el = document.getElementById(id);
                    if (el) {
                        targetScroll.current = el.offsetTop;
                    }
                }
            }
        };

        // The smooth interpolation loop
        let rafId: number;
        const smoothLoop = () => {
            currentScroll.current += (targetScroll.current - currentScroll.current) * ease;

            // Apply the smooth scroll position
            container.style.transform = `translateY(${-currentScroll.current}px)`;

            // Update window.scrollY equivalent for IntersectionObservers
            // (they need the actual scroll position to work)

            rafId = requestAnimationFrame(smoothLoop);
        };

        updateHeight();
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleHashClick);
        window.addEventListener('resize', updateHeight);

        rafId = requestAnimationFrame(smoothLoop);

        return () => {
            document.body.style.overflow = '';
            document.body.style.height = '';
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleHashClick);
            window.removeEventListener('resize', updateHeight);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div ref={scrollRef} className="smooth-scroll-container" style={{ willChange: 'transform' }}>
            {children}
        </div>
    );
};

export default SmoothScroll;
