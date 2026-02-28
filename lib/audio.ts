export interface AudioConfig {
    enabled: boolean;
    volume: number;
}

/** Simple audio manager for immersive sound effects */
class AudioManager {
    private audioContext: AudioContext | null = null;
    private sounds: Map<string, AudioBuffer> = new Map();
    private bgAudio: HTMLAudioElement | null = null;
    private _muted = true;
    private _volume = 0.3;

    get muted(): boolean {
        return this._muted;
    }

    get volume(): number {
        return this._volume;
    }

    private getContext(): AudioContext | null {
        if (typeof window === "undefined") return null;
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
        return this.audioContext;
    }

    private getBgAudio(): HTMLAudioElement | null {
        if (typeof window === "undefined") return null;
        if (!this.bgAudio) {
            this.bgAudio = new Audio("/characters/marvel-audio.mpeg");
            this.bgAudio.loop = true;
            this.bgAudio.volume = this._volume;
        }
        return this.bgAudio;
    }

    toggleMute(): boolean {
        this._muted = !this._muted;
        const bg = this.getBgAudio();
        if (bg) {
            if (this._muted) {
                bg.pause();
            } else {
                bg.play().catch(e => console.warn("Audio autoplay prevented:", e));
            }
        }
        return this._muted;
    }

    setVolume(vol: number): void {
        this._volume = Math.min(1, Math.max(0, vol));
        if (this.bgAudio) {
            this.bgAudio.volume = this._volume;
        }
    }

    /** Play a simple synthesized tone for UI feedback */
    playTone(
        frequency: number = 440,
        duration: number = 0.1,
        type: OscillatorType = "sine"
    ): void {
        if (this._muted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
            gainNode.gain.setValueAtTime(this._volume * 0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch {
            // Silently fail if audio isn't available
        }
    }

    /** Hover sound effect */
    playHover(): void {
        this.playTone(800, 0.05, "sine");
    }

    /** Click activation sound */
    playClick(): void {
        this.playTone(600, 0.08, "triangle");
    }

    /** Timeline event activation */
    playTimelineEvent(): void {
        this.playTone(1200, 0.15, "sine");
    }

    /** Glitch / multiverse transition */
    playGlitch(): void {
        if (this._muted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            // Create a brief noise burst
            const bufferSize = ctx.sampleRate * 0.1;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.3;
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(this._volume * 0.15, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            source.connect(gainNode);
            gainNode.connect(ctx.destination);
            source.start();
        } catch {
            // Silently fail
        }
    }

    /** Ambient cosmic drone (loops) — returns stop function */
    startAmbient(): (() => void) | null {
        if (this._muted) return null;
        const ctx = this.getContext();
        if (!ctx) return null;

        try {
            const oscillator1 = ctx.createOscillator();
            const oscillator2 = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator1.type = "sine";
            oscillator1.frequency.setValueAtTime(55, ctx.currentTime);
            oscillator2.type = "sine";
            oscillator2.frequency.setValueAtTime(82.5, ctx.currentTime);

            gainNode.gain.setValueAtTime(this._volume * 0.02, ctx.currentTime);

            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator1.start();
            oscillator2.start();

            return () => {
                oscillator1.stop();
                oscillator2.stop();
            };
        } catch {
            return null;
        }
    }
}

export const audioManager = new AudioManager();
