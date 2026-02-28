import React, { useState, useMemo } from 'react';
import { mcuTimeline, timelineCategories } from '../utils/mcuTimelineData';
import Footer from '../components/Footer';
import './MCUTimeline.css';

const MCUTimeline: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const filtered = useMemo(() => {
        if (activeFilter === 'all') return mcuTimeline;
        return mcuTimeline.filter(e => e.category === activeFilter);
    }, [activeFilter]);

    return (
        <div className="timeline-page">
            <header className="timeline-header">
                <div className="container">
                    <div className="timeline-badge">
                        <span className="badge-line"></span>
                        <span>CHRONOLOGICAL ORDER</span>
                    </div>
                    <h1 className="timeline-page-title">MCU TIMELINE</h1>
                    <p className="timeline-subtitle">{mcuTimeline.length} key events from 1943 to present</p>
                </div>
            </header>

            <div className="container">
                <div className="timeline-filters">
                    <button className={`tl-filter ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>ALL</button>
                    {timelineCategories.map(cat => (
                        <button key={cat} className={`tl-filter ${activeFilter === cat ? 'active' : ''}`} onClick={() => setActiveFilter(cat)}>
                            {cat.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="mcu-timeline">
                    <div className="tl-spine"></div>
                    {filtered.map((event, i) => (
                        <div
                            key={event.id}
                            className={`tl-event ${i % 2 === 0 ? 'tl-left' : 'tl-right'}`}
                            style={{ '--ev-color': event.color, '--ev-delay': `${i * 100}ms` } as React.CSSProperties}
                        >
                            <div className="tl-connector">
                                <div className="tl-dot">
                                    <span className="tl-icon">{event.icon}</span>
                                </div>
                            </div>
                            <div className="tl-card">
                                <div className="tl-card-year">{event.year}</div>
                                <span className="tl-cat-badge">{event.category}</span>
                                <h3 className="tl-card-title">{event.title}</h3>
                                <p className="tl-card-desc">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MCUTimeline;
