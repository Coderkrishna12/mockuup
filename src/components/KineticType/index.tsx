import React, { useEffect, useRef } from 'react';
import './KineticType.css';

const KineticType: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    const quotes = [
        { text: "I AM IRON MAN.", glowingWord: "IRON MAN." },
        { text: "AVENGERS... ASSEMBLE.", glowingWord: "ASSEMBLE." },
        { text: "WHATEVER IT TAKES.", glowingWord: "TAKES." }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });

        if (sectionRef.current) {
            const quoteEls = sectionRef.current.querySelectorAll('.kinetic-quote');
            quoteEls.forEach(el => observer.observe(el));
        }

        return () => observer.disconnect();
    }, []);

    // Helper to split a string into individual spans for animation
    const splitText = (text: string, glowingWord: string) => {
        return text.split('').map((char, index) => {
            if (char === ' ') return <span key={index} className="space">&nbsp;</span>;

            // Determine if this character is part of the glowing word
            const isGlowingPart = glowingWord.includes(char) && text.indexOf(glowingWord) <= index && index < text.indexOf(glowingWord) + glowingWord.length;

            // Randomize starting positions for the "fly in" effect
            const tx = (Math.random() - 0.5) * 500;
            const ty = (Math.random() - 0.5) * 500;
            const rot = (Math.random() - 0.5) * 180;

            return (
                <span
                    key={index}
                    className={`kinetic-char ${isGlowingPart ? 'glow-target' : ''}`}
                    style={{
                        '--tx': `${tx}px`,
                        '--ty': `${ty}px`,
                        '--rot': `${rot}deg`,
                        animationDelay: `${index * 0.05}s`
                    } as React.CSSProperties}
                >
                    {char}
                </span>
            );
        });
    };

    return (
        <section className="kinetic-section" id="quotes" ref={sectionRef}>
            <div className="container" style={{ position: 'relative', height: '100%' }}>
                {quotes.map((quote, i) => (
                    <div key={i} className={`kinetic-quote quote-${i + 1}`}>
                        {splitText(quote.text, quote.glowingWord)}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default KineticType;
