import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById } from '../utils/moviesData';
import Footer from '../components/Footer';
import './MovieDetail.css';

const MovieDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const movie = getMovieById(id || '');
    const [showTrailer, setShowTrailer] = useState(false);

    if (!movie) {
        return (
            <div className="movie-detail-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', color: 'white' }}>MOVIE NOT FOUND</h1>
                    <Link to="/movies" style={{ color: 'var(--marvel-red)', textDecoration: 'none' }}>← Back to Movies</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="movie-detail-page" style={{ '--movie-color': movie.color } as React.CSSProperties}>
            <div className="movie-detail-glow" style={{ background: `radial-gradient(ellipse at 70% 30%, ${movie.color}20 0%, transparent 60%)` }}></div>

            <Link to="/movies" className="back-link">← BACK TO MOVIES</Link>

            {/* Hero */}
            <section className="movie-hero">
                <div className="container">
                    <div className="movie-hero-content">
                        <div className="movie-hero-left">
                            <div className="movie-hero-tags">
                                <span className="movie-hero-phase">PHASE {movie.phase}</span>
                                <span className="movie-hero-year">{movie.year}</span>
                            </div>
                            <h1 className="movie-hero-title">{movie.title}</h1>
                            <div className="movie-hero-meta">
                                <span className="hero-rating">★ {movie.rating}/10</span>
                                <span className="hero-divider">|</span>
                                <span className="hero-runtime">{movie.runtime}</span>
                            </div>
                            <p className="movie-hero-synopsis">{movie.synopsis}</p>

                            <div className="movie-hero-actions">
                                <button
                                    className="btn-watch-trailer"
                                    onClick={() => setShowTrailer(true)}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                                    WATCH TRAILER
                                </button>
                            </div>
                        </div>

                        {/* Poster Placeholder */}
                        <div className="movie-hero-right">
                            <div className="movie-poster" style={{ background: `linear-gradient(135deg, ${movie.color}30, ${movie.color}10)` }}>
                                <span className="poster-title">{movie.title}</span>
                                <span className="poster-year">{movie.year}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cast */}
            <section className="movie-section">
                <div className="container">
                    <div className="section-header-badge">
                        <span className="badge-line" style={{ background: movie.color }}></span>
                        <span>CAST & CREW</span>
                    </div>
                    <h2 className="movie-section-title">STARRING</h2>
                    <div className="cast-grid">
                        {movie.cast.map((actor, i) => (
                            <div key={i} className="cast-chip">
                                <div className="cast-avatar">{actor.split(' ').map(w => w[0]).join('')}</div>
                                <span className="cast-name">{actor}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trailer Modal */}
            {showTrailer && (
                <div className="trailer-modal-overlay" onClick={() => setShowTrailer(false)}>
                    <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
                        <iframe
                            src={movie.trailerUrl}
                            title={`${movie.title} Trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="trailer-iframe"
                        ></iframe>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default MovieDetail;
