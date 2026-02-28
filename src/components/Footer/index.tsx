import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="marvel-footer">
            <div className="footer-top-line"></div>
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="brand-box">MARVEL</span>
                            <span className="brand-sub">MULTIVERSE</span>
                        </div>
                        <p className="footer-tagline">
                            The ultimate digital Marvel experience. Explore characters, stories, and infinite universes.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="social-link" aria-label="Twitter">𝕏</a>
                            <a href="#" className="social-link" aria-label="Instagram">IG</a>
                            <a href="#" className="social-link" aria-label="YouTube">YT</a>
                            <a href="#" className="social-link" aria-label="Discord">DC</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">EXPLORE</h4>
                        <a href="#characters" className="footer-link">Characters</a>
                        <a href="#story" className="footer-link">Comics</a>
                        <a href="#timeline" className="footer-link">Timeline</a>
                        <a href="#multiverse" className="footer-link">Multiverse</a>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-col-title">MEDIA</h4>
                        <a href="#" className="footer-link">Movies</a>
                        <a href="#" className="footer-link">TV Shows</a>
                        <a href="#" className="footer-link">Trailers</a>
                        <a href="#news" className="footer-link">News</a>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-col-title">MORE</h4>
                        <a href="#" className="footer-link">Marvel Unlimited</a>
                        <a href="#" className="footer-link">Shop</a>
                        <a href="#" className="footer-link">Games</a>
                        <a href="#" className="footer-link">About</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Marvel Multiverse. Built for educational purposes.</p>
                    <p className="footer-credits">Crafted with ❤️ for the Multiverse</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
