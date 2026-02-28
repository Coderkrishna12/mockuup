import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);
            setEmail('');
        }
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-glow"></div>
            <div className="container">
                <div className="newsletter-box">
                    <div className="newsletter-content">
                        <h3 className="newsletter-title">JOIN THE INITIATIVE</h3>
                        <p className="newsletter-desc">
                            Get exclusive updates on upcoming Marvel projects, character reveals, and multiverse events delivered straight to your inbox.
                        </p>
                    </div>
                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="newsletter-input"
                                required
                            />
                            <button type="submit" className={`newsletter-btn ${isSubmitted ? 'submitted' : ''}`}>
                                {isSubmitted ? '✓ ENLISTED' : 'SIGN UP'}
                            </button>
                        </div>
                        <p className="newsletter-legal">By signing up, you agree to receive Marvel updates. Unsubscribe anytime.</p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
