import React, { useState, useMemo } from 'react';
import { allCharacters } from '../utils/characterProfiles';
import type { CharacterProfile } from '../utils/characterProfiles';
import Footer from '../components/Footer';
import './HeroCompare.css';

const statLabels = ['strength', 'speed', 'durability', 'energy', 'combat', 'intelligence'] as const;

const HeroCompare: React.FC = () => {
    const [heroA, setHeroA] = useState<CharacterProfile | null>(null);
    const [heroB, setHeroB] = useState<CharacterProfile | null>(null);
    const [picking, setPicking] = useState<'A' | 'B' | null>(null);
    const [searchQ, setSearchQ] = useState('');

    const searchResults = useMemo(() => {
        if (!searchQ) return allCharacters;
        return allCharacters.filter((c: CharacterProfile) => c.name.toLowerCase().includes(searchQ.toLowerCase()));
    }, [searchQ]);

    const selectHero = (hero: CharacterProfile) => {
        if (picking === 'A') setHeroA(hero);
        else if (picking === 'B') setHeroB(hero);
        setPicking(null);
        setSearchQ('');
    };

    const overallA = heroA ? Math.round(statLabels.reduce((sum, s) => sum + (heroA.powers[s] || 0), 0) / statLabels.length) : 0;
    const overallB = heroB ? Math.round(statLabels.reduce((sum, s) => sum + (heroB.powers[s] || 0), 0) / statLabels.length) : 0;

    return (
        <div className="compare-page">
            <header className="compare-header">
                <div className="container">
                    <div className="compare-badge">
                        <span className="badge-line"></span>
                        <span>HERO VS HERO</span>
                    </div>
                    <h1 className="compare-title">HERO COMPARISON</h1>
                    <p className="compare-subtitle">Select two heroes to compare their power stats</p>
                </div>
            </header>

            <div className="container">
                <div className="compare-arena">
                    {/* Hero A */}
                    <div className="compare-slot" style={{ '--slot-color': heroA?.color || '#E8002D' } as React.CSSProperties}>
                        {heroA ? (
                            <div className="slot-filled">
                                <div className="slot-avatar" style={{ background: `linear-gradient(135deg, ${heroA.color}30, transparent)` }}>
                                    <span className="slot-initial">{heroA.name[0]}</span>
                                </div>
                                <h3 className="slot-name">{heroA.name}</h3>
                                <span className="slot-alias">{heroA.alias}</span>
                                <div className="slot-overall">
                                    <span className="overall-number">{overallA}</span>
                                    <span className="overall-label">OVERALL</span>
                                </div>
                                <button className="btn-swap" onClick={() => { setPicking('A'); }}>CHANGE</button>
                            </div>
                        ) : (
                            <button className="slot-empty" onClick={() => setPicking('A')}>
                                <span className="slot-plus">+</span>
                                <span>SELECT HERO</span>
                            </button>
                        )}
                    </div>

                    {/* VS Badge */}
                    <div className="vs-badge">
                        <span>VS</span>
                    </div>

                    {/* Hero B */}
                    <div className="compare-slot" style={{ '--slot-color': heroB?.color || '#1E3A8A' } as React.CSSProperties}>
                        {heroB ? (
                            <div className="slot-filled">
                                <div className="slot-avatar" style={{ background: `linear-gradient(135deg, ${heroB.color}30, transparent)` }}>
                                    <span className="slot-initial">{heroB.name[0]}</span>
                                </div>
                                <h3 className="slot-name">{heroB.name}</h3>
                                <span className="slot-alias">{heroB.alias}</span>
                                <div className="slot-overall">
                                    <span className="overall-number">{overallB}</span>
                                    <span className="overall-label">OVERALL</span>
                                </div>
                                <button className="btn-swap" onClick={() => { setPicking('B'); }}>CHANGE</button>
                            </div>
                        ) : (
                            <button className="slot-empty" onClick={() => setPicking('B')}>
                                <span className="slot-plus">+</span>
                                <span>SELECT HERO</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Stat Bars */}
                {heroA && heroB && (
                    <div className="compare-stats">
                        <h2 className="stats-header">POWER STATS</h2>
                        {statLabels.map((stat, i) => {
                            const valA = heroA.powers[stat] || 0;
                            const valB = heroB.powers[stat] || 0;
                            const winnerA = valA > valB;
                            const winnerB = valB > valA;
                            return (
                                <div key={stat} className="stat-row" style={{ '--row-delay': `${i * 100}ms` } as React.CSSProperties}>
                                    <div className={`stat-val-a ${winnerA ? 'winner' : ''}`}>{valA}</div>
                                    <div className="stat-bar-container">
                                        <div className="stat-bar-a" style={{ width: `${valA}%`, background: heroA.color, animationDelay: `${i * 100}ms` }}></div>
                                        <span className="stat-label">{stat.toUpperCase()}</span>
                                        <div className="stat-bar-b" style={{ width: `${valB}%`, background: heroB.color, animationDelay: `${i * 100}ms` }}></div>
                                    </div>
                                    <div className={`stat-val-b ${winnerB ? 'winner' : ''}`}>{valB}</div>
                                </div>
                            );
                        })}
                        <div className="stat-row overall-row">
                            <div className={`stat-val-a ${overallA > overallB ? 'winner' : ''}`}>{overallA}</div>
                            <div className="stat-bar-container">
                                <div className="stat-bar-a" style={{ width: `${overallA}%`, background: heroA.color }}></div>
                                <span className="stat-label overall-stat-label">OVERALL</span>
                                <div className="stat-bar-b" style={{ width: `${overallB}%`, background: heroB.color }}></div>
                            </div>
                            <div className={`stat-val-b ${overallB > overallA ? 'winner' : ''}`}>{overallB}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hero Picker Modal */}
            {picking && (
                <div className="picker-overlay" onClick={() => { setPicking(null); setSearchQ(''); }}>
                    <div className="picker-modal" onClick={e => e.stopPropagation()}>
                        <button className="picker-close" onClick={() => { setPicking(null); setSearchQ(''); }}>✕</button>
                        <h3 className="picker-title">SELECT HERO {picking}</h3>
                        <input
                            type="text"
                            className="picker-search"
                            placeholder="Search heroes..."
                            value={searchQ}
                            onChange={e => setSearchQ(e.target.value)}
                            autoFocus
                        />
                        <div className="picker-grid">
                            {searchResults.map((char: CharacterProfile) => (
                                <button key={char.id} className="picker-item" onClick={() => selectHero(char)} style={{ '--pick-color': char.color } as React.CSSProperties}>
                                    <span className="picker-initial" style={{ color: char.color }}>{char.name[0]}</span>
                                    <span className="picker-name">{char.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default HeroCompare;
