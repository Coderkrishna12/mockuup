import React from 'react';
import './NewsGrid.css';

const newsItems = [
    {
        id: 1,
        category: 'MOVIES',
        title: 'Marvel Studios Announces Phase 7 Slate at D23',
        excerpt: 'The future of the MCU looks brighter than ever with 8 new films revealed...',
        date: 'FEB 2026',
        color: '#E8002D',
    },
    {
        id: 2,
        category: 'STREAMING',
        title: 'X-Men Series Gets Official Green Light for Disney+',
        excerpt: 'The mutants are finally coming to the MCU in an epic new series...',
        date: 'FEB 2026',
        color: '#F0C040',
    },
    {
        id: 3,
        category: 'COMICS',
        title: 'Ultimate Universe Relaunches with All-New Lineup',
        excerpt: 'Marvel Comics is building a fresh universe with modern takes on classic heroes...',
        date: 'JAN 2026',
        color: '#1A5B9C',
    },
    {
        id: 4,
        category: 'GAMES',
        title: "Marvel's Wolverine Gameplay Trailer Drops",
        excerpt: 'Insomniac Games reveals brutal combat and stunning open-world exploration...',
        date: 'JAN 2026',
        color: '#14B8A6',
    },
    {
        id: 5,
        category: 'EVENTS',
        title: 'San Diego Comic-Con 2026: Marvel Dominates Hall H',
        excerpt: 'Exclusive panels, surprise cast reveals, and thunderous applause...',
        date: 'DEC 2025',
        color: '#8B5CF6',
    },
    {
        id: 6,
        category: 'MERCH',
        title: 'Hot Toys Unveils New Endgame Anniversary Collection',
        excerpt: 'Premium 1/6 scale figures celebrating the most epic crossover event...',
        date: 'DEC 2025',
        color: '#E8002D',
    },
];

const NewsGrid: React.FC = () => {
    return (
        <section className="news-section" id="news">
            <div className="container">
                <div className="news-header">
                    <div className="news-badge">
                        <span className="badge-line"></span>
                        <span>LATEST UPDATES</span>
                    </div>
                    <h2 className="section-title">MARVEL NEWS</h2>
                </div>

                <div className="news-grid">
                    {newsItems.map((item, index) => (
                        <article
                            key={item.id}
                            className={`news-card hover-lift ${index === 0 ? 'featured' : ''}`}
                            style={{ '--card-accent': item.color } as React.CSSProperties}
                        >
                            <div className="news-card-top">
                                <span className="news-category" style={{ color: item.color }}>{item.category}</span>
                                <span className="news-date">{item.date}</span>
                            </div>
                            <h3 className="news-title">{item.title}</h3>
                            <p className="news-excerpt">{item.excerpt}</p>
                            <div className="news-read-more">
                                <span>READ MORE</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsGrid;
