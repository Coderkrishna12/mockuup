import React from 'react';
import Footer from '../components/Footer';
import './About.css';

interface Milestone {
    year: string;
    title: string;
    description: string;
    color: string;
}

const milestones: Milestone[] = [
    { year: '1939', title: 'Timely Comics Founded', description: 'Martin Goodman founds Timely Publications, the precursor to Marvel Comics. The Human Torch and Namor debut.', color: '#F97316' },
    { year: '1941', title: 'Captain America #1', description: 'Joe Simon and Jack Kirby create Captain America, punching Hitler on the cover months before Pearl Harbor.', color: '#1E3A8A' },
    { year: '1961', title: 'Fantastic Four #1', description: 'Stan Lee and Jack Kirby launch the Fantastic Four, igniting the Marvel Age of Comics.', color: '#3B82F6' },
    { year: '1962', title: 'Spider-Man Debuts', description: 'Amazing Fantasy #15 introduces Peter Parker. Stan Lee and Steve Ditko create the most relatable hero in comics.', color: '#DC2626' },
    { year: '1963', title: 'The X-Men & Avengers', description: 'Two iconic teams debut within months of each other, expanding the Marvel Universe exponentially.', color: '#EAB308' },
    { year: '1966', title: 'Marvel Name Adopted', description: 'The company officially rebrands from Atlas Comics to Marvel Comics Group, cementing its identity.', color: '#E8002D' },
    { year: '1974', title: 'Wolverine First Appears', description: 'The Incredible Hulk #181 introduces Wolverine, who would become one of Marvel\'s most popular characters.', color: '#166534' },
    { year: '1991', title: 'Infinity Gauntlet', description: 'Jim Starlin\'s cosmic epic sees Thanos wield the Infinity Gauntlet — the inspiration for the MCU\'s biggest arc.', color: '#F0C040' },
    { year: '2008', title: 'Iron Man & The MCU', description: 'Robert Downey Jr. stars in Iron Man, launching the Marvel Cinematic Universe and changing cinema forever.', color: '#E8002D' },
    { year: '2012', title: 'The Avengers', description: 'Earth\'s Mightiest Heroes assemble on screen for the first time. The MCU model proves it can work at massive scale.', color: '#1E3A8A' },
    { year: '2018', title: 'Infinity War & The Snap', description: 'Thanos snaps his fingers and erases half the universe. The biggest cliffhanger in cinema history.', color: '#F0C040' },
    { year: '2019', title: 'Endgame — $2.8 Billion', description: 'Avengers: Endgame becomes the highest-grossing film of all time, completing the Infinity Saga.', color: '#E8002D' },
];

const stats = [
    { label: 'Comics Published', value: '40,000+', icon: '📚' },
    { label: 'MCU Films', value: '34+', icon: '🎬' },
    { label: 'Disney+ Series', value: '12+', icon: '📺' },
    { label: 'Characters Created', value: '8,000+', icon: '🦸' },
    { label: 'Box Office Revenue', value: '$30B+', icon: '💰' },
    { label: 'Years of Stories', value: '85+', icon: '📖' },
];

const About: React.FC = () => {
    return (
        <div className="about-page">
            <header className="about-header">
                <div className="container">
                    <div className="about-badge">
                        <span className="badge-line"></span>
                        <span>THE LEGACY</span>
                    </div>
                    <h1 className="about-title">ABOUT MARVEL</h1>
                    <p className="about-intro">
                        From a small publishing house in 1939 to the most dominant entertainment franchise on the planet,
                        Marvel has created a universe of heroes, villains, and stories that have defined popular culture
                        for over eight decades.
                    </p>
                </div>
            </header>

            <div className="container">
                {/* Stats Grid */}
                <div className="about-stats-grid">
                    {stats.map((stat, i) => (
                        <div key={i} className="about-stat-card" style={{ '--stat-delay': `${i * 80}ms` } as React.CSSProperties}>
                            <span className="stat-icon">{stat.icon}</span>
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Milestones */}
                <div className="about-milestones">
                    <h2 className="milestones-title">KEY MILESTONES</h2>
                    <div className="milestones-list">
                        {milestones.map((m, i) => (
                            <div key={i} className="milestone" style={{ '--ms-color': m.color, '--ms-delay': `${i * 80}ms` } as React.CSSProperties}>
                                <div className="ms-year-col">
                                    <span className="ms-year">{m.year}</span>
                                    <span className="ms-dot"></span>
                                    {i < milestones.length - 1 && <span className="ms-line"></span>}
                                </div>
                                <div className="ms-content">
                                    <h3 className="ms-title">{m.title}</h3>
                                    <p className="ms-desc">{m.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mission */}
                <div className="about-mission">
                    <div className="mission-badge">
                        <span className="badge-line"></span>
                        <span>EXCELSIOR</span>
                    </div>
                    <blockquote className="mission-quote">
                        "With great power there must also come — great responsibility."
                    </blockquote>
                    <p className="mission-attribution">— Stan Lee, Amazing Fantasy #15 (1962)</p>
                    <p className="mission-text">
                        This project is a tribute to the incredible universe that Stan Lee, Jack Kirby, Steve Ditko,
                        and countless creators have built. Marvel Multiverse is built for educational purposes
                        and as a celebration of everything Marvel.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default About;
