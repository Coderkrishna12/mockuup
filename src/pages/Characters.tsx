import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { allCharacters, teams } from '../utils/characterProfiles';
import Footer from '../components/Footer';
import '../components/CharacterCard/CharacterCard.css';

const Characters: React.FC = () => {
    const [search, setSearch] = useState('');
    const [activeTeam, setActiveTeam] = useState('All');

    const filtered = useMemo(() => {
        return allCharacters.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.alias.toLowerCase().includes(search.toLowerCase());
            const matchesTeam = activeTeam === 'All' || c.team === activeTeam;
            return matchesSearch && matchesTeam;
        });
    }, [search, activeTeam]);

    return (
        <div className="characters-page">
            {/* Header */}
            <header className="chars-page-header">
                <Link to="/" className="back-link">← BACK TO HOME</Link>
                <div className="container">
                    <div className="chars-badge">
                        <span className="badge-line"></span>
                        <span>MARVEL DATABASE</span>
                    </div>
                    <h1 className="chars-page-title">CHARACTERS</h1>
                    <p className="chars-subtitle">{allCharacters.length} heroes, villains, and legends</p>
                </div>
            </header>

            {/* Filters */}
            <div className="container">
                <div className="chars-filters">
                    <div className="search-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search characters..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="team-filters">
                        <button
                            className={`team-btn ${activeTeam === 'All' ? 'active' : ''}`}
                            onClick={() => setActiveTeam('All')}
                        >ALL</button>
                        {teams.map((team) => (
                            <button
                                key={team}
                                className={`team-btn ${activeTeam === team ? 'active' : ''}`}
                                onClick={() => setActiveTeam(team)}
                            >{team.toUpperCase()}</button>
                        ))}
                    </div>
                </div>

                {/* Character Grid */}
                <div className="chars-grid">
                    {filtered.map((char) => (
                        <Link
                            to={`/characters/${char.id}`}
                            key={char.id}
                            className="char-card-link"
                        >
                            <div
                                className="char-card"
                                style={{ '--char-color': char.color } as React.CSSProperties}
                            >
                                <div className="char-card-img-wrap">
                                    <img src={char.image} alt={char.name} className="char-card-img" />
                                </div>
                                <div className="char-card-overlay">
                                    <span className="char-card-team">{char.team}</span>
                                    <h3 className="char-card-name">{char.name}</h3>
                                    <p className="char-card-alias">{char.alias}</p>
                                    <div className="char-card-mini-stats">
                                        <div className="mini-stat">
                                            <span className="mini-label">STR</span>
                                            <div className="mini-bar"><div className="mini-fill" style={{ width: `${char.powers.strength}%` }}></div></div>
                                        </div>
                                        <div className="mini-stat">
                                            <span className="mini-label">INT</span>
                                            <div className="mini-bar"><div className="mini-fill" style={{ width: `${char.powers.intelligence}%` }}></div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="chars-empty">
                        <h3>NO HEROES FOUND</h3>
                        <p>Try a different search or filter.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Characters;
