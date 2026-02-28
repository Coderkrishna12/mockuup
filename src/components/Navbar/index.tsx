import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchOverlay from '../SearchOverlay';
import './Navbar.css';

const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/characters', label: 'CHARACTERS' },
    { path: '/movies', label: 'MOVIES' },
    { path: '/shows', label: 'SHOWS' },
    { path: '/comics', label: 'COMICS' },
    { path: '/news', label: 'NEWS' },
    { path: '/timeline', label: 'TIMELINE' },
    { path: '/compare', label: 'COMPARE' },
    { path: '/quiz', label: 'QUIZ' },
    { path: '/about', label: 'ABOUT' },
];

const Navbar: React.FC = () => {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-inner">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-marvel">MARVEL</span>
                    <span className="logo-multi">MULTIVERSE</span>
                </Link>

                {/* Desktop Links */}
                <div className="navbar-links">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path)) ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <SearchOverlay />
                </div>

                {/* Mobile Toggle */}
                <button className={`navbar-toggle ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`navbar-mobile ${mobileOpen ? 'open' : ''}`}>
                {navLinks.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
