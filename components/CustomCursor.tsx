"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useCursor, CursorType } from "@/lib/CursorContext";

const CustomCursor: React.FC = () => {
    const { cursorType } = useCursor();
    const [isHovering, setIsHovering] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 400 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.matchMedia("(max-width: 768px)").matches || "ontouchstart" in window;
            setIsMobile(mobile);

            // Apply cursor: none to body only on desktop
            if (!mobile) {
                document.body.classList.add('custom-cursor-active');
            } else {
                document.body.classList.remove('custom-cursor-active');
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isMobile) return;
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => setIsPressed(true);
        const handleMouseUp = () => setIsPressed(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.closest('button') ||
                target.closest('a') ||
                target.closest('[role="button"]') ||
                target.classList.contains('cursor-pointer') ||
                target.closest('.interactive-card');

            setIsHovering(!!isInteractive);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseover", handleMouseOver);

        return () => {
            document.body.classList.remove('custom-cursor-active');
            window.removeEventListener("resize", checkMobile);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseover", handleMouseOver);
        };
    }, [isMobile, isVisible, mouseX, mouseY]);

    if (isMobile || !isVisible) return null;

    const getCursorAsset = () => {
        switch (cursorType) {
            case "iron-man":
                return "/cursor-ironman.png";
            case "captain-america":
                return "/cursor-cap.png";
            case "thor":
                return "/cursor-thor.png";
            default:
                return null;
        }
    };

    const assetUrl = getCursorAsset();

    // Minimalistic glow - only subtle light
    const glowColor = {
        "iron-man": "rgba(34, 211, 238, 0.2)",
        "captain-america": "rgba(59, 130, 246, 0.2)",
        "thor": "rgba(147, 197, 253, 0.2)",
        "minimal": "rgba(255, 255, 255, 0.2)"
    }[cursorType];

    const renderCursor = () => {
        if (cursorType === "iron-man") {
            return (
                <motion.div
                    key="iron-man"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="relative w-8 h-8 flex items-center justify-center p-0"
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_4px_rgba(34,211,238,0.4)]">
                        {/* Outer Ring */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5,3" className="opacity-30" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#22d3ee" strokeWidth="4" className="opacity-50" />
                        {/* Inner Details */}
                        <circle cx="50" cy="50" r="25" fill="none" stroke="#22d3ee" strokeWidth="8" strokeDasharray="10,5" />
                        <circle cx="50" cy="50" r="15" fill="#fff" className="shadow-[0_0_10px_#fff]" />
                        {/* Tech Accents */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                            <line
                                key={angle}
                                x1="50" y1="10" x2="50" y2="20"
                                transform={`rotate(${angle} 50 50)`}
                                stroke="#22d3ee" strokeWidth="2"
                            />
                        ))}
                    </svg>
                    <div
                        className="absolute inset-0 rounded-full blur-xl -z-10 bg-cyan-400/10"
                    />
                </motion.div>
            );
        }

        if (assetUrl) {
            return (
                <motion.div
                    key={cursorType}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="relative p-0 flex items-center justify-center"
                >
                    <img
                        src={assetUrl}
                        alt={`${cursorType} cursor`}
                        className="w-8 h-8 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                    />
                    <div
                        className="absolute inset-0 rounded-full blur-lg -z-10"
                        style={{ backgroundColor: glowColor }}
                    />
                </motion.div>
            );
        }

        return (
            <motion.div
                key="minimal"
                className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center bg-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]" />
            </motion.div>
        );
    };

    return (
        <motion.div
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                x: cursorX,
                y: cursorY,
                pointerEvents: "none",
                zIndex: 9999,
                translateX: "-50%",
                translateY: "-50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            animate={{
                scale: isPressed ? 0.85 : isHovering ? 1.15 : 1,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
        >
            <AnimatePresence mode="wait">
                {renderCursor()}
            </AnimatePresence>
        </motion.div>
    );
};

export default CustomCursor;
