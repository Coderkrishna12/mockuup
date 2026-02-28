import React, { useEffect, useRef } from 'react';
import './ComicScroll.css';

// Use authentic character poses instead of broken proxy downloads
import ironManImg from '../../assets/images/iron-man.png';
import capImg from '../../assets/images/captain-america.png';
import thorImg from '../../assets/images/thor.png';
import thanosImg from '../../assets/images/thanos.png';
import spiderManImg from '../../assets/images/hero-bg.png';

const panelsData = [
    {
        id: 'panel-1',
        title: 'BEFORE THE AVENGERS...',
        text: 'There was only an idea. A spark in the darkness.',
        image: ironManImg,
        gradient: 'linear-gradient(135deg, #1a0000 0%, #2d0a0a 100%)',
        align: 'left' as const,
    },
    {
        id: 'panel-2',
        title: 'I AM IRON MAN',
        text: 'A brilliant mind in a cave built the future.',
        image: capImg,
        gradient: 'linear-gradient(135deg, #0a0a1a 0%, #0a1428 100%)',
        align: 'right' as const,
    },
    {
        id: 'panel-3',
        title: 'GOD OF THUNDER',
        text: 'From Asgard to Earth, the mightiest hero rises.',
        image: thorImg,
        gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a1428 100%)',
        align: 'left' as const,
    },
    {
        id: 'panel-4',
        title: 'INFINITY WAR',
        text: 'The hardest choices require the strongest wills.',
        image: thanosImg,
        gradient: 'linear-gradient(135deg, #140a1a 0%, #1a0a28 100%)',
        align: 'center' as const,
    },
    {
        id: 'panel-5',
        title: 'ENDGAME',
        text: 'Whatever it takes.',
        image: spiderManImg,
        gradient: 'linear-gradient(135deg, #1a0005 0%, #280a14 100%)',
        align: 'center' as const,
    },
];

const ComicScroll: React.FC = () => {
    const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
        );

        panelRefs.current.forEach((panel) => {
            if (panel) observer.observe(panel);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="comic-v3" id="story">
            <div className="container">
                <div className="comic-header">
                    <div className="comic-badge">
                        <span className="badge-line"></span>
                        <span>THE SAGA</span>
                    </div>
                    <h2 className="section-title">THE INFINITY SAGA</h2>
                </div>
            </div>

            <div className="comic-panels-stack">
                {panelsData.map((panel, index) => (
                    <div
                        key={panel.id}
                        ref={(el) => { panelRefs.current[index] = el; }}
                        className={`comic-panel-v3 align-${panel.align}`}
                        style={{ '--panel-gradient': panel.gradient } as React.CSSProperties}
                    >
                        <div className="panel-bg" style={{ background: panel.gradient }}></div>

                        <div className="panel-character">
                            <img src={panel.image} alt={panel.title} className="panel-char-img" />
                        </div>

                        <div className="panel-content">
                            <span className="panel-num">VOL. 0{index + 1}</span>
                            <h3 className="panel-title">{panel.title}</h3>
                            <p className="panel-text">{panel.text}</p>
                            <div className="panel-accent"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ComicScroll;
