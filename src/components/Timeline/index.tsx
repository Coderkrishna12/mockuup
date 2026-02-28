import React, { useRef, useState, useEffect } from 'react';
import { timelineData } from '../../utils/timelineData';
import './Timeline.css';

const Timeline: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [activeColor, setActiveColor] = useState(timelineData[0]?.color || '#E8002D');

    // Drag-to-scroll
    const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        if (!scrollContainerRef.current) return;
        const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
        setStartX(pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const stopDrag = () => setIsDragging(false);

    const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
        const walk = (pageX - scrollContainerRef.current.offsetLeft - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    // Mouse wheel horizontal scroll support
    const handleWheel = (e: React.WheelEvent) => {
        if (scrollContainerRef.current) {
            e.preventDefault();
            scrollContainerRef.current.scrollLeft += e.deltaY;
        }
    };

    // Intersection Observer for dynamic colour
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const color = entry.target.getAttribute('data-color');
                        if (color) setActiveColor(color);
                    }
                });
            },
            { root: scrollContainerRef.current, threshold: 0.6 }
        );

        const cards = document.querySelectorAll('.tl-card');
        cards.forEach((c) => observer.observe(c));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            className="timeline-v3"
            id="timeline"
            style={{ '--tl-glow': activeColor } as React.CSSProperties}
        >
            <div className="tl-dynamic-glow"></div>

            <div className="container">
                <div className="tl-header">
                    <div className="tl-badge">
                        <span className="badge-line"></span>
                        <span>EXPLORE THE SAGA</span>
                    </div>
                    <h2 className="section-title">THE SACRED TIMELINE</h2>
                    <p className="tl-hint">Drag or scroll to explore</p>
                </div>
            </div>

            <div
                className={`tl-scroll ${isDragging ? 'is-dragging' : ''}`}
                ref={scrollContainerRef}
                onMouseDown={startDrag}
                onMouseLeave={stopDrag}
                onMouseUp={stopDrag}
                onMouseMove={handleDrag}
                onTouchStart={startDrag}
                onTouchEnd={stopDrag}
                onTouchMove={handleDrag}
                onWheel={handleWheel}
            >
                <div className="tl-track">
                    <div className="tl-center-line"></div>

                    {timelineData.map((event, index) => (
                        <div
                            key={event.id}
                            className="tl-card"
                            data-color={event.color}
                        >
                            {/* Node dot on the centerline */}
                            <div className="tl-node">
                                <div className="tl-node-core" style={{ background: event.color }}></div>
                                <div className="tl-node-ring" style={{ borderColor: event.color }}></div>
                            </div>

                            {/* Content card alternating above/below */}
                            <div className={`tl-content ${index % 2 === 0 ? 'above' : 'below'}`}>
                                <span className="tl-year">{event.year}</span>
                                <h3 className="tl-title">{event.title}</h3>
                                <p className="tl-synopsis">{event.synopsis}</p>
                                <div className="tl-chars">
                                    {event.characters.slice(0, 3).map((char, i) => (
                                        <span key={i} className="tl-char-tag">{char}</span>
                                    ))}
                                </div>
                                <span className="tl-phase" style={{ background: event.color }}>
                                    PHASE {event.phase}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Timeline;
