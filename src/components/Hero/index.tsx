import React, { useEffect, useRef, useState } from 'react';
import './Hero.css';

// High-quality local pose render
import spiderManImg from '../../assets/images/hero-bg.png';

const Hero: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;
            const scrollY = window.scrollY;
            contentRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
            contentRef.current.style.opacity = Math.max(0, 1 - scrollY / 600).toString();
        };

        const handleMouse = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouse, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouse);
        };
    }, []);

    return (
        <section className="hero-v3" ref={containerRef}>
            {/* Animated particle-dot grid background */}
            <div className="hero-bg-grid"></div>
            {/* Radial glow */}
            <div className="hero-radial-glow"></div>



            {/* Main Content Grid: Left Text + Right Character */}
            <div className="hero-content-grid">
                {/* Left Promo */}
                <div className="hero-left" ref={contentRef}>
                    <div className="hero-badge">
                        <span className="badge-line"></span>
                        <span>PHASE 6 — NOW STREAMING</span>
                    </div>
                    <h1 className="hero-title">
                        <span className="title-line line-1">ENTER THE</span>
                        <span className="title-line line-2">MARVEL</span>
                        <span className="title-line line-3">MULTIVERSE</span>
                    </h1>
                    <p className="hero-desc">
                        Explore parallel dimensions, legendary heroes, and the infinite saga that connects them all. Your journey through Earth-616 starts now.
                    </p>
                    <div className="hero-btns">
                        <button className="btn-marvel-primary">
                            <span>EXPLORE NOW</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                        <button className="btn-marvel-ghost">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                            <span>WATCH TRAILER</span>
                        </button>
                    </div>
                    {/* Stats Row */}
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-num">34+</span>
                            <span className="stat-label">FILMS</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-num">8000+</span>
                            <span className="stat-label">CHARACTERS</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-num">∞</span>
                            <span className="stat-label">UNIVERSES</span>
                        </div>
                    </div>
                </div>

                {/* Right Character Render with Parallax */}
                <div className="hero-right">
                    <div
                        className="hero-character-wrapper"
                        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                    >
                        <img src={spiderManImg} alt="Spider-Man" className="hero-character-img" />
                        <div className="character-glow"></div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll-hint">
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
                <span className="scroll-text">SCROLL TO EXPLORE</span>
            </div>
        </section>
    );
};

export default Hero;
