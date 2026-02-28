import React, { useState, useEffect } from 'react';
import './StoneCollector.css';

type Stone = {
    id: string;
    name: string;
    color: string;
    sectionId: string;
};

const stonesData: Stone[] = [
    { id: 'space', name: 'Space Stone', color: '#1A5B9C', sectionId: 'hero' }, // Will map to body or first section
    { id: 'mind', name: 'Mind Stone', color: '#F0C040', sectionId: 'characters' },
    { id: 'reality', name: 'Reality Stone', color: '#E8002D', sectionId: 'story' },
    { id: 'power', name: 'Power Stone', color: '#8B5CF6', sectionId: 'multiverse' },
    { id: 'time', name: 'Time Stone', color: '#14B8A6', sectionId: 'timeline' },
    { id: 'soul', name: 'Soul Stone', color: '#D97706', sectionId: 'quiz' }
];

const StoneCollector: React.FC = () => {
    // Initialize from sessionStorage to persist across refreshes
    const [collectedStones, setCollectedStones] = useState<string[]>(() => {
        const saved = sessionStorage.getItem('marvel-stones');
        return saved ? JSON.parse(saved) : [];
    });

    const [recentlyCollected, setRecentlyCollected] = useState<string | null>(null);

    useEffect(() => {
        sessionStorage.setItem('marvel-stones', JSON.stringify(collectedStones));
    }, [collectedStones]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const stone = stonesData.find(s => s.sectionId === sectionId);

                    if (stone && !collectedStones.includes(stone.id)) {
                        setCollectedStones(prev => [...prev, stone.id]);
                        setRecentlyCollected(stone.id);

                        // Clear recent notification after 3s
                        setTimeout(() => setRecentlyCollected(null), 3000);
                    }
                }
            });
        }, { threshold: 0.5 });

        // Try to observe the mapped sections
        stonesData.forEach(stone => {
            // Hero section doesn't have an ID, use body to collect first stone immediately
            const el = stone.sectionId === 'hero' ? document.body : document.getElementById(stone.sectionId);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [collectedStones]);

    const allCollected = collectedStones.length === 6;

    return (
        <div className={`stone-collector-hud ${allCollected ? 'gauntlet-complete' : ''}`}>
            <div className="gauntlet-base">
                {stonesData.map((stone) => {
                    const isCollected = collectedStones.includes(stone.id);
                    const isRecent = recentlyCollected === stone.id;

                    return (
                        <div
                            key={stone.id}
                            className={`stone-slot ${stone.id} ${isCollected ? 'collected' : ''} ${isRecent ? 'recent-flash' : ''}`}
                            style={{ '--stone-color': stone.color } as React.CSSProperties}
                        >
                            <div className="stone-gem"></div>
                        </div>
                    );
                })}
            </div>

            {recentlyCollected && (
                <div className="stone-notification">
                    {stonesData.find(s => s.id === recentlyCollected)?.name} Collected!
                </div>
            )}

            {allCollected && (
                <div className="gauntlet-power-surge"></div>
            )}
        </div>
    );
};

export default StoneCollector;
