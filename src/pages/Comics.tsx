import React, { useState, useMemo } from 'react';
import { allComics, eras } from '../utils/comicsData';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './Comics.css';

const Comics: React.FC = () => {
    const [activeEra, setActiveEra] = useState<string>('All');
    const [selectedComic, setSelectedComic] = useState<string | null>(null);

    const filtered = useMemo(() => {
        if (activeEra === 'All') return allComics;
        return allComics.filter(c => c.era === activeEra);
    }, [activeEra]);

    const selected = selectedComic ? allComics.find(c => c.id === selectedComic) : null;

    return (
        <div className="comics-page">
            <header className="comics-page-header">
                <Link to="/" className="back-link">← BACK TO HOME</Link>
                <div className="container">
                    <div className="comics-badge">
                        <span className="badge-line"></span>
                        <span>MARVEL COMICS VAULT</span>
                    </div>
                    <h1 className="comics-page-title">COMICS</h1>
                    <p className="comics-subtitle">{allComics.length} legendary issues across Marvel history</p>
                </div>
            </header>

            <div className="container">
                {/* Era Filters */}
                <div className="comics-filters">
                    <div className="era-filters">
                        <button
                            className={`era-btn ${activeEra === 'All' ? 'active' : ''}`}
                            onClick={() => setActiveEra('All')}
                        >ALL ERAS</button>
                        {eras.map(era => (
                            <button
                                key={era}
                                className={`era-btn ${activeEra === era ? 'active' : ''}`}
                                onClick={() => setActiveEra(era)}
                            >{era.toUpperCase()}</button>
                        ))}
                    </div>
                </div>

                {/* Comics Grid */}
                <div className="comics-grid">
                    {filtered.map((comic, i) => (
                        <div
                            key={comic.id}
                            className="comic-card"
                            style={{ '--comic-color': comic.color, '--anim-delay': `${i * 80}ms` } as React.CSSProperties}
                            onClick={() => setSelectedComic(comic.id)}
                        >
                            <div className="comic-cover-wrap">
                                <img
                                    src={comic.coverUrl}
                                    alt={comic.title}
                                    className="comic-cover-img"
                                    loading="lazy"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <div className="comic-cover-fallback">
                                    <span className="cover-series">{comic.series}</span>
                                    <span className="cover-issue">#{comic.issue}</span>
                                </div>
                                <div className="comic-year-badge">{comic.year}</div>
                            </div>
                            <div className="comic-info">
                                <span className="comic-era-tag">{comic.era}</span>
                                <h3 className="comic-title">{comic.title}</h3>
                                <p className="comic-credits">{comic.writer} & {comic.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comic Detail Modal */}
            {selected && (
                <div className="comic-modal-overlay" onClick={() => setSelectedComic(null)}>
                    <div className="comic-modal" onClick={e => e.stopPropagation()} style={{ '--comic-color': selected.color } as React.CSSProperties}>
                        <button className="comic-modal-close" onClick={() => setSelectedComic(null)}>✕</button>
                        <div className="comic-modal-grid">
                            <div className="comic-modal-cover">
                                <img
                                    src={selected.coverUrl}
                                    alt={selected.title}
                                    className="modal-cover-img"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <div className="modal-cover-fallback">
                                    <span className="modal-series">{selected.series}</span>
                                    <span className="modal-issue">#{selected.issue}</span>
                                </div>
                            </div>
                            <div className="comic-modal-info">
                                <span className="modal-era">{selected.era} · {selected.year}</span>
                                <h2 className="modal-title">{selected.title}</h2>
                                <p className="modal-desc">{selected.description}</p>
                                <div className="modal-credits">
                                    <div className="credit-row">
                                        <span className="credit-label">WRITER</span>
                                        <span className="credit-value">{selected.writer}</span>
                                    </div>
                                    <div className="credit-row">
                                        <span className="credit-label">ARTIST</span>
                                        <span className="credit-value">{selected.artist}</span>
                                    </div>
                                    <div className="credit-row">
                                        <span className="credit-label">SERIES</span>
                                        <span className="credit-value">{selected.series}</span>
                                    </div>
                                    <div className="credit-row">
                                        <span className="credit-label">ISSUE</span>
                                        <span className="credit-value">#{selected.issue}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Comics;
