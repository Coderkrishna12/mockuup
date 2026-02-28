import React, { useState, useRef, useEffect } from 'react';
import './HeroComparison.css';

const HeroComparison: React.FC = () => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDrag = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!containerRef.current) return;

        // Determine clientX based on mouse or touch event
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent | MouseEvent).clientX;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;

        setSliderPos(percent);
    };

    useEffect(() => {
        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        const handleTouchEnd = () => {
            window.removeEventListener('touchmove', handleDrag);
            window.removeEventListener('touchend', handleTouchEnd);
        };

        return () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleDrag);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent text selection
        if ('touches' in e) {
            window.addEventListener('touchmove', handleDrag, { passive: false });
            window.addEventListener('touchend', () => {
                window.removeEventListener('touchmove', handleDrag);
            }, { once: true });
        } else {
            window.addEventListener('mousemove', handleDrag);
            window.addEventListener('mouseup', () => {
                window.removeEventListener('mousemove', handleDrag);
            }, { once: true });
        }
    };

    // We use colored divs / gradient overlays instead of actual images 
    // since we don't have asset images provided, but keeping the requested format.
    return (
        <section className="comparison-section">
            <div className="container">
                <h2 className="section-title">CHOOSE YOUR HERO</h2>
                <p className="section-subtitle">Slide to compare fighting styles</p>

                <div
                    className="comparison-container"
                    ref={containerRef}
                    onMouseDown={(e) => {
                        handleDrag(e); // jump to click position first
                        startDrag(e);
                    }}
                    onTouchStart={(e) => {
                        handleDrag(e); // jump to touch position
                        startDrag(e);
                    }}
                >
                    {/* Base Layer - Captain America */}
                    <div className="compare-panel cap-panel">
                        <div className="compare-content right">
                            <h3>CAPTAIN AMERICA</h3>
                            <p>DEFENSE & STRATEGY</p>
                        </div>
                    </div>

                    {/* Overlay Layer - Iron Man */}
                    <div
                        className="compare-panel ironman-panel"
                        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                    >
                        <div className="compare-content left">
                            <h3>IRON MAN</h3>
                            <p>OFFENSE & TECHNOLOGY</p>
                        </div>
                    </div>

                    {/* The Slider Handle */}
                    <div
                        className="compare-slider-handle"
                        style={{ left: `${sliderPos}%` }}
                    >
                        <div className="slider-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroComparison;
