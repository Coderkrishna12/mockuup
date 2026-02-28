import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { charactersData } from '../utils/charactersData';

type ThemeType = 'default' | 'comic' | keyof typeof charactersData;

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    isComicMode: boolean;
    toggleComicMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>('default');
    const [isComicMode, setIsComicMode] = useState(false);

    useEffect(() => {
        // Apply dataset attribute for theme styling hook
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    useEffect(() => {
        // Apply body class for comic mode
        if (isComicMode) {
            document.body.classList.add('comic-mode');
        } else {
            document.body.classList.remove('comic-mode');
        }
    }, [isComicMode]);

    const toggleComicMode = () => setIsComicMode((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isComicMode, toggleComicMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
