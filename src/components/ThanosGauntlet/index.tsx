import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import './ThanosGauntlet.css';

const ThanosGauntlet: React.FC = () => {
    const [snapState, setSnapState] = useState<'idle' | 'snapping' | 'snapped' | 'reversing'>('idle');
    const canvasLayerRef = useRef<HTMLDivElement>(null);

    const handleSnap = async () => {
        if (snapState !== 'idle') return;

        setSnapState('snapping');
        document.body.classList.add('snap-active');

        // 1. Select random elements to dust
        const allElements = Array.from(document.querySelectorAll('h1, h2, h3, p, .character-card, .timeline-node'));
        const elementsToDust = allElements.filter(() => Math.random() > 0.5);

        // 2. Generate particles for each element
        for (const el of elementsToDust) {
            if (!canvasLayerRef.current) break;

            const htmlEl = el as HTMLElement;

            try {
                const canvas = await html2canvas(htmlEl, {
                    backgroundColor: null,
                    logging: false
                });

                const ctx = canvas.getContext('2d');
                if (!ctx) continue;

                const rect = htmlEl.getBoundingClientRect();

                // Hide original element
                htmlEl.style.transition = 'opacity 2s ease';
                htmlEl.style.opacity = '0';

                // Create a container for the particles over the exact spot
                const particleContainer = document.createElement('div');
                particleContainer.className = 'dust-container';
                particleContainer.style.left = `${rect.left + window.scrollX}px`;
                particleContainer.style.top = `${rect.top + window.scrollY}px`;
                particleContainer.style.width = `${rect.width}px`;
                particleContainer.style.height = `${rect.height}px`;

                // Simplified particle creation for performance
                for (let i = 0; i < 30; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'dust-particle';

                    particle.style.background = Math.random() > 0.5 ? '#888' : '#444';

                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;

                    const tx = (Math.random() - 0.5) * 200;
                    const ty = -Math.random() * 200;
                    const rot = Math.random() * 360;

                    particle.style.setProperty('--tx', `${tx}px`);
                    particle.style.setProperty('--ty', `${ty}px`);
                    particle.style.setProperty('--rot', `${rot}deg`);

                    particleContainer.appendChild(particle);
                }

                canvasLayerRef.current.appendChild(particleContainer);

                // Trigger animation
                requestAnimationFrame(() => {
                    particleContainer.classList.add('snapping');
                });

            } catch (e) {
                console.error("Snap effect failed on element", el);
            }
        }

        setSnapState('snapped');
    };

    useEffect(() => {
        let timeout: number;

        if (snapState === 'snapped') {
            // Automatically reverse after 4 seconds
            timeout = window.setTimeout(() => {
                setSnapState('reversing');
                document.body.classList.remove('snap-active');

                const allElements = document.querySelectorAll('h1, h2, h3, p, .character-card, .timeline-node');
                allElements.forEach(el => {
                    (el as HTMLElement).style.opacity = '1';
                });

                if (canvasLayerRef.current) {
                    // Reverse particle animation
                    const containers = canvasLayerRef.current.querySelectorAll('.dust-container');
                    containers.forEach(c => c.classList.remove('snapping'));

                    // Clean up DOM after reversal
                    setTimeout(() => {
                        if (canvasLayerRef.current) {
                            canvasLayerRef.current.innerHTML = '';
                        }
                        setSnapState('idle');
                    }, 2000);
                }
            }, 4000);
        }

        return () => clearTimeout(timeout);
    }, [snapState]);

    return (
        <>
            <div id="particle-layer" ref={canvasLayerRef}></div>
            <div className={`gauntlet-container ${snapState}`}>
                <button
                    className="snap-btn"
                    onClick={handleSnap}
                    disabled={snapState !== 'idle'}
                    title="Perfectly balanced, as all things should be."
                >
                    <div className="gauntlet-icon">🤌</div>
                </button>
            </div>
        </>
    );
};

export default ThanosGauntlet;
