import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MultiversePortal.css';

const MultiversePortal: React.FC = () => {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    const handleUniverseClick = (_universeId: string, route: string) => {
        setIsTransitioning(true);

        // Play transition sound using standard Web Audio if AudioProvider hooked up
        // but keeping it self-contained for now via a CSS class hook
        document.body.classList.add('portal-transition');

        setTimeout(() => {
            document.body.classList.remove('portal-transition');
            navigate(route);
            setIsTransitioning(false);
        }, 2000); // 2 second distortion effect
    };

    const universes = [
        { id: 'u-199999', name: 'EARTH-199999', desc: 'The Cinematic Sacred Timeline', route: '/', color: '#E8002D', angle: 0 },
        { id: 'u-616', name: 'EARTH-616', desc: 'The Primary Comics Universe', route: '/universe/616', color: '#1A5B9C', angle: 120 },
        { id: 'u-838', name: 'EARTH-838', desc: 'The Illuminati Universe', route: '/universe/838', color: '#14B8A6', angle: 240 }
    ];

    return (
        <section className="portal-section" id="multiverse">
            {/* Full screen distortion overlay when transitioning */}
            {isTransitioning && <div className="portal-distortion-overlay"></div>}

            <div className="container">
                <h2 className="section-title">THE MULTIVERSE</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                    Warning: Multiversal travel may cause temporary reality distortion.
                </p>

                <div className="portal-container">

                    {/* Spinning Rings */}
                    <div className="portal-rings">
                        <div className="portal-ring ring-1"></div>
                        <div className="portal-ring ring-2"></div>
                        <div className="portal-ring ring-3"></div>
                        <div className="portal-ring ring-4"></div>
                    </div>

                    <div className="portal-center-node">
                        <div className="portal-pulse"></div>
                    </div>

                    {/* Universe Nodes positioned on a circle */}
                    {universes.map((uni) => {
                        // Trigonometry to place them on a circle (radius = 180px)
                        const radius = window.innerWidth > 768 ? 220 : 120;
                        const rad = uni.angle * (Math.PI / 180);
                        const x = Math.cos(rad) * radius;
                        const y = Math.sin(rad) * radius;

                        return (
                            <div
                                key={uni.id}
                                className="universe-node"
                                style={{
                                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                    '--node-color': uni.color
                                } as React.CSSProperties}
                                onClick={() => handleUniverseClick(uni.id, uni.route)}
                            >
                                <div className="uni-dot"></div>
                                <div className="uni-label">
                                    <h4>{uni.name}</h4>
                                    <p>{uni.desc}</p>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
};

export default MultiversePortal;
