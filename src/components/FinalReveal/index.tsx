import React, { useEffect, useRef } from 'react';
import './FinalReveal.css';

const FinalReveal: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || !logoRef.current || !textRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how far we are scrolled into this section
            // 0 = just entered bottom of screen, 1 = touching top of screen
            if (rect.top <= windowHeight && rect.bottom >= 0) {
                const progress = 1 - (rect.top / windowHeight);

                // Parallax effects
                // Logo starts large and scales down to normal size as we scroll down
                const scale = Math.max(1, 3 - (progress * 2));
                const opacity = Math.min(1, progress * 1.5);

                logoRef.current.style.transform = `scale(${scale})`;
                logoRef.current.style.opacity = opacity.toString();

                // Text fades in late
                if (progress > 0.6) {
                    const textOpacity = (progress - 0.6) * 2.5;
                    textRef.current.style.opacity = Math.min(1, textOpacity).toString();
                    textRef.current.style.transform = `translateY(${(1 - Math.min(1, textOpacity)) * 50}px)`;
                } else {
                    textRef.current.style.opacity = '0';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // init
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <footer className="final-reveal-section" ref={containerRef}>
            <div className="reveal-content">
                <div className="avengers-logo-container" ref={logoRef}>
                    {/* Using a stylized representation of the A logo since we don't have SVGs */}
                    <div className="avengers-a">
                        <div className="a-left"></div>
                        <div className="a-right"></div>
                        <div className="a-cross"></div>
                        <div className="a-circle"></div>
                    </div>
                </div>

                <div className="reveal-text" ref={textRef}>
                    <h2>THE MULTIVERSE IS YOURS</h2>
                    <p>This is just the beginning.</p>
                    <div className="credits">
                        Built for the Marvel Hackathon
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} MARVEL MULTIVERSE EXPERIMENTAL BUILD. NO COPYRIGHT INFRINGEMENT INTENDED.</p>
            </div>
        </footer>
    );
};

export default FinalReveal;
