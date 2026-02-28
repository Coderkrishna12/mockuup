import React, { useState, useEffect, useRef } from 'react';
import './Loader.css';

const Loader: React.FC = () => {
    const [phase, setPhase] = useState<'playing' | 'blending' | 'done'>('playing');
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => {
            // Video finished — start the blending transition
            setPhase('blending');
            setTimeout(() => {
                setPhase('done');
            }, 1200);
        };

        video.addEventListener('ended', handleEnded);

        // Fallback: if video takes too long, auto-blend after 20s
        const fallbackTimer = setTimeout(() => {
            if (phase === 'playing') {
                setPhase('blending');
                setTimeout(() => setPhase('done'), 1200);
            }
        }, 20000);

        return () => {
            video.removeEventListener('ended', handleEnded);
            clearTimeout(fallbackTimer);
        };
    }, [phase]);

    if (phase === 'done') return null;

    return (
        <div className={`cinematic-loader ${phase === 'blending' ? 'blending' : ''}`}>
            {/* Full-screen native video */}
            <video
                ref={videoRef}
                className="loader-video-native"
                src="/marvel-intro.mp4"
                autoPlay
                muted
                playsInline
            />

            {/* Dark vignette overlay */}
            <div className="loader-vignette" />

            {/* Skip button */}
            <button
                className="loader-skip"
                onClick={() => {
                    const video = videoRef.current;
                    if (video) video.pause();
                    setPhase('blending');
                    setTimeout(() => setPhase('done'), 1200);
                }}
            >
                SKIP INTRO →
            </button>

            {/* Blend transition overlay */}
            <div className="blend-overlay" />
        </div>
    );
};

export default Loader;
