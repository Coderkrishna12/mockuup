import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ComicModeToggle.css';

const ComicModeToggle: React.FC = () => {
    const { isComicMode, toggleComicMode } = useTheme();

    return (
        <div className={`comic-toggle-container ${isComicMode ? 'active' : ''}`}>
            <button
                className="comic-toggle-btn"
                onClick={toggleComicMode}
                title="Toggle Comic Book Mode"
            >
                <div className="comic-toggle-slider"></div>
                <span className="comic-label">COMIC MODE</span>
            </button>
        </div>
    );
};

export default ComicModeToggle;
