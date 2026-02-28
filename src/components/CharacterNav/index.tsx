import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { charactersData } from '../../utils/charactersData';
import './CharacterNav.css';

// Import the matching poses for each character key
import ironmanImg from '../../assets/images/iron-man.png';
import thorImg from '../../assets/images/thor.png';
import strangeImg from '../../assets/images/doctor-strange.png';
import capImg from '../../assets/images/captain-america.png';
import hulkImg from '../../assets/images/hulk.png';

// Map character data keys to their image assets
const charImages: Record<string, string> = {
    ironman: ironmanImg,
    thor: thorImg,
    strange: strangeImg,
    cap: capImg,
    hulk: hulkImg,
};

// Display names for the UI
const charDisplayNames: Record<string, string> = {
    ironman: 'IRON MAN',
    thor: 'THOR',
    strange: 'DR. STRANGE',
    cap: 'CAPTAIN AMERICA',
    hulk: 'HULK',
};

const CharacterNav: React.FC = () => {
    const { setTheme, theme } = useTheme();
    const [hoveredChar, setHoveredChar] = useState<string | null>(null);

    const handleCharacterClick = (charKey: keyof typeof charactersData) => {
        setTheme(charKey);
    };

    const activeData = charactersData[(hoveredChar || theme) as keyof typeof charactersData];
    const glowColor = activeData?.primary || '#E8002D';

    return (
        <section
            className="charsel-v3"
            id="characters"
            style={{ '--glow-color': glowColor } as React.CSSProperties}
        >
            <div className="charsel-glow-bg"></div>

            <div className="container">
                <div className="charsel-header">
                    <div className="charsel-badge">
                        <span className="badge-line"></span>
                        <span>CHOOSE YOUR HERO</span>
                    </div>
                    <h2 className="section-title">THE AVENGERS INITIATIVE</h2>
                </div>

                <div className="charsel-grid">
                    {(Object.keys(charactersData) as Array<keyof typeof charactersData>).map((key) => {
                        const char = charactersData[key];
                        const isActive = theme === key;

                        return (
                            <div
                                key={key}
                                className={`charsel-card ${isActive ? 'active' : ''}`}
                                style={{ '--char-color': char.primary } as React.CSSProperties}
                                onClick={() => handleCharacterClick(key)}
                                onMouseEnter={() => setHoveredChar(key)}
                                onMouseLeave={() => setHoveredChar(null)}
                            >
                                {/* Character Image */}
                                <div className="charsel-img-wrap">
                                    <img
                                        src={charImages[key]}
                                        alt={charDisplayNames[key] || key}
                                        className="charsel-img"
                                    />
                                </div>

                                {/* Info Panel */}
                                <div className="charsel-info">
                                    <h3 className="charsel-name">{charDisplayNames[key] || key.toUpperCase()}</h3>
                                    <div className="charsel-meta">
                                        <span className="meta-dot"></span>
                                        <span>EARTH-616</span>
                                    </div>
                                    <p className="charsel-quote">"{char.quote}"</p>
                                    <div className="charsel-action">
                                        <span>{isActive ? '● ACTIVE' : 'SELECT →'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CharacterNav;
