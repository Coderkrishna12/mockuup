"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CursorType = "minimal" | "iron-man" | "captain-america" | "thor";

interface CursorContextType {
    cursorType: CursorType;
    setCursorType: (type: CursorType) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cursorType, setCursorTypeState] = useState<CursorType>("minimal");

    // Load preference from localStorage on mount
    useEffect(() => {
        const savedCursor = localStorage.getItem("marvel-cursor-pref") as CursorType;
        if (savedCursor && ["minimal", "iron-man", "captain-america", "thor"].includes(savedCursor)) {
            setCursorTypeState(savedCursor);
        }
    }, []);

    const setCursorType = (type: CursorType) => {
        setCursorTypeState(type);
        localStorage.setItem("marvel-cursor-pref", type);
    };

    return (
        <CursorContext.Provider value={{ cursorType, setCursorType }}>
            {children}
        </CursorContext.Provider>
    );
};

export const useCursor = () => {
    const context = useContext(CursorContext);
    if (!context) {
        throw new Error("useCursor must be used within a CursorProvider");
    }
    return context;
};
