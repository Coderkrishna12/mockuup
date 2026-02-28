import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allCharacters } from '../../utils/characterProfiles';
import { allMovies } from '../../utils/moviesData';
import type { Movie } from '../../utils/moviesData';
import { allShows } from '../../utils/showsData';
import { allComics } from '../../utils/comicsData';
import type { Comic } from '../../utils/comicsData';
import './SearchOverlay.css';

interface SearchResult {
    id: string;
    title: string;
    subtitle: string;
    category: 'character' | 'movie' | 'show' | 'comic';
    color: string;
    route: string;
}

const SearchOverlay: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Keyboard shortcut: Ctrl+K to open
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(true);
            }
            if (e.key === 'Escape') {
                setOpen(false);
                setQuery('');
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const results = useMemo<SearchResult[]>(() => {
        if (!query || query.length < 2) return [];
        const q = query.toLowerCase();
        const items: SearchResult[] = [];

        // Characters
        allCharacters.filter(c => c.name.toLowerCase().includes(q) || c.alias.toLowerCase().includes(q))
            .slice(0, 5)
            .forEach(c => items.push({ id: c.id, title: c.name, subtitle: c.alias, category: 'character', color: c.color, route: `/characters/${c.id}` }));

        // Movies
        allMovies.filter((m: Movie) => m.title.toLowerCase().includes(q))
            .slice(0, 4)
            .forEach((m: Movie) => items.push({ id: m.id, title: m.title, subtitle: `${m.year} · Phase ${m.phase}`, category: 'movie', color: '#E8002D', route: `/movies/${m.id}` }));

        // Shows
        allShows.filter(s => s.title.toLowerCase().includes(q))
            .slice(0, 3)
            .forEach(s => items.push({ id: s.id, title: s.title, subtitle: `${s.year} · ${s.status}`, category: 'show', color: s.color, route: `/shows` }));

        // Comics
        allComics.filter((c: Comic) => c.title.toLowerCase().includes(q) || c.series.toLowerCase().includes(q))
            .slice(0, 3)
            .forEach((c: Comic) => items.push({ id: c.id, title: c.title, subtitle: `${c.year} · ${c.series}`, category: 'comic', color: '#F0C040', route: `/comics` }));

        return items;
    }, [query]);

    const categoryIcons: Record<string, string> = {
        character: '🦸',
        movie: '🎬',
        show: '📺',
        comic: '📚',
    };

    const handleSelect = (result: SearchResult) => {
        navigate(result.route);
        setOpen(false);
        setQuery('');
    };

    return (
        <>
            {/* Search Trigger in Navbar */}
            <button className="search-trigger" onClick={() => setOpen(true)} title="Search (Ctrl+K)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <span className="search-shortcut">Ctrl+K</span>
            </button>

            {/* Full-screen Overlay */}
            {open && (
                <div className="search-overlay" onClick={() => { setOpen(false); setQuery(''); }}>
                    <div className="search-modal" onClick={e => e.stopPropagation()}>
                        <div className="search-input-row">
                            <svg className="search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                className="search-input"
                                placeholder="Search characters, movies, shows, comics..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <button className="search-close-btn" onClick={() => { setOpen(false); setQuery(''); }}>ESC</button>
                        </div>

                        {results.length > 0 && (
                            <div className="search-results">
                                {results.map((r, i) => (
                                    <button
                                        key={`${r.category}-${r.id}`}
                                        className="search-result-item"
                                        onClick={() => handleSelect(r)}
                                        style={{ '--result-delay': `${i * 30}ms`, '--result-color': r.color } as React.CSSProperties}
                                    >
                                        <span className="result-icon">{categoryIcons[r.category]}</span>
                                        <div className="result-info">
                                            <span className="result-title">{r.title}</span>
                                            <span className="result-subtitle">{r.subtitle}</span>
                                        </div>
                                        <span className="result-badge">{r.category.toUpperCase()}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {query.length >= 2 && results.length === 0 && (
                            <div className="search-empty">
                                <span>🕸️</span>
                                <p>No results found for "{query}"</p>
                            </div>
                        )}

                        {query.length < 2 && (
                            <div className="search-hints">
                                <p className="hints-label">QUICK LINKS</p>
                                <div className="hints-grid">
                                    <button className="hint-chip" onClick={() => { navigate('/characters'); setOpen(false); }}>🦸 Characters</button>
                                    <button className="hint-chip" onClick={() => { navigate('/movies'); setOpen(false); }}>🎬 Movies</button>
                                    <button className="hint-chip" onClick={() => { navigate('/shows'); setOpen(false); }}>📺 Shows</button>
                                    <button className="hint-chip" onClick={() => { navigate('/comics'); setOpen(false); }}>📚 Comics</button>
                                    <button className="hint-chip" onClick={() => { navigate('/timeline'); setOpen(false); }}>⏳ Timeline</button>
                                    <button className="hint-chip" onClick={() => { navigate('/quiz'); setOpen(false); }}>🎯 Quiz</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchOverlay;
