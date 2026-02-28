import React, { useState, useEffect, useCallback } from 'react';
import './TrendingCarousel.css';

import ironManImg from '../../assets/images/iron-man.png';
import thorImg from '../../assets/images/thor.png';
import strangeImg from '../../assets/images/doctor-strange.png';
import thanosImg from '../../assets/images/thanos.png';

const trendingItems = [
    {
        id: 1,
        title: 'AVENGERS: SECRET WARS',
        subtitle: 'THE MULTIVERSE SAGA CONCLUDES',
        tag: 'UPCOMING MOVIE',
        image: ironManImg,
        gradient: 'linear-gradient(135deg, #1a0000, #2d0a0a)',
        accentColor: '#E8002D',
    },
    {
        id: 2,
        title: 'THOR: VALHALLA',
        subtitle: 'A NEW CHAPTER FOR THE GOD OF THUNDER',
        tag: 'PHASE 7',
        image: thorImg,
        gradient: 'linear-gradient(135deg, #0a0a1a, #0a1428)',
        accentColor: '#1A5B9C',
    },
    {
        id: 3,
        title: 'DOCTOR STRANGE 3',
        subtitle: 'THE SORCERER SUPREME RETURNS',
        tag: 'NOW STREAMING',
        image: strangeImg,
        gradient: 'linear-gradient(135deg, #0a0512, #1a0a28)',
        accentColor: '#8B5CF6',
    },
    {
        id: 4,
        title: 'THE MAD TITAN',
        subtitle: 'WITNESS THE RISE OF THANOS',
        tag: 'DISNEY+ ORIGINAL',
        image: thanosImg,
        gradient: 'linear-gradient(135deg, #140a1a, #1a0a28)',
        accentColor: '#F0C040',
    },
];

const TrendingCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const goToSlide = useCallback((index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 800);
    }, [isTransitioning]);

    const nextSlide = useCallback(() => {
        goToSlide((currentIndex + 1) % trendingItems.length);
    }, [currentIndex, goToSlide]);

    // Auto-rotate every 5 seconds
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    const current = trendingItems[currentIndex];

    return (
        <section className="trending-section" style={{ '--accent': current.accentColor } as React.CSSProperties}>
            <div className="trending-bg" style={{ background: current.gradient }}></div>
            <div className="trending-glow" style={{ background: `radial-gradient(circle, ${current.accentColor}22 0%, transparent 60%)` }}></div>

            <div className="trending-content">
                <div className="trending-left">
                    <span className="trending-tag">{current.tag}</span>
                    <h2 className="trending-title">{current.title}</h2>
                    <p className="trending-subtitle">{current.subtitle}</p>
                    <div className="trending-actions">
                        <button className="btn-trending-primary">LEARN MORE</button>
                        <button className="btn-trending-ghost">▶ WATCH TRAILER</button>
                    </div>
                </div>
                <div className="trending-right">
                    <div className="trending-character" key={current.id}>
                        <img src={current.image} alt={current.title} />
                    </div>
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="trending-dots">
                {trendingItems.map((_, i) => (
                    <button
                        key={i}
                        className={`trending-dot ${i === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(i)}
                    >
                        <span className="dot-progress"></span>
                    </button>
                ))}
            </div>

            {/* Counter */}
            <div className="trending-counter">
                <span className="counter-current">0{currentIndex + 1}</span>
                <span className="counter-sep">/</span>
                <span className="counter-total">0{trendingItems.length}</span>
            </div>
        </section>
    );
};

export default TrendingCarousel;
