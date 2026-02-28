import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AudioContextType {
    isMuted: boolean;
    toggleMute: () => void;
    playTone: (freq: number) => void;
}

const AudioUIContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

    useEffect(() => {
        if (!isMuted && !audioCtx) {
            setAudioCtx(new window.AudioContext());
        }
    }, [isMuted, audioCtx]);

    const toggleMute = () => setIsMuted(!isMuted);

    const playTone = (freq: number) => {
        if (isMuted || !audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1);
    };

    return (
        <AudioUIContext.Provider value={{ isMuted, toggleMute, playTone }}>
            {children}
        </AudioUIContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioUIContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
