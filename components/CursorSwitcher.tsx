"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor, CursorType } from "@/lib/CursorContext";
import { Settings, Shield, Zap, Circle } from "lucide-react";

const CursorSwitcher: React.FC = () => {
    const { cursorType, setCursorType } = useCursor();
    const [isOpen, setIsOpen] = useState(false);

    const options: { id: CursorType; name: string; icon: React.ReactNode; color: string }[] = [
        { id: "minimal", name: "Classic", icon: <Circle size={16} />, color: "#ffffff" },
        { id: "iron-man", name: "Stark Tech", icon: <Zap size={16} />, color: "#ED1D24" },
        { id: "captain-america", name: "The Shield", icon: <Shield size={16} />, color: "#3b82f6" },
        { id: "thor", name: "The Hammer", icon: <Zap size={16} className="text-blue-300" />, color: "#93c5fd" },
    ];

    return (
        <div className="fixed bottom-24 md:bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="glass p-3 rounded-2xl flex flex-col gap-2 min-w-[160px] border border-white/10 shadow-2xl"
                    >
                        <p className="text-[10px] uppercase tracking-widest text-white/40 px-2 pb-1">
                            Cursor Theme
                        </p>
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setCursorType(opt.id)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${cursorType === opt.id
                                    ? "bg-white/10 border border-white/20"
                                    : "hover:bg-white/5 border border-transparent"
                                    }`}
                            >
                                <div
                                    className="p-1.5 rounded-lg"
                                    style={{
                                        backgroundColor: cursorType === opt.id ? opt.color : 'transparent',
                                        color: cursorType === opt.id ? '#000' : opt.color
                                    }}
                                >
                                    {opt.icon}
                                </div>
                                <span className="text-xs font-medium text-white/80">
                                    {opt.name}
                                </span>
                                {cursorType === opt.id && (
                                    <motion.div
                                        layoutId="active-dot"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"
                                    />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isOpen ? "glass border-white/20 rotate-90" : "bg-marvel-red text-white"
                    }`}
            >
                <Settings size={20} className={isOpen ? "text-white" : ""} />
            </button>
        </div>
    );
};

export default CursorSwitcher;
