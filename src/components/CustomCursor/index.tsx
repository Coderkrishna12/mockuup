import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

const CustomCursor: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantly
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            }

            // Check for hoverable elements (magnetic pull)
            const target = e.target as HTMLElement;
            const hoverable = target.closest('a, button, [data-cursor-hover]');
            setIsHovering(!!hoverable);
        };

        // Ring follows with spring-like lag
        const animateRing = () => {
            const speed = 0.15;
            ringX += (mouseX - ringX) * speed;
            ringY += (mouseY - ringY) * speed;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
            }
            requestAnimationFrame(animateRing);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsHidden(true);
        const handleMouseEnter = () => setIsHidden(false);

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        const raf = requestAnimationFrame(animateRing);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <>
            <div
                ref={dotRef}
                className={`cursor-dot ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''} ${isHidden ? 'hidden' : ''}`}
            />
            <div
                ref={ringRef}
                className={`cursor-ring ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''} ${isHidden ? 'hidden' : ''}`}
            />
        </>
    );
};

export default CustomCursor;
