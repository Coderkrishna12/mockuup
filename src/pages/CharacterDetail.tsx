import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCharacterById } from '../utils/characterProfiles';
import type { CharacterProfile } from '../utils/characterProfiles';
import Footer from '../components/Footer';
import './CharacterDetail.css';

const PowerBar: React.FC<{ label: string; value: number; color: string; delay: number }> = ({ label, value, color, delay }) => {
    const [animated, setAnimated] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setAnimated(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div className="power-row">
            <span className="power-label">{label}</span>
            <div className="power-track">
                <div
                    className="power-fill"
                    style={{
                        width: animated ? `${value}%` : '0%',
                        background: `linear-gradient(90deg, ${color}, ${color}88)`,
                        boxShadow: animated ? `0 0 12px ${color}44` : 'none'
                    }}
                ></div>
            </div>
            <span className="power-value">{value}</span>
        </div>
    );
};

const CharacterDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const char = getCharacterById(id || '');

    if (!char) {
        return (
            <div className="char-detail-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', color: 'white' }}>HERO NOT FOUND</h1>
                    <Link to="/characters" style={{ color: 'var(--marvel-red)', textDecoration: 'none' }}>← Back to Characters</Link>
                </div>
            </div>
        );
    }

    const related = char.relatedIds.map(rid => getCharacterById(rid)).filter(Boolean) as CharacterProfile[];
    const totalPower = Math.round(Object.values(char.powers).reduce((a, b) => a + b, 0) / 6);

    return (
        <div className="char-detail-page" style={{ '--char-color': char.color } as React.CSSProperties}>
            {/* Ambient Glow */}
            <div className="detail-glow" style={{ background: `radial-gradient(circle, ${char.color}22 0%, transparent 60%)` }}></div>

            {/* Navigation */}
            <Link to="/characters" className="back-link">← BACK TO CHARACTERS</Link>

            {/* Hero Section */}
            <section className="detail-hero">
                <div className="detail-hero-content">
                    <div className="detail-hero-left">
                        <span className="detail-team-badge">{char.team}</span>
                        <h1 className="detail-name">{char.name}</h1>
                        <p className="detail-alias">{char.alias}</p>
                        <p className="detail-bio">{char.bio}</p>

                        <div className="detail-overall">
                            <div className="overall-ring" style={{ background: `conic-gradient(${char.color} ${totalPower * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}>
                                <span className="overall-num">{totalPower}</span>
                            </div>
                            <span className="overall-label">OVERALL POWER</span>
                        </div>
                    </div>
                    <div className="detail-hero-right">
                        <img src={char.image} alt={char.name} className="detail-hero-img" />
                    </div>
                </div>
            </section>

            {/* Power Stats */}
            <section className="detail-section">
                <div className="container">
                    <div className="section-header-badge">
                        <span className="badge-line" style={{ background: char.color }}></span>
                        <span>POWER ANALYSIS</span>
                    </div>
                    <h2 className="detail-section-title">ABILITIES</h2>

                    <div className="powers-grid">
                        <PowerBar label="STRENGTH" value={char.powers.strength} color={char.color} delay={200} />
                        <PowerBar label="SPEED" value={char.powers.speed} color={char.color} delay={300} />
                        <PowerBar label="DURABILITY" value={char.powers.durability} color={char.color} delay={400} />
                        <PowerBar label="ENERGY" value={char.powers.energy} color={char.color} delay={500} />
                        <PowerBar label="INTELLIGENCE" value={char.powers.intelligence} color={char.color} delay={600} />
                        <PowerBar label="COMBAT" value={char.powers.combat} color={char.color} delay={700} />
                    </div>
                </div>
            </section>

            {/* Movie Appearances */}
            <section className="detail-section">
                <div className="container">
                    <div className="section-header-badge">
                        <span className="badge-line" style={{ background: char.color }}></span>
                        <span>FILMOGRAPHY</span>
                    </div>
                    <h2 className="detail-section-title">MCU APPEARANCES</h2>

                    <div className="movies-grid">
                        {char.movies.map((movie, i) => (
                            <div key={i} className="movie-chip">
                                <span className="movie-num">{String(i + 1).padStart(2, '0')}</span>
                                <span className="movie-name">{movie}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related Characters */}
            {related.length > 0 && (
                <section className="detail-section">
                    <div className="container">
                        <div className="section-header-badge">
                            <span className="badge-line" style={{ background: char.color }}></span>
                            <span>CONNECTIONS</span>
                        </div>
                        <h2 className="detail-section-title">RELATED CHARACTERS</h2>

                        <div className="related-grid">
                            {related.map((r) => (
                                <Link to={`/characters/${r.id}`} key={r.id} className="related-card" style={{ '--r-color': r.color } as React.CSSProperties}>
                                    <img src={r.image} alt={r.name} className="related-img" />
                                    <div className="related-info">
                                        <span className="related-name">{r.name}</span>
                                        <span className="related-alias">{r.alias}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
};

export default CharacterDetail;
