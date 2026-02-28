import React, { useEffect, useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import './EasterEggs.css';

const EasterEggs: React.FC = () => {
    const { playTone } = useAudio();

    const [thanosTyping, setThanosTyping] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // THANOS Typing Easter Egg
            const key = e.key.toUpperCase();
            if ('THANOS'.includes(key)) {
                setThanosTyping(prev => {
                    const newStr = prev + key;
                    if ('THANOS'.startsWith(newStr)) {
                        playTone(400 + newStr.length * 50);
                        if (newStr === 'THANOS') {
                            triggerThanosEgg();
                            return '';
                        }
                        return newStr;
                    }
                    return key === 'T' ? 'T' : '';
                });
            } else {
                setThanosTyping('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playTone]);

    const triggerThanosEgg = () => {
        document.body.classList.add('snap-active', 'thanos-typed');
        setTimeout(() => {
            document.body.classList.remove('snap-active', 'thanos-typed');
        }, 2000);
    };

    return (
        <>
            {/* Thanos Typing Visualizer */}
            {thanosTyping.length > 0 && (
                <div className="thanos-typing-hud">
                    {['T', 'H', 'A', 'N', 'O', 'S'].map((letter, i) => (
                        <span
                            key={i}
                            className={i < thanosTyping.length ? 'active' : ''}
                            style={{ '--stone-color': getStoneColor(i) } as React.CSSProperties}
                        >
                            {letter}
                        </span>
                    ))}
                </div>
            )}
        </>
    );
};

function getStoneColor(index: number) {
    const colors = ['#1A5B9C', '#F0C040', '#E8002D', '#8B5CF6', '#14B8A6', '#D97706'];
    return colors[index];
}

export default EasterEggs;
