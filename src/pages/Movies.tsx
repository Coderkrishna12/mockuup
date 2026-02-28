import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { allMovies, phases } from '../utils/moviesData';
import Footer from '../components/Footer';
import './Movies.css';

const Movies: React.FC = () => {
    const [activePhase, setActivePhase] = useState<number | 'all'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

    const filtered = useMemo(() => {
        if (activePhase === 'all') return allMovies;
        return allMovies.filter(m => m.phase === activePhase);
    }, [activePhase]);

    return (
        <div className="movies-page">
            {/* Header */}
            <header className="movies-page-header">
                <Link to="/" className="back-link">← BACK TO HOME</Link>
                <div className="container">
                    <div className="movies-badge">
                        <span className="badge-line"></span>
                        <span>MARVEL CINEMATIC UNIVERSE</span>
                    </div>
                    <h1 className="movies-page-title">MOVIES</h1>
                    <p className="movies-subtitle">{allMovies.length} films across {phases.length} phases</p>
                </div>
            </header>

            <div className="container">
                {/* Filters Bar */}
                <div className="movies-filters">
                    <div className="phase-filters">
                        <button
                            className={`phase-btn ${activePhase === 'all' ? 'active' : ''}`}
                            onClick={() => setActivePhase('all')}
                        >ALL PHASES</button>
                        {phases.map(p => (
                            <button
                                key={p}
                                className={`phase-btn ${activePhase === p ? 'active' : ''}`}
                                onClick={() => setActivePhase(p)}
                            >PHASE {p}</button>
                        ))}
                    </div>
                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></svg>
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
                            onClick={() => setViewMode('timeline')}
                            title="Timeline View"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22" /><circle cx="12" cy="6" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="18" r="2" /></svg>
                        </button>
                    </div>
                </div>

                {/* Grid View */}
                {viewMode === 'grid' && (
                    <div className="movies-grid">
                        {filtered.map((movie, i) => (
                            <Link
                                to={`/movies/${movie.id}`}
                                key={movie.id}
                                className="movie-card hover-lift"
                                style={{ '--movie-color': movie.color, '--anim-delay': `${i * 60}ms` } as React.CSSProperties}
                            >
                                <div className="movie-card-bg" style={{ background: `linear-gradient(135deg, ${movie.color}15, transparent)` }}></div>
                                <div className="movie-card-content">
                                    <div className="movie-card-top">
                                        <span className="movie-phase-tag">PHASE {movie.phase}</span>
                                        <span className="movie-year">{movie.year}</span>
                                    </div>
                                    <h3 className="movie-card-title">{movie.title}</h3>
                                    <p className="movie-card-synopsis">{movie.synopsis}</p>
                                    <div className="movie-card-meta">
                                        <span className="movie-rating">★ {movie.rating}</span>
                                        <span className="movie-runtime">{movie.runtime}</span>
                                    </div>
                                    <div className="movie-card-cta">
                                        <span>VIEW DETAILS</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Timeline View */}
                {viewMode === 'timeline' && (
                    <div className="movies-timeline">
                        <div className="timeline-line"></div>
                        {filtered.map((movie, i) => (
                            <Link
                                to={`/movies/${movie.id}`}
                                key={movie.id}
                                className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}
                                style={{ '--movie-color': movie.color } as React.CSSProperties}
                            >
                                <div className="timeline-node">
                                    <div className="timeline-dot"></div>
                                </div>
                                <div className="timeline-card">
                                    <span className="timeline-year">{movie.year}</span>
                                    <h4 className="timeline-title">{movie.title}</h4>
                                    <span className="timeline-phase">PHASE {movie.phase}</span>
                                    <div className="timeline-rating">★ {movie.rating}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Movies;
