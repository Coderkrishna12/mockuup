import React, { useState, useMemo } from 'react';
import { allShows, showStatuses } from '../utils/showsData';
import type { TVShow } from '../utils/showsData';
import Footer from '../components/Footer';
import './TVShows.css';

const TVShows: React.FC = () => {
    const [activeStatus, setActiveStatus] = useState<string>('All');
    const [selectedShow, setSelectedShow] = useState<TVShow | null>(null);
    const [showTrailer, setShowTrailer] = useState(false);

    const filtered = useMemo(() => {
        if (activeStatus === 'All') return allShows;
        return allShows.filter(s => s.status === activeStatus);
    }, [activeStatus]);

    return (
        <div className="shows-page">
            <header className="shows-page-header">
                <div className="container">
                    <div className="shows-badge">
                        <span className="badge-line"></span>
                        <span>MARVEL STUDIOS ON DISNEY+</span>
                    </div>
                    <h1 className="shows-page-title">TV SHOWS</h1>
                    <p className="shows-subtitle">{allShows.length} series expanding the MCU</p>
                </div>
            </header>

            <div className="container">
                {/* Status Filters */}
                <div className="shows-filters">
                    <button
                        className={`status-btn ${activeStatus === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveStatus('All')}
                    >ALL</button>
                    {showStatuses.map(status => (
                        <button
                            key={status}
                            className={`status-btn ${activeStatus === status ? 'active' : ''}`}
                            onClick={() => setActiveStatus(status)}
                        >{status.toUpperCase()}</button>
                    ))}
                </div>

                {/* Shows Grid */}
                <div className="shows-grid">
                    {filtered.map((show, i) => (
                        <div
                            key={show.id}
                            className="show-card"
                            style={{ '--show-color': show.color, '--anim-delay': `${i * 70}ms` } as React.CSSProperties}
                            onClick={() => setSelectedShow(show)}
                        >
                            <div className="show-card-bg" style={{ background: `linear-gradient(135deg, ${show.color}15, transparent)` }}></div>
                            <div className="show-card-content">
                                <div className="show-card-top">
                                    <span className={`show-status-dot ${show.status.toLowerCase()}`}></span>
                                    <span className="show-status-label">{show.status}</span>
                                    <span className="show-year">{show.year}</span>
                                </div>
                                <h3 className="show-card-title">{show.title}</h3>
                                <p className="show-card-synopsis">{show.synopsis}</p>
                                <div className="show-card-meta">
                                    <span className="show-seasons">{show.seasons}S · {show.episodes}E</span>
                                    <span className="show-rating">★ {show.rating}</span>
                                </div>
                                <div className="show-card-platform">{show.platform}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Show Detail Modal */}
            {selectedShow && (
                <div className="show-modal-overlay" onClick={() => { setSelectedShow(null); setShowTrailer(false); }}>
                    <div className="show-modal" onClick={e => e.stopPropagation()} style={{ '--show-color': selectedShow.color } as React.CSSProperties}>
                        <button className="show-modal-close" onClick={() => { setSelectedShow(null); setShowTrailer(false); }}>✕</button>

                        <div className="show-modal-header" style={{ background: `linear-gradient(135deg, ${selectedShow.color}20, transparent)` }}>
                            <div className="show-modal-top">
                                <span className={`show-status-dot ${selectedShow.status.toLowerCase()}`}></span>
                                <span className="modal-status">{selectedShow.status}</span>
                                <span className="modal-platform">{selectedShow.platform}</span>
                            </div>
                            <h2 className="show-modal-title">{selectedShow.title}</h2>
                            <div className="show-modal-stats">
                                <span>{selectedShow.year}</span>
                                <span>·</span>
                                <span>{selectedShow.seasons} Season{selectedShow.seasons > 1 ? 's' : ''}</span>
                                <span>·</span>
                                <span>{selectedShow.episodes} Episodes</span>
                                <span>·</span>
                                <span>★ {selectedShow.rating}</span>
                            </div>
                        </div>

                        <div className="show-modal-body">
                            <p className="show-modal-synopsis">{selectedShow.synopsis}</p>

                            <div className="show-modal-cast">
                                <h4 className="modal-section-label">CAST</h4>
                                <div className="show-cast-chips">
                                    {selectedShow.cast.map((actor, i) => (
                                        <span key={i} className="show-cast-chip">{actor}</span>
                                    ))}
                                </div>
                            </div>

                            {selectedShow.trailerUrl && selectedShow.trailerUrl.length > 35 && (
                                <div className="show-modal-trailer">
                                    {!showTrailer ? (
                                        <button className="btn-show-trailer" onClick={() => setShowTrailer(true)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                                            WATCH TRAILER
                                        </button>
                                    ) : (
                                        <div className="trailer-embed">
                                            <iframe
                                                src={selectedShow.trailerUrl}
                                                title={`${selectedShow.title} Trailer`}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default TVShows;
