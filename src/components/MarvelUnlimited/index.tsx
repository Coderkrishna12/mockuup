import React from 'react';
import './MarvelUnlimited.css';

const MarvelUnlimited: React.FC = () => {
    return (
        <section className="mu-promo">
            <div className="mu-bg-pattern"></div>
            <div className="mu-glow"></div>
            <div className="container mu-inner">
                <div className="mu-text">
                    <div className="mu-badge">
                        <span className="badge-line"></span>
                        <span>UNLIMITED ACCESS</span>
                    </div>
                    <h2 className="mu-title">MARVEL UNLIMITED</h2>
                    <p className="mu-desc">
                        Read over 30,000+ digital comics from Marvel's legendary library.
                        From classic Amazing Spider-Man to the latest Avengers — all in one place.
                    </p>
                    <div className="mu-features">
                        <div className="mu-feature">
                            <span className="feature-icon">📚</span>
                            <span>30,000+ Comics</span>
                        </div>
                        <div className="mu-feature">
                            <span className="feature-icon">🆕</span>
                            <span>New Issues Weekly</span>
                        </div>
                        <div className="mu-feature">
                            <span className="feature-icon">📱</span>
                            <span>Read Anywhere</span>
                        </div>
                    </div>
                    <div className="mu-cta-row">
                        <button className="mu-cta-btn">START FREE TRIAL</button>
                        <span className="mu-price">$9.99/mo after trial</span>
                    </div>
                </div>
                <div className="mu-art">
                    <div className="mu-cards-stack">
                        <div className="mu-comic-card" style={{ '--card-rotate': '-8deg', '--card-color': '#E8002D' } as React.CSSProperties}>
                            <span className="comic-title">AMAZING<br />SPIDER-MAN</span>
                            <span className="comic-issue">#1</span>
                        </div>
                        <div className="mu-comic-card" style={{ '--card-rotate': '0deg', '--card-color': '#1E3A8A' } as React.CSSProperties}>
                            <span className="comic-title">THE<br />AVENGERS</span>
                            <span className="comic-issue">#1</span>
                        </div>
                        <div className="mu-comic-card" style={{ '--card-rotate': '8deg', '--card-color': '#F0C040' } as React.CSSProperties}>
                            <span className="comic-title">INFINITY<br />GAUNTLET</span>
                            <span className="comic-issue">#1</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MarvelUnlimited;
