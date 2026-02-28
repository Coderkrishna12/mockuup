import { useEffect, useRef } from 'react';

interface ScrollRevealOptions {
    threshold?: number;
    rootMargin?: string;
}

/**
 * Hook that adds IntersectionObserver to auto-reveal `.scroll-reveal` children.
 * Call once in a page component to animate all elements with `.scroll-reveal` class.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: options.threshold ?? 0.12,
                rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
            }
        );

        // Observe all .scroll-reveal elements
        const elements = container.querySelectorAll('.scroll-reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [options.threshold, options.rootMargin]);

    return containerRef;
}
