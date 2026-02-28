import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [phase, setPhase] = useState<'idle' | 'enter' | 'exit'>('idle');
    const [displayChildren, setDisplayChildren] = useState(children);
    const prevPathRef = useRef(location.pathname);
    const isFirstRender = useRef(true);

    const runTransition = useCallback(() => {
        // Phase 1: Dark curtain slides IN from left
        setPhase('enter');

        // Phase 2: At midpoint, swap content & start curtain sliding OUT
        setTimeout(() => {
            setDisplayChildren(children);
            window.scrollTo(0, 0);
            setPhase('exit');
        }, 600);

        // Phase 3: Reset
        setTimeout(() => {
            setPhase('idle');
        }, 1200);
    }, [children]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            prevPathRef.current = location.pathname;
            return;
        }

        if (location.pathname === prevPathRef.current) return;
        prevPathRef.current = location.pathname;

        runTransition();
    }, [location.pathname, runTransition]);

    // Keep children in sync when not transitioning
    useEffect(() => {
        if (phase === 'idle') {
            setDisplayChildren(children);
        }
    }, [children, phase]);

    return (
        <>
            <div className="page-content">{displayChildren}</div>

            {/* Single curtain panel with Marvel logo */}
            <div className={`page-curtain ${phase}`}>
                <div className="curtain-bg" />
                <div className="curtain-logo">
                    <span className="curtain-m">M</span>
                </div>
            </div>
        </>
    );
};

export default PageTransition;
